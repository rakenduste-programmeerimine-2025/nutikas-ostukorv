import { notFound } from 'next/navigation'
import Navbar from '@/components/ui/navbar'
import { AuthButton } from '@/components/auth-button'
import { createClient } from '@/lib/supabase/server'
import SearchableProductGrid from '@/components/searchable-product-grid'

type Category = {
  id: string | number
  name: string
  slug: string
  [key: string]: unknown
}

type Product = {
  id: string | number
  name: string
  store_id: string | number | null
  [key: string]: unknown
}

type Store = {
  id: string | number
  name: string
  [key: string]: unknown
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const supabase = await createClient()

  const { data: categories, error: catErr } = await supabase
    .from('category')
    .select('*')
    .eq('slug', slug)
    .limit(1)

  if (catErr || !categories || categories.length === 0) return notFound()

  const category = categories[0] as Category

  const [{ data: products }, { data: stores }] = await Promise.all([
    supabase.from('product').select('*').eq('category_id', category.id),
    supabase.from('store').select('*'),
  ])

  const typedProducts = (products ?? []) as Product[]
  const typedStores = (stores ?? []) as Store[]

  const storesMap: Record<string, Store> = Object.fromEntries(
    typedStores.map(s => [String(s.id), s])
  )

  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-14 items-center">
        <Navbar links={[{ href: '/browse', label: 'Tooted' }]} right={<AuthButton />} />

        <div className="w-full max-w-5xl p-6 flex flex-col items-center gap-12">
          <h1 className="text-3xl font-bold mb-4">{category.name}</h1>

          <SearchableProductGrid
            categoryName={category.name}
            products={typedProducts}
            storesMap={storesMap}
          />
        </div>
      </div>
    </main>
  )
}
