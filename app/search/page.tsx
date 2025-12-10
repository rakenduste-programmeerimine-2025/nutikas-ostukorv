import Navbar from '@/components/ui/navbar'
import PillsNav from '@/components/ui/pills-nav'
import { createClient } from '@/lib/supabase/server'
import { AuthButton } from '@/components/auth-button'
import SearchResultsClient from '@/components/ui/search-results-client'
import HomeClientWrapper from '@/components/home-client-wrapper'

export default async function SearchPage({ searchParams }: { searchParams: any }) {
  const resolvedParams = await searchParams
  const query = (resolvedParams?.query as string) || ''

  const supabase = await createClient()

  const { data: allProducts } = await supabase.from('product').select('*')

  let filteredResults: any[] = []
  let error: any = null

  if (query) {
    const { data, error: dbError } = await supabase
      .from('product')
      .select('*')
      .ilike('name', `%${query}%`)

    error = dbError
    filteredResults = data ?? []
  }

  if (error) {
    console.error('Error loading products:', error)
  }

  const { data: categories } = await supabase.from('category').select('*')
  const { data: stores } = await supabase.from('store').select('*')

  return (
    <main className="min-h-screen relative">
      <div
        className="fixed inset-0 bg-center bg-cover bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://png.pngtree.com/thumb_back/fh260/background/20240612/pngtree-convenience-store-shelves-interior-blur-background-with-empty-supermarket-shopping-cart-image_15748275.jpg')",
        }}
      />

      <div className="relative min-h-screen flex flex-col items-center bg-background/80 backdrop-blur-sm">
        <Navbar
          right={<AuthButton />}
          globalSearch={
            <HomeClientWrapper allProducts={allProducts || []} />
          }
        />

        <div className="w-full max-w-5xl mx-auto p-6">
          <header className="mt-6 mb-8">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold">Otsingu tulemused</h1>
              {query && (
                <span className="ml-2 px-3 py-1 rounded-full bg-muted/40 text-sm text-muted-foreground">
                  {filteredResults.length} tulemus
                  {filteredResults.length === 1 ? '' : 't'}
                </span>
              )}
            </div>
          </header>

          <section className="w-full">
            <SearchResultsClient
              initialProducts={filteredResults}
              categories={categories || []}
              stores={stores || []}
              initialQuery={query}
            />
          </section>
        </div>
      </div>
    </main>
  )
}
