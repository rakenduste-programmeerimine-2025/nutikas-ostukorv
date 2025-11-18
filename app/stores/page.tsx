import { EnvVarWarning } from '@/components/env-var-warning'
import { AuthButton } from '@/components/auth-button'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { hasEnvVars } from '@/lib/utils'

export default function StoresPage() {
  const stores = ['Rimi', 'Selver', 'Coop']

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

        <div className="w-full max-w-5xl p-6">
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
      </div>
    </main>
  )
}
