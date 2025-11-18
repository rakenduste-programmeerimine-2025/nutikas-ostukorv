import { EnvVarWarning } from '@/components/env-var-warning'
import { AuthButton } from '@/components/auth-button'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { hasEnvVars } from '@/lib/utils'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-14 items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-20">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <span className="text-xl">Nutikas ostukorv</span>
            </div>
            {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
          </div>
        </nav>

        <div className="w-full max-w-5xl p-6 flex flex-col items-center gap-12">
          <div className="w-full flex flex-col items-center gap-6">
            <div className="flex items-center gap-3">
              <Link href="/stores" className="px-4 py-2 rounded-md bg-white border">
                Poenimekiri
              </Link>
              <Link href="/data" className="px-4 py-2 rounded-md bg-white border">
                Andmed
              </Link>
              <button className="px-4 py-2 rounded-md bg-foreground text-background">Otsing</button>
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

          <section className="w-full">
            <h3 className="text-center text-2xl mb-8">Populaarsemad tooted</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="">
                  <div className="h-40 bg-muted-foreground/40 rounded-t-xl" />
                  <CardContent>
                    <CardTitle>Toode</CardTitle>
                    <p className="text-sm text-muted-foreground mt-2">Lühikirjeldus</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
