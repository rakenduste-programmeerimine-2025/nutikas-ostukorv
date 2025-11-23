import { notFound } from 'next/navigation'

type CategoryConfig = {
  title: string
  description: string
  filters: string[]
}

const categories: Record<string, CategoryConfig> = {
  piimatooted: {
    title: 'Piimatooted',
    description: 'Kõik piimatooted ja sellega seotud kaubad.',
    filters: ['Piimad', 'Juustud', 'Jogurtid'],
  },
  koogiviljad: {
    title: 'Köögiviljad',
    description: 'Värsked köögiviljad ja juurviljad.',
    filters: ['Lehtköögiviljad', 'Juurviljad'],
  },
  puuviljad: {
    title: 'Puuviljad',
    description: 'Värsked puuviljad ja eksootilised viljad.',
    filters: ['Õunad', 'Banaanid', 'Marjad'],
  },
  liha: {
    title: 'Liha',
    description: 'Lihatooted ja värske liha.',
    filters: ['Veiseliha', 'Sealiha', 'Linnuliha'],
  },
  joogid: {
    title: 'Joogid',
    description: 'Karastusjoogid, mahlad ja vesi.',
    filters: ['Mahlad', 'Karastusjoogid'],
  },
  kulmutatud: {
    title: 'Külmutatud tooted',
    description: 'Külmutatud köögiviljad, valmisroad ja magustoidud.',
    filters: ['Külmutatud juurviljad', 'Valmisroad'],
  },
  pagaritooted: {
    title: 'Pagaritooted',
    description: 'Leivad, saiad, küpsetised.',
    filters: ['Leivad', 'Saiad', 'Saiakesed'],
  },
  maiustused: {
    title: 'Maiustused',
    description: 'Maiustused',
    filters: ['Kommid', 'Šokolaadid'],
  },
  snakid: {
    title: 'Snäkid',
    description: 'Erinevad snäkid',
    filters: ['Krõpsud', 'Pähklid'],
  },
  maitseained: {
    title: 'Maitseained',
    description: 'Maitseained ja maitseainesegud.',
    filters: ['Kuivad maitseained', 'Marinaadid', 'Segud'],
  },
  kuivained: {
    title: 'Kuivained',
    description: 'Kaunviljad, jahu, riis, pasta.',
    filters: ['Jahu', 'Pasta', 'Riis'],
  },
  kastmed: {
    title: 'Kastmed',
    description: 'Kastmed.',
    filters: [],
  },
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const category = categories[slug]

  if (!category) return notFound()

  return (
    <main className="min-h-screen p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{category.title}</h1>
      <p className="text-lg text-muted-foreground mb-6">{category.description}</p>

      <div className="flex gap-3 flex-wrap">
        {category.filters.map(filter => (
          <button
            key={filter}
            className="px-4 py-2 bg-card border text-card-foreground rounded-md hover:bg-accent transition"
          >
            {filter}
          </button>
        ))}
      </div>
    </main>
  )
}
