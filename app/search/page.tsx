import Navbar from '@/components/ui/navbar'
import PillsNav from '@/components/ui/pills-nav'
import { createClient } from '@/lib/supabase/server'
import { AuthButton } from '@/components/auth-button'
// ProductCard is rendered inside the client wrapper
import Link from 'next/link'
import SearchResultsClient from '@/components/ui/search-results-client'

export default async function SearchPage({ searchParams }: { searchParams: any }) {
  // `searchParams` can be a Promise in some Next.js setups — await it to be safe
  const resolvedParams = await searchParams
  const query = (resolvedParams?.query as string) || ''

  const supabase = await createClient()

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

  // fetch categories and stores for filter controls
  const { data: categories } = await supabase.from('category').select('*')
  const { data: stores } = await supabase.from('store').select('*')

  return (
    <main className="min-h-screen flex flex-col items-center bg-background">
      <div className="w-full">
        <Navbar right={<AuthButton />} />

        <div className="w-full max-w-5xl mx-auto p-6">
          <header className="mt-6 mb-8">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold">Otsingu tulemused</h1>
              {query && (
                <span className="ml-2 px-3 py-1 rounded-full bg-muted/40 text-sm text-muted-foreground">
                  {filteredResults.length} tulemus{filteredResults.length === 1 ? '' : 'ed'}
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
