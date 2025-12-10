import Navbar from '@/components/ui/navbar'
import { AuthButton } from '@/components/auth-button'
import HomeClientWrapper from '@/components/home-client-wrapper'
import { createClient } from '@/lib/supabase/server'
import CartPageClient from '@/components/cart/cart-page-client'

export default async function CartPage() {
  const supabase = await createClient()
  const { data: allProducts } = await supabase.from('product').select('*')
  const { data: stores } = await supabase.from('store').select('*').order('name')

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
          globalSearch={<HomeClientWrapper allProducts={allProducts || []} />}
        />

        <div className="w-full max-w-[1440px] p-6 flex flex-col gap-8">
          <header className="flex flex-col gap-1 text-center">
            <h1 className="text-3xl font-semibold">Ostukorvi hinnavõrdlus</h1>
            <p className="text-sm text-muted-foreground">
              Võrdle oma ostukorvi maksumust eri poodides ja leia odavaim variant.
            </p>
          </header>

          <CartPageClient stores={stores || []} />
        </div>
      </div>
    </main>
  )
}
