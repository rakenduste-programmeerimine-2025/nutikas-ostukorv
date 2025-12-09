import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Simple helper to safely coerce to number or null
function toNumber(value: string | null): number | null {
  if (value == null) return null
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const productIdParam = url.searchParams.get('productId')
    const productId = toNumber(productIdParam)

    if (!productId) {
      return NextResponse.json({ error: 'Missing or invalid productId' }, { status: 400 })
    }

    const supabase = await createClient()

    // 1) Load base product
    const { data: base, error: baseError } = await supabase
      .from('product')
      .select('*')
      .eq('id', productId)
      .single()

    if (baseError || !base) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const baseStoreId = (base as any).store_id as number | null
    const baseCategoryId = (base as any).category_id as number | null
    const baseGlobalId = (base as any).global_product_id as number | null
    const baseQuantityUnit = (base as any).quantity_unit as string | null
    const baseQuantityValue = (base as any).quantity_value as number | null

    // 2) Build candidate query
    let candidatesQuery = supabase
      .from('product')
      .select('*')
      .neq('id', productId)

    if (baseStoreId != null) {
      candidatesQuery = candidatesQuery.neq('store_id', baseStoreId)
    }

    // Prefer exact global_product_id matches if present
    if (baseGlobalId != null) {
      candidatesQuery = candidatesQuery.eq('global_product_id', baseGlobalId)
    } else {
      // Fallback heuristic: same category, and ideally same quantity unit
      if (baseCategoryId != null) {
        candidatesQuery = candidatesQuery.eq('category_id', baseCategoryId)
      }
      if (baseQuantityUnit) {
        candidatesQuery = candidatesQuery.eq('quantity_unit', baseQuantityUnit)
      }
    }

    const { data: candidates, error: candidatesError } = await candidatesQuery

    if (candidatesError) {
      return NextResponse.json({ error: candidatesError.message }, { status: 500 })
    }

    const candidateRowsRaw = (candidates ?? []) as any[]

    if (candidateRowsRaw.length === 0) {
      return NextResponse.json({ baseProduct: base, comparisons: [] })
    }

    // Basic helpers for textual and price similarity so we don't compare
    // completely unrelated items (e.g. saffron vs table salt).
    const baseName = String((base as any).name ?? '').toLowerCase()

    const STOP_WORDS = new Set([
      'santa',
      'maria',
      'rimi',
      'selver',
      'coop',
      'smart',
      'klassikaline',
      'maitseaine',
      'maitseained',
      'segu',
      'mix',
      'pulber',
      'jahvatatud',
      'hakitud',
      'premium',
      'classic',
    ])

    function tokens(name: string): string[] {
      return name
        .toLowerCase()
        .replace(/[^a-zäöõü0-9]+/g, ' ')
        .split(' ')
        .map(t => t.trim())
        .filter(t => t && !STOP_WORDS.has(t))
    }

    const baseTokens = new Set(tokens(baseName))

    const baseQtyVal = (base as any).quantity_value as number | null
    const baseQtyUnit = (base as any).quantity_unit as string | null
    const basePrice = (base as any).price as number | null
    const basePricePerUnitExplicit = (base as any).price_per_unit as number | null

    const basePricePerUnit = (() => {
      if (typeof basePricePerUnitExplicit === 'number') return basePricePerUnitExplicit
      if (basePrice != null && baseQtyVal != null && baseQtyVal > 0) {
        return basePrice / baseQtyVal
      }
      return null
    })()

    function isReasonableCandidate(other: any): boolean {
      // If global_product_id matches, always allow.
      if (baseGlobalId != null && other.global_product_id === baseGlobalId) {
        return true
      }

      const name = String(other.name ?? '').toLowerCase()
      const otherTokens = new Set(tokens(name))
      let overlap = 0
      baseTokens.forEach(t => {
        if (otherTokens.has(t)) overlap++
      })

      // Require at least one meaningful shared token when falling back to
      // heuristic matching.
      if (overlap === 0) return false

      // If we have price-per-unit info for both, reject candidates that are
      // orders of magnitude cheaper / more expensive.
      const otherQtyVal = other.quantity_value as number | null
      const otherPrice = other.price as number | null
      const otherPPUExplicit = other.price_per_unit as number | null

      const otherPPU = (() => {
        if (typeof otherPPUExplicit === 'number') return otherPPUExplicit
        if (otherPrice != null && otherQtyVal != null && otherQtyVal > 0) {
          return otherPrice / otherQtyVal
        }
        return null
      })()

      if (basePricePerUnit != null && otherPPU != null && basePricePerUnit > 0) {
        const ratio = otherPPU / basePricePerUnit
        // Keep only items roughly in the same order of magnitude.
        if (ratio < 0.2 || ratio > 5) return false
      }

      return true
    }

    const candidateRows = candidateRowsRaw.filter(isReasonableCandidate)

    if (candidateRows.length === 0) {
      return NextResponse.json({ baseProduct: base, comparisons: [] })
    }

    // 3) Fetch stores for these products so we can label them
    const storeIds = Array.from(
      new Set(
        candidateRows
          .map(row => row.store_id as number | null)
          .filter((id): id is number => typeof id === 'number' && Number.isFinite(id))
      )
    )

    const { data: stores, error: storesError } = await supabase
      .from('store')
      .select('*')
      .in('id', storeIds.length > 0 ? storeIds : [-1])

    if (storesError) {
      return NextResponse.json({ error: storesError.message }, { status: 500 })
    }

    const storeMap = Object.fromEntries((stores ?? []).map((s: any) => [String(s.id), s]))

    // 4) Compute a simple similarity score and sort
    function similarityScore(other: any): number {
      let score = 0

      if (baseGlobalId != null && other.global_product_id === baseGlobalId) {
        score += 50
      }

      if (baseCategoryId != null && other.category_id === baseCategoryId) {
        score += 10
      }

      if (baseQuantityUnit && other.quantity_unit === baseQuantityUnit) {
        score += 5
      }

      if (baseQuantityValue != null && other.quantity_value != null) {
        const a = baseQuantityValue
        const b = other.quantity_value as number
        if (a > 0 && b > 0) {
          const relDiff = Math.abs(a - b) / a
          if (relDiff < 0.05) score += 5
          else if (relDiff < 0.15) score += 3
        }
      }

      return score
    }

    const comparisons = candidateRows
      .map(row => {
        const pricePerUnit = (row.price_per_unit as number | null) ?? null
        const price = (row.price as number | null) ?? null

        return {
          product: row,
          store: storeMap[String(row.store_id)] ?? null,
          pricePerUnit,
          price,
          similarity: similarityScore(row),
        }
      })
      .sort((a, b) => {
        // Primary: lower price_per_unit, fallback to price, then higher similarity
        const aMetric = a.pricePerUnit ?? a.price ?? Number.POSITIVE_INFINITY
        const bMetric = b.pricePerUnit ?? b.price ?? Number.POSITIVE_INFINITY

        if (aMetric !== bMetric) return aMetric - bMetric
        return b.similarity - a.similarity
      })
      // Do not overwhelm the UI: only return the most relevant matches
      .slice(0, 15)

    return NextResponse.json({ baseProduct: base, comparisons })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 })
  }
}
