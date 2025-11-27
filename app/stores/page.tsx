import Link from 'next/link'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import Navbar from '@/components/ui/navbar'
import { AuthButton } from '@/components/auth-button'
import PillsNav from '@/components/ui/pills-nav'
import { createClient } from '@/lib/supabase/server'

export default async function StoresPage() {
  const supabase = await createClient()

  const { data: stores, error } = await supabase.from('store').select('*').order('name')

  if (error) {
    console.error('Error loading stores:', error)
  }

  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-14 items-center">
        <Navbar right={<AuthButton />} />
        <PillsNav active="Poenimekiri" />

        <h1 className="text-center text-3xl mb-8">Kõik poed</h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl px-6">
          {(stores ?? []).map(store => (
            <Link key={store.id} href={`/stores/${store.id}`}>
              <Card className="cursor-pointer hover:shadow-lg transition">
                <div className="h-40 bg-muted-foreground/40 rounded-t-xl" />
                <CardContent>
                  <CardTitle>{store.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">
                    Vali poest tooted ja võrdle hindu
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
