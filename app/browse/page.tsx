import Navbar from '@/components/ui/navbar'
import { AuthButton } from '@/components/auth-button'
import { BrowseProducts } from '@/components/browse-products'

export default function Page() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-14 items-center">
        <Navbar
          links={[
            { href: '/data', label: 'Andmed' },
            { href: '/stores', label: 'Poenimekiri' },
            { href: '/', label: 'Otsing' },
          ]}
          right={<AuthButton />}
        />

        <div className="w-full max-w-5xl p-6 flex flex-col items-center gap-12">
          <h1 className="mb-5">Tooted</h1>
          <BrowseProducts />
        </div>
      </div>
    </main>
  )
}
