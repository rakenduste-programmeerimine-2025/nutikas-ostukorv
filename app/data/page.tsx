import { createClient } from '@supabase/supabase-js'
import ProductCard from '@/components/product-card'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function Page() {
  // Fetch all tables
  const { data: stores, error: storeError } = await supabase.from('store').select('*')

  const { data: categories, error: categoryError } = await supabase.from('category').select('*')

  const { data: products, error: productError } = await supabase.from('product').select('*')

  // Handle errors
  if (storeError || categoryError || productError) {
    console.error('Errors:', storeError, categoryError, productError)
    return <p>Error loading data. Check console.</p>
  }

  const storesMap = Object.fromEntries((stores ?? []).map((s: any) => [s.id, s]))
  const categoriesMap = Object.fromEntries((categories ?? []).map((c: any) => [c.id, c]))

  return (
    <main style={{ padding: '32px' }}>
      <h1 className="mb-4">Products</h1>

      <div className="grid grid-cols-5 gap-4">
        {(products ?? []).map((p: any) => (
          <ProductCard
            key={p.id}
            product={p}
            categoryName={categoriesMap[p.category_id]?.name}
            storeName={storesMap[p.store_id]?.name}
          />
        ))}
      </div>
    </main>
  )
}
