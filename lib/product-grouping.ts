import { getTextMatchingHelpersForCategorySlug } from '@/lib/product-matching'

// Generic product shape for grouping. UI layers can extend this.
export interface AnyProduct {
  id: number | string
  name?: string | null
  price?: number | null
  category_id?: number | string | null
  store_id?: number | string | null
  quantity_value?: number | null
  quantity_unit?: string | null
  price_per_unit?: number | null
  // Allow extra fields without type errors
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export interface ProductGroup {
  key: string
  items: AnyProduct[]
  representative: AnyProduct
  categoryId: number | string | null
}

function toNumber(value: unknown): number | null {
  const n = Number(value as any)
  return Number.isFinite(n) ? n : null
}

function computeGroupingKey(
  p: AnyProduct,
  slugByCategoryId: Record<string, string | undefined>
): { key: string; categoryId: number | string | null } {
  const categoryId =
    typeof p.category_id === 'number' || typeof p.category_id === 'string'
      ? p.category_id
      : null

  const slug = categoryId != null ? slugByCategoryId[String(categoryId)] ?? null : null
  const name = String(p.name ?? '').toLowerCase()

  const { tokens, extractCoreKey } = getTextMatchingHelpersForCategorySlug(slug)
  const core = extractCoreKey(name) ?? tokens(name).join(' ')

  const qtyVal = toNumber(p.quantity_value)
  const qtyUnit = (p.quantity_unit ?? '').toString().toLowerCase()

  // Category + normalised core name + quantity fully determine the logical product.
  const key = [slug ?? 'no-slug', String(categoryId ?? 'no-cat'), core, qtyVal ?? 'no-qty', qtyUnit || 'no-unit']
    .join('|')

  return { key, categoryId }
}

export function groupProducts(
  products: AnyProduct[],
  categories: any[]
): ProductGroup[] {
  const slugByCategoryId: Record<string, string | undefined> = Object.fromEntries(
    (categories || []).map((c: any) => [String(c.id), c.slug as string | undefined])
  )

  const groups = new Map<string, ProductGroup>()

  for (const p of products) {
    const { key, categoryId } = computeGroupingKey(p, slugByCategoryId)

    const existing = groups.get(key)
    if (!existing) {
      groups.set(key, {
        key,
        items: [p],
        representative: p,
        categoryId,
      })
      continue
    }

    existing.items.push(p)

    // Prefer the cheapest item in the group as the representative (by price_per_unit, then price).
    const metric = (x: AnyProduct): number => {
      const ppu = toNumber(x.price_per_unit)
      const price = toNumber(x.price)
      return ppu ?? price ?? Number.POSITIVE_INFINITY
    }

    if (metric(p) < metric(existing.representative)) {
      existing.representative = p
    }
  }

  return Array.from(groups.values())
}
