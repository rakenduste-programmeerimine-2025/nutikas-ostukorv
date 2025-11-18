import { createClient } from '@supabase/supabase-js'

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

  return (
    <main style={{ padding: '32px' }}>
      <h1>Stores</h1>
      <pre>{JSON.stringify(stores, null, 2)}</pre>

      <h1>Categories</h1>
      <pre>{JSON.stringify(categories, null, 2)}</pre>

      <h1>Products</h1>
      <pre>{JSON.stringify(products, null, 2)}</pre>
    </main>
  )
}
