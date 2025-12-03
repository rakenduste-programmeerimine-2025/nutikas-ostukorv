import Navbar from '@/components/ui/navbar'
import PillsNav from '@/components/ui/pills-nav'
import { createClient } from '@/lib/supabase/server'
import { AuthButton } from '@/components/auth-button'
import ProductCard from '@/components/product-card'
import Link from 'next/link'

export default async function SearchPage({ searchParams }: { searchParams: { query?: string } }) {
  const query = searchParams.query || ''

  const supabase = await createClient()
  const { data: results, error } = await supabase.from('product').select('*')

  const filteredResults = results
    ? results.filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
    : []

  if (error) {
    console.error('Error loading products:', error)
  }

  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-14 items-center">
        <Navbar right={<AuthButton />} />

        <PillsNav active="Otsing" />

        <div className="w-full max-w-5xl p-6 flex flex-col items-center gap-12">
          <section className="w-full">
            <div className="flex items-center gap-4 mb-8">
              <Link href="/" className="text-blue-500 hover:underline">
                ← Tagasi
              </Link>
              <h1 className="text-3xl font-bold">Otsingu tulemused</h1>
            </div>

            {query && (
              <p className="text-lg text-muted-foreground mb-6">
                Otsisõna: <span className="font-semibold text-foreground">"{query}"</span>
              </p>
            )}

            {filteredResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResults.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">
                  {query ? `Tooteid otsisõnaga "${query}" ei leitud` : 'Palun sisesta otsingusõna'}
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}
