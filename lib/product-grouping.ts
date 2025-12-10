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
    typeof p.category_id === 'number' || typeof p.category_id === 'string' ? p.category_id : null

  const slug = categoryId != null ? (slugByCategoryId[String(categoryId)] ?? null) : null
  const name = String(p.name ?? '').toLowerCase()

  const { tokens, extractCoreKey } = getTextMatchingHelpersForCategorySlug(slug)
  const core = extractCoreKey(name) ?? tokens(name).join(' ')

  const qtyVal = toNumber(p.quantity_value)
  const qtyUnit = (p.quantity_unit ?? '').toString().toLowerCase()

  // Category + normalised core name + quantity fully determine the logical product.
  const key = [
    slug ?? 'no-slug',
    String(categoryId ?? 'no-cat'),
    core,
    qtyVal ?? 'no-qty',
    qtyUnit || 'no-unit',
  ].join('|')

  return { key, categoryId }
}

export function groupProducts(products: AnyProduct[], categories: any[]): ProductGroup[] {
  const slugByCategoryId: Record<string, string | undefined> = Object.fromEntries(
    (categories || []).map((c: any) => [String(c.id), c.slug as string | undefined])
  )

  const groups = new Map<string, ProductGroup>()

  for (const p of products) {
    // Normalize numeric-ish fields so downstream code can rely on numbers
    const np: AnyProduct = { ...p }
    const idNum = toNumber(p.id)
    if (idNum != null) np.id = idNum
    const catNum = toNumber(p.category_id)
    if (catNum != null) np.category_id = catNum
    const storeNum = toNumber(p.store_id)
    if (storeNum != null) np.store_id = storeNum
    const qtyNum = toNumber(p.quantity_value)
    if (qtyNum != null) np.quantity_value = qtyNum
    const priceNum = toNumber(p.price)
    if (priceNum != null) np.price = priceNum
    const ppuNum = toNumber(p.price_per_unit)
    if (ppuNum != null) np.price_per_unit = ppuNum

    const { key, categoryId } = computeGroupingKey(np, slugByCategoryId)

    const existing = groups.get(key)
    if (!existing) {
      groups.set(key, {
        key,
        items: [np],
        representative: np,
        categoryId,
      })
      continue
    }

    existing.items.push(np)

    // Prefer the cheapest item in the group as the representative (by price_per_unit, then price).
    const metric = (x: AnyProduct): number => {
      const ppu = toNumber(x.price_per_unit)
      const price = toNumber(x.price)
      return ppu ?? price ?? Number.POSITIVE_INFINITY
    }

    if (metric(np) < metric(existing.representative)) {
      existing.representative = np
    }
  }

  return Array.from(groups.values())
}
