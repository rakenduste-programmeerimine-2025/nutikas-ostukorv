import { AuthButton } from '@/components/auth-button'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import Navbar from '@/components/ui/navbar'
import ProductModalWrapper from '@/components/product-modal-wrapper'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-14 items-center">
        <Navbar right={<AuthButton />} />

        <div className="w-full max-w-5xl p-6 flex flex-col items-center gap-12">
          <div className="w-full flex flex-col items-center gap-6">
            <div className="flex items-center gap-3">
              <Link href="/data" className="px-4 py-2 rounded-md bg-white border">
                Andmed
              </Link>
              <Link href="/stores" className="px-4 py-2 rounded-md bg-white border">
                Poenimekiri
              </Link>

              <button className="px-4 py-2 rounded-md bg-foreground text-background">Otsing</button>
              <Link href="/browse" className="px-4 py-2 rounded-md bg-white border">
                Tooted
              </Link>
            </div>

            <h2 className="text-2xl font-medium">Sisesta toote nimi</h2>

            <div className="w-full max-w-2xl">
              <div className="flex items-center gap-3 border rounded-full px-4 py-3">
                <input
                  className="flex-1 bg-transparent outline-none"
                  placeholder="Otsi toodet"
                  aria-label="Otsi toodet"
                />
                <button aria-label="clear" className="text-sm opacity-60">
                  ×
                </button>
              </div>
            </div>
          </div>

          <section className="w-full mt-16">
            <h3 className="text-center text-2xl mb-8">Kategooriad</h3>

            <div className="w-full overflow-x-auto">
              <div className="flex gap-6 px-1 pb-3">
                {[
                  'Piimatooted',
                  'Köögiviljad',
                  'Liha',
                  'Puuviljad',
                  'Joogid',
                  'Sügavkülmutatud',
                  'Pagaritooted',
                  'Maiustused',
                ].map((name, i) => (
                  <Card key={i} className="min-w-[200px] cursor-pointer hover:shadow-lg transition">
                    <div className="h-32 bg-muted-foreground/40 rounded-t-xl" />
                    <CardContent>
                      <CardTitle>{name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-2">Kategooria kirjeldus</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <section className="w-full">
            <h3 className="text-center text-2xl mb-8">Populaarsed tooted</h3>

            <ProductModalWrapper />
          </section>
        </div>
      </div>
    </main>
  )
}
