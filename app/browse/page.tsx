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
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-14 items-center">
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
