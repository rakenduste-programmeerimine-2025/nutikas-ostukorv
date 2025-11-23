import { notFound } from 'next/navigation'
import Navbar from '@/components/ui/navbar'
import { AuthButton } from '@/components/auth-button'
import { createClient } from '@/lib/supabase/server'
import ProductCard from '@/components/product-card'

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  // `params` may be a Promise in some Next.js setups — unwrap it before use
  const { slug } = (await params) as { slug: string }

  const supabase = await createClient()

  // Find category by slug
  const { data: categories, error: catErr } = await supabase
    .from('category')
    .select('*')
    .eq('slug', slug)
    .limit(1)

  if (catErr || !categories || categories.length === 0) return notFound()

  const category = categories[0]

  // Fetch products for this category and stores for name lookup
  const [{ data: products }, { data: stores }] = await Promise.all([
    supabase.from('product').select('*').eq('category_id', category.id),
    supabase.from('store').select('*'),
  ])

  const storesMap: Record<string, any> = Object.fromEntries(
    (stores ?? []).map((s: any) => [String(s.id), s])
  )

  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-14 items-center">
        <Navbar links={[{ href: '/browse', label: 'Tooted' }]} right={<AuthButton />} />

        <div className="w-full max-w-5xl p-6 flex flex-col items-center gap-12">
          <h1 className="text-3xl font-bold mb-4">{category.name}</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {(products ?? []).map((p: any) => (
              <ProductCard
                key={p.id}
                product={p}
                categoryName={category.name}
                storeName={storesMap[String(p.store_id)]?.name}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
