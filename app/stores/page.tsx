import Link from 'next/link'
import Navbar from '@/components/ui/navbar'
import { AuthButton } from '@/components/auth-button'
import PillsNav from '@/components/ui/pills-nav'
import { createClient } from '@/lib/supabase/server'

const STORE_LOGOS: Record<string, string> = {
  coop: '/coop_logo.png',
  rimi: '/rimi_logo.avif',
  selver: '/selver_logo.png',
}

function getStoreLogo(name: string | null): string | undefined {
  if (!name) return undefined
  const key = name.toLowerCase()
  if (key.includes('coop')) return STORE_LOGOS.coop
  if (key.includes('rimi')) return STORE_LOGOS.rimi
  if (key.includes('selver')) return STORE_LOGOS.selver
  return undefined
}

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

        <div className="w-full max-w-xl px-6 flex flex-col gap-4">
          {(stores ?? []).map(store => {
            const name = store.name ?? ''
            const logo = getStoreLogo(name)
            const lowerName = name.toLowerCase()

            const isCoop = lowerName.includes('coop')
            const isRimi = lowerName.includes('rimi')
            const isSelver = lowerName.includes('selver')

            const logoWrapperClasses = [
              'flex h-16 w-32 items-center justify-center rounded-lg overflow-hidden',
              isCoop || isSelver ? 'bg-white' : 'bg-muted',
            ].join(' ')

            const logoImgClasses = [
              'h-full w-full',
              isRimi ? 'object-cover scale-150' : 'object-contain',
              isCoop ? 'scale-125' : 'p-2',
            ]
              .filter(Boolean)
              .join(' ')

            return (
              <Link key={store.id} href={`/stores/${store.id}`} className="block">
                <div className="flex items-center gap-5 rounded-2xl border bg-card px-6 py-5 cursor-pointer hover:bg-muted/70 transition-colors">
                  <div className={logoWrapperClasses}>
                    {logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={logo} alt={name || 'Pood'} className={logoImgClasses} />
                    ) : (
                      <span className="text-lg font-semibold">{name[0] ?? '?'}</span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-medium leading-none">{name}</span>
                    <span className="text-sm text-muted-foreground mt-1">Vaata poe tooteid ja hindu</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </main>
  )
}
