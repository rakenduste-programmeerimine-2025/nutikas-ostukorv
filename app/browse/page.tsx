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
    <main className="min-h-screen relative bg-gray-100 dark:bg-background">
      <div className="relative min-h-screen flex flex-col items-center">
        <Navbar
          right={<AuthButton />}
          globalSearch={<HomeClientWrapper allProducts={allProducts || []} />}
        />

        <div className="mt-5">
          <PillsNav active="Tooted" />
        </div>

        <div className="w-full max-w-5xl p-6 flex flex-col items-center gap-12">
          <BrowseProducts />
        </div>
      </div>
    </main>
  )
}
