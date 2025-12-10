import Navbar from '@/components/ui/navbar'
import PillsNav from '@/components/ui/pills-nav'
import ProductModalWrapper from '@/components/product-modal-wrapper'
import Link from 'next/link'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import { AuthButton } from '@/components/auth-button'
import HomeClientWrapper from '@/components/home-client-wrapper'

export default async function Home() {
  const supabase = await createClient()

  const [{ data: allProducts }, { data: stores }] = await Promise.all([
    supabase.from('product').select('*'),
    supabase.from('store').select('*'),
  ])

  let santaCrossStore: any[] = []

  if (allProducts && stores) {
    const lowerName = (s: string | null | undefined) => (s ?? '').toString().toLowerCase()

    const coopStore = stores.find((s: any) => lowerName(s.name).includes('coop'))
    const rimiStore = stores.find((s: any) => lowerName(s.name).includes('rimi'))
    const selverStore = stores.find((s: any) => lowerName(s.name).includes('selver'))

    if (coopStore && rimiStore && selverStore) {
      const wantedStoreIds = new Set<number>([
        Number(coopStore.id),
        Number(rimiStore.id),
        Number(selverStore.id),
      ])

      const santaSpices = (allProducts as any[]).filter(p => {
        const name = lowerName(p.name)
        const isSanta = name.includes('santa maria')
        const isSaltOrPepper =
          name.includes('pipar') ||
          name.includes('pepper') ||
          name.includes('sool') ||
          name.includes('salt')
        return isSanta && isSaltOrPepper
      })

      const groups = new Map<string, any[]>()

      for (const p of santaSpices) {
        let key: string
        if (p.global_product_id != null) {
          key = `g:${p.global_product_id}`
        } else {
          const normName = lowerName(p.name)
            .replace('santa maria', '')
            .replace(/[^a-z0-9]+/g, ' ')
            .trim()
          key = `n:${normName}`
        }

        const list = groups.get(key) ?? []
        list.push(p)
        groups.set(key, list)
      }

      const metric = (p: any) => {
        if (p.price_per_unit != null) return Number(p.price_per_unit)
        if (p.price != null) return Number(p.price)
        return Number.POSITIVE_INFINITY
      }

      const picks: any[] = []

      for (const list of groups.values()) {
        const storeSet = new Set<number>(list.map(p => Number(p.store_id)))
        let hasAll = true
        for (const id of wantedStoreIds) {
          if (!storeSet.has(id)) {
            hasAll = false
            break
          }
        }
        if (!hasAll) continue

        let best = list[0]
        for (const p of list) {
          if (metric(p) < metric(best)) {
            best = p
          }
        }
        picks.push(best)
      }

      santaCrossStore = picks.slice(0, 3)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center bg-gray-100 dark:bg-background">
      <div className="w-full">
        <Navbar
          right={<AuthButton />}
          globalSearch={<HomeClientWrapper allProducts={allProducts || []} />}
        />

        <header className="relative w-full py-12 border-b border-border overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://www.shutterstock.com/image-photo/blurred-image-shows-interior-supermarket-260nw-2654524783.jpg')",
            }}
          />
          <div className="absolute inset-0 bg-white/70 dark:bg-black/60" />

          <div className="relative max-w-screen-xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-5">Leia parimad tooted kiirelt</h1>
            <p className="text-muted-foreground max-w-4xl mx-auto">
              Otsi ja lisa tooted ostukorvi. Kasuta otsingut üleval või sirvi kategooriaid allpool.
            </p>
          </div>
        </header>

        <div className="w-full max-w-screen-xl p-6 mx-auto flex flex-col items-center gap-12">
          <PillsNav active="Otsing" />

          <section className="w-full">
            <h3 className="text-center text-2xl mb-6 font-semibold">Kategooriad</h3>

            <div className="w-full overflow-x-auto">
              <div className="flex gap-6 px-1 pb-3">
                {[
                  {
                    name: 'Piimatooted',
                    slug: 'piimatooted',
                    image:
                      'https://nutritionsource.hsph.harvard.edu/wp-content/uploads/2020/10/shutterstock_1232966839.jpg',
                  },
                  {
                    name: 'Köögiviljad',
                    slug: 'koogiviljad',
                    image:
                      'https://images.delfi.ee/media-api-image-cropper/v1/b8fb1020-b7e4-11eb-b469-85a469adc0e4.jpg?noup&w=1200&h=711',
                  },
                  {
                    name: 'Puuviljad',
                    slug: 'puuviljad',
                    image:
                      'https://res.cloudinary.com/hz3gmuqw6/image/upload/c_fill,h_450,q_auto,w_710/f_auto/wip--21-healthiest-fruits-to-eat-in-2024-php3RGRfc',
                  },
                  {
                    name: 'Liha',
                    slug: 'lihatooted',
                    image:
                      'https://www-assets.liebherr.com/media/bu-media/lhbu-hau/global/freshmag/meat/fleisch___biofleisch/is-meat-healthy-liebherr-freshmag-169-600.webp',
                  },
                  {
                    name: 'Joogid',
                    slug: 'joogid',
                    image:
                      'https://bakewithshivesh.com/wp-content/uploads/2022/04/IMG_9331-scaled.jpg',
                  },
                  {
                    name: 'Külmutatud',
                    slug: 'kulmutatud',
                    image:
                      'https://cool-simple.com/cdn/shop/articles/88b703198fe3ad51308b02c2d9b2f7a6_6ffe6823-51df-4310-8ba5-89c25452ec02.jpg',
                  },
                  {
                    name: 'Pagaritooted',
                    slug: 'pagaritooted',
                    image:
                      'https://fitnessest.com/wp-content/uploads/2017/08/pexels-photo-209291-e1508062444626.jpeg',
                  },
                  {
                    name: 'Maiustused',
                    slug: 'maiustused',
                    image: 'https://www.sweets4me.co.uk/cdn/shop/collections/traditionalloose.jpg',
                  },
                  {
                    name: 'Snäkid',
                    slug: 'snakid',
                    image:
                      'https://media13.s-nbcnews.com/i/mpx/2704722219/2024_09/1726148100989_tdy_food_9a_snacking_240912_1920x1080-0hv5dj.jpg',
                  },
                  {
                    name: 'Maitseained',
                    slug: 'maitseained',
                    image:
                      'https://tervisliktoitumine.ee/wp-content/uploads/2017/08/maitseained-1.jpg',
                  },
                  {
                    name: 'Kuivained',
                    slug: 'kuivained',
                    image:
                      'https://images.delfi.ee/media-api-image-cropper/v1/450f3675-3896-4106-8b9d-4fc642c97cd7.jpg',
                  },
                  {
                    name: 'Kastmed',
                    slug: 'kastmed',
                    image:
                      'https://www.mashed.com/img/gallery/delicious-homemade-sauces-that-will-upgrade-any-meal/intro-1615237740.jpg',
                  },
                ].map((cat, i) => (
                  <Link key={i} href={`/category/${cat.slug}`}>
                    <Card className="min-w-[200px] cursor-pointer hover:shadow-xl transition transform hover:-translate-y-1">
                      <div className="h-40 bg-muted-foreground/20 rounded-t-xl overflow-hidden">
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="py-4">
                        <CardTitle className="text-center">{cat.name}</CardTitle>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <section className="w-full mt-2">
            <h3 className="text-center text-2xl mb-6 font-semibold">Populaarsed tooted</h3>
            <ProductModalWrapper extraSantaProducts={santaCrossStore as any} />
          </section>
        </div>
      </div>
    </main>
  )
}
