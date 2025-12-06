import { notFound } from 'next/navigation'
import Navbar from '@/components/ui/navbar'
import { AuthButton } from '@/components/auth-button'
import { createClient } from '@/lib/supabase/server'
import CategoryProductBrowser from '@/components/category-product-browser'
import CategoryClientWrapper from '@/components/category-client-wrapper'

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const supabase = await createClient()

  const { data: categories } = await supabase
    .from('category')
    .select('*')
    .eq('slug', slug)
    .limit(1)

  if (!categories?.length) return notFound()

  const category = categories[0]

  const [{ data: products }, { data: stores }] = await Promise.all([
    supabase.from('product').select('*').eq('category_id', category.id),
    supabase.from('store').select('*'),
  ])

  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-14 items-center">

        <Navbar
          right={<AuthButton />}
          globalSearch={<CategoryClientWrapper allProducts={products ?? []} />}
        />

        <div className="w-full max-w-5xl p-6 flex flex-col items-center gap-12">
          <h1 className="text-3xl font-bold mb-4">{category.name}</h1>

          <CategoryProductBrowser
            products={products ?? []}
            stores={stores ?? []}
          />
        </div>
      </div>
    </main>
  )
}
