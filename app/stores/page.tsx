import { Card, CardContent, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import Navbar from '@/components/ui/navbar'
import { AuthButton } from '@/components/auth-button'

export default function StoresPage() {
  const stores = ['Rimi', 'Selver', 'Coop']

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
          {/* Removed duplicate link row for consistency */}
        </div>
        <h1 className="text-center text-3xl mb-8">Kõik poed</h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {stores.map((s, i) => (
            <Card key={i}>
              <div className="h-40 bg-muted-foreground/40 rounded-t-xl" />
              <CardContent>
                <CardTitle>{s}</CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  Vali poest tooted ja võrdle hindu
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}
