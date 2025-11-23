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
              <Link
                href="/data"
                className="px-4 py-2 rounded-md bg-card text-card-foreground border"
              >
                Andmed
              </Link>
              <Link
                href="/stores"
                className="px-4 py-2 rounded-md bg-card text-card-foreground border"
              >
                Poenimekiri
              </Link>

              <button className="px-4 py-2 rounded-md bg-primary text-primary-foreground">
                Otsing
              </button>

              <Link
                href="/browse"
                className="px-4 py-2 rounded-md bg-card text-card-foreground border"
              >
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
                      'https://images.delfi.ee/media-api-image-cropper/v1/b8fb1020-b7e4-11eb-b469-85a469adc0e4.jpg?noup&w=1200&h=711&ch=0.8065&cw=1&cx=0&cy=0.0224&r=16:9',
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
                      'https://cool-simple.com/cdn/shop/articles/88b703198fe3ad51308b02c2d9b2f7a6_6ffe6823-51df-4310-8ba5-89c25452ec02.jpg?v=1757623997&width=1200',
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
                    image:
                      'https://www.sweets4me.co.uk/cdn/shop/collections/traditionalloose.jpg?v=1634895788',
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
                      'https://images.delfi.ee/media-api-image-cropper/v1/450f3675-3896-4106-8b9d-4fc642c97cd7.jpg?noup&w=1200&h=711&ch=0.8438&cw=1&cx=0&cy=0.1029&r=16:9',
                  },
                  {
                    name: 'Kastmed',
                    slug: 'kastmed',
                    image:
                      'https://www.mashed.com/img/gallery/delicious-homemade-sauces-that-will-upgrade-any-meal/intro-1615237740.jpg',
                  },
                ].map((cat, i) => (
                  <Link key={i} href={`/category/${cat.slug}`}>
                    <Card className="min-w-[200px] cursor-pointer hover:shadow-lg transition">
                      <div className="h-32 bg-muted-foreground/40 rounded-t-xl overflow-hidden">
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <CardContent>
                        <CardTitle>{cat.name}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-2">Kategooria kirjeldus</p>
                      </CardContent>
                    </Card>
                  </Link>
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
