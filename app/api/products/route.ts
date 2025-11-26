import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const page = Number(url.searchParams.get('page') ?? '1')
    const limit = Number(url.searchParams.get('limit') ?? '12')
    const category = url.searchParams.get('category')
    const store = url.searchParams.get('store')
    const minPrice = url.searchParams.get('minPrice')
    const maxPrice = url.searchParams.get('maxPrice')
    const sort = url.searchParams.get('sort')

    const from = (Math.max(page, 1) - 1) * Math.max(limit, 1)
    const to = from + Math.max(limit, 1) - 1

    const supabase = await createClient()

    // Build product query (allow filtering by category, store, price range)
    let productQuery = supabase.from('product').select('*', { count: 'exact' })

    if (category) {
      const catNum = Number(category)
      if (!Number.isNaN(catNum)) productQuery = productQuery.eq('category_id', catNum)
      else productQuery = productQuery.eq('category_id', category)
    }

    if (store) {
      const storeNum = Number(store)
      if (!Number.isNaN(storeNum)) productQuery = productQuery.eq('store_id', storeNum)
      else productQuery = productQuery.eq('store_id', store)
    }

    if (minPrice) {
      const min = Number(minPrice)
      if (!Number.isNaN(min)) productQuery = productQuery.gte('price', min)
    }

    if (maxPrice) {
      const max = Number(maxPrice)
      if (!Number.isNaN(max)) productQuery = productQuery.lte('price', max)
    }

    // Apply sorting if provided
    if (sort === 'price_asc') {
      productQuery = productQuery.order('price', { ascending: true })
    } else if (sort === 'price_desc') {
      productQuery = productQuery.order('price', { ascending: false })
    }

    productQuery = productQuery.range(from, to)

    const [
      { data, error, count },
      { data: categories, error: catErr },
      { data: stores, error: storeErr },
    ] = await Promise.all([
      productQuery,
      supabase.from('category').select('*'),
      supabase.from('store').select('*'),
    ])

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (catErr || storeErr) {
      // non-fatal for product listing, but surface in response
      return NextResponse.json(
        {
          products: data ?? [],
          total: count ?? 0,
          categories: categories ?? [],
          stores: stores ?? [],
          warnings: [catErr?.message, storeErr?.message].filter(Boolean),
        },
        { status: 200 }
      )
    }

    return NextResponse.json({
      products: data ?? [],
      total: count ?? 0,
      categories: categories ?? [],
      stores: stores ?? [],
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? String(err) }, { status: 500 })
  }
}
