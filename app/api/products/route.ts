import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const page = Number(url.searchParams.get('page') ?? '1')
    const limit = Number(url.searchParams.get('limit') ?? '12')

    const from = (Math.max(page, 1) - 1) * Math.max(limit, 1)
    const to = from + Math.max(limit, 1) - 1

    const supabase = await createClient()

    const { data, error, count } = await supabase
      .from('product')
      .select('*', { count: 'exact' })
      .range(from, to)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ products: data ?? [], total: count ?? 0 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? String(err) }, { status: 500 })
  }
}
