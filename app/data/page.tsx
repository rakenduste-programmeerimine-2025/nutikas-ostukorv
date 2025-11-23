import { AuthButton } from '@/components/auth-button'
import { createClient } from '@supabase/supabase-js'
import ProductCard from '@/components/product-card'
import Navbar from '@/components/ui/navbar'

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
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-14 items-center">
        <Navbar
          links={[
            { href: '/data', label: 'Andmed' },
            { href: '/stores', label: 'Poenimekiri' },
            { href: '/', label: 'Otsing' },
          ]}
          right={<AuthButton />}
        />
        <div className="w-full max-w-5xl p-6 flex flex-col items-center gap-12">
          <h1 className="mb-4">Products</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(products ?? []).map((p: any) => (
              <ProductCard
                key={p.id}
                product={p}
                categoryName={categoriesMap[p.category_id]?.name}
                storeName={storesMap[p.store_id]?.name}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
