import Navbar from '@/components/ui/navbar'
import { AuthButton } from '@/components/auth-button'
import { BrowseProducts } from '@/components/browse-products'
import PillsNav from '@/components/ui/pills-nav'
import HomeClientWrapper from '@/components/home-client-wrapper'
import { createClient } from '@/lib/supabase/server'

export default async function Page() {
  const supabase = await createClient()
  const { data: allProducts } = await supabase.from('product').select('*')

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

        <PillsNav active="Tooted" />

        <div className="w-full max-w-5xl p-6 flex flex-col items-center gap-12">
          <BrowseProducts />
        </div>
      </div>
    </main>
  )
}
