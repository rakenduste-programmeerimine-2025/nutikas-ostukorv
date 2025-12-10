import Navbar from '@/components/ui/navbar'
import { AuthButton } from '@/components/auth-button'
import PillsNav from '@/components/ui/pills-nav'
import { createClient } from '@/lib/supabase/server'
import { type Product } from '@/components/product-card'
import StoreProductsBrowser from '@/components/ui/store-product-browser'

interface ProductRow {
  id: number
  name: string
  price: number
  category_id: string | null
  store_id: number | null
  image_url: string | null
}

interface StorePageProps {
  params: Promise<{
    storeId: string
  }>
}

export default async function StorePage({ params }: StorePageProps) {
  const supabase = await createClient()
  const { storeId: storeIdParam } = await params
  const storeId = Number(storeIdParam)

  if (!Number.isFinite(storeId)) {
    return <div>Vigane poe ID.</div>
  }

  const { data: store, error: storeError } = await supabase
    .from('store')
    .select('*')
    .eq('id', storeId)
    .single()

  if (storeError || !store) {
    console.error('Error loading store:', storeError)
    return <div>Poodi ei leitud.</div>
  }

  const { data: products, error: productsError } = await supabase
    .from('product')
    .select('*')
    .eq('store_id', storeId)
    .order('name')

  if (productsError) {
    console.error('Error loading products for store:', productsError)
  }

  const storeProducts: Product[] = (products ?? []).map((p: ProductRow) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    category_id: p.category_id ?? undefined,
    store_id: p.store_id ?? undefined,
    image_url: p.image_url ?? undefined,
  }))

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
        <div className="flex-1 w-full flex flex-col gap-6 items-center">
          <Navbar right={<AuthButton />} />
          <PillsNav active="Poed" />

          <section className="w-full max-w-5xl p-6 flex flex-col gap-8">
            <header className="flex flex-col gap-2">
              <h1 className="text-3xl font-semibold">{store.name}</h1>
              <p className="text-muted-foreground text-sm">
                Vali tooted poest {store.name} ja lisa need ostukorvi.
              </p>
            </header>

            <section className="w-full">
              <h2 className="text-2xl mb-4">Kõik tooted selles poes</h2>

              {storeProducts.length === 0 ? (
                <p className="text-muted-foreground text-sm">Selles poes ei ole veel tooteid.</p>
              ) : (
                <StoreProductsBrowser products={storeProducts} storeName={store.name} />
              )}
            </section>
          </section>
        </div>
      </div>
    </main>
  )
}
