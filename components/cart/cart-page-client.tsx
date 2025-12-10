'use client'

import * as React from 'react'
import { useCart, type CartItem } from '@/components/cart/cart-context'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'

type StoreRow = {
  id: number
  name: string | null
}

interface PriceComparisonEntry {
  product: any
  store: StoreRow | null
  price: number | null
  pricePerUnit: number | null
  isSameItem: boolean
}

interface PriceComparisonResult {
  baseProduct: any
  comparisons: PriceComparisonEntry[]
}

interface CartPageClientProps {
  stores: StoreRow[]
}

type OverrideKey = string // `${productId}:${storeId}`

type OverrideMap = Record<OverrideKey, PriceComparisonEntry>

function makeOverrideKey(productId: number, storeId: number): OverrideKey {
  return `${productId}:${storeId}`
}

function toNumber(value: unknown): number | null {
  const n = Number(value as any)
  return Number.isFinite(n) ? n : null
}

interface StoreLineInfo {
  unitPrice: number | null
  lineTotal: number | null
  similar: PriceComparisonEntry[]
  // true when this price comes from the same logical item (base store or exact
  // match in another store), false for overrides / purely similar suggestions.
  exact: boolean
  missing: boolean
  // The product entry that this line is based on (base store, exact match or override)
  chosen: PriceComparisonEntry | null
}

function computeLineForStore(
  item: CartItem,
  storeId: number,
  comparison: PriceComparisonResult | null | undefined,
  override: PriceComparisonEntry | null | undefined
): StoreLineInfo {
  const qty = item.quantity
  const baseStoreId = (item.product as any).store_id as number | null
  const basePriceRaw = toNumber((item.product as any).price)

  const allComparisons = (comparison?.comparisons ?? []) as PriceComparisonEntry[]
  const similarForStore = allComparisons.filter(
    c => !c.isSameItem && (c.store?.id ?? (c.store as any)?.id) === storeId
  )
  const sameItemsForStore = allComparisons.filter(
    c => c.isSameItem && (c.store?.id ?? (c.store as any)?.id) === storeId
  )

  // If user has picked an override for this store, always use it.
  if (override) {
    const unit = toNumber(override.price ?? override.product?.price)
    const lineTotal = unit != null ? unit * qty : null
    return {
      unitPrice: unit,
      lineTotal,
      similar: similarForStore,
      exact: false,
      missing: unit == null,
      chosen: override,
    }
  }

  // Original store where product was added to cart.
  if (storeId === baseStoreId && basePriceRaw != null) {
    const lineTotal = basePriceRaw * qty

    const baseEntry: PriceComparisonEntry = {
      product: item.product,
      store: baseStoreId != null ? { id: baseStoreId, name: null } : null,
      price: basePriceRaw,
      pricePerUnit: null,
      isSameItem: true,
    }

    return {
      unitPrice: basePriceRaw,
      lineTotal,
      similar: similarForStore,
      exact: true,
      missing: false,
      chosen: baseEntry,
    }
  }

  // Same logical item from price-comparison API in another store.
  if (sameItemsForStore.length > 0) {
    const best = sameItemsForStore.reduce((acc, cur) => {
      const accMetric = toNumber(acc.price ?? acc.product?.price) ?? Number.POSITIVE_INFINITY
      const curMetric = toNumber(cur.price ?? cur.product?.price) ?? Number.POSITIVE_INFINITY
      return curMetric < accMetric ? cur : acc
    })

    const unit = toNumber(best.price ?? best.product?.price)
    const lineTotal = unit != null ? unit * qty : null

    return {
      unitPrice: unit,
      lineTotal,
      similar: similarForStore,
      exact: true,
      missing: unit == null,
      chosen: best,
    }
  }

  // No exact match in this store; treat as missing but still surface similar alternatives.
  return {
    unitPrice: null,
    lineTotal: null,
    similar: similarForStore,
    exact: false,
    missing: true,
    chosen: null,
  }
}

export default function CartPageClient({ stores }: CartPageClientProps) {
  const { items, updateQty, removeItem } = useCart()

  const [selectedStoreId, setSelectedStoreId] = React.useState<number | null>(null)
  const [comparisons, setComparisons] = React.useState<
    Record<number, PriceComparisonResult | null>
  >({})
  const [overrides, setOverrides] = React.useState<OverrideMap>({})
  const [loadingComparisons, setLoadingComparisons] = React.useState(false)
  const [comparisonError, setComparisonError] = React.useState<string | null>(null)

  // Default selected store = first in list.
  React.useEffect(() => {
    if (selectedStoreId == null && stores.length > 0) {
      setSelectedStoreId(stores[0].id)
    }
  }, [stores, selectedStoreId])

  // Load price comparisons for all cart items when cart changes.
  React.useEffect(() => {
    if (!items.length) {
      setComparisons({})
      setLoadingComparisons(false)
      setComparisonError(null)
      return
    }

    let cancelled = false
    setLoadingComparisons(true)
    setComparisonError(null)

    async function load() {
      try {
        const entries = await Promise.all(
          items.map(async it => {
            try {
              const res = await fetch(`/api/price-comparison?productId=${it.product.id}`)
              if (!res.ok) throw new Error('Viga hinnav\u00f5rdluse laadimisel')
              const data = (await res.json()) as PriceComparisonResult
              return [it.product.id, data] as const
            } catch (err) {
              console.error(err)
              return [it.product.id, null] as const
            }
          })
        )

        if (!cancelled) {
          setComparisons(Object.fromEntries(entries))
        }
      } catch (err) {
        console.error(err)
        if (!cancelled) {
          setComparisonError('Hinnav\u00f5rdlust ei \u00f5nnestunud laadida.')
        }
      } finally {
        if (!cancelled) {
          setLoadingComparisons(false)
        }
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [items])

  const storeTotals = React.useMemo(() => {
    const totals: Record<number, { total: number; missing: number }> = {}

    for (const store of stores) {
      let total = 0
      let missing = 0

      for (const it of items) {
        const cmp = comparisons[it.product.id]
        const override = overrides[makeOverrideKey(it.product.id, store.id)]
        const line = computeLineForStore(it, store.id, cmp ?? null, override)

        if (line.lineTotal != null) {
          total += line.lineTotal
        } else if (line.missing) {
          missing += 1
        }
      }

      totals[store.id] = { total, missing }
    }

    return totals
  }, [items, comparisons, overrides, stores])

  const recommendedStoreId = React.useMemo(() => {
    let bestId: number | null = null
    let bestTotal = Number.POSITIVE_INFINITY

    for (const store of stores) {
      const stats = storeTotals[store.id]
      if (!stats || stats.total <= 0) continue

      if (stats.total < bestTotal) {
        bestTotal = stats.total
        bestId = store.id
      }
    }

    return Number.isFinite(bestTotal) ? bestId : null
  }, [stores, storeTotals])

  const handleChooseOverride = React.useCallback(
    (productId: number, storeId: number, entry: PriceComparisonEntry) => {
      setOverrides(prev => ({
        ...prev,
        [makeOverrideKey(productId, storeId)]: entry,
      }))
    },
    []
  )

  if (!items.length) {
    return (
      <div className="w-full max-w-3xl mx-auto border rounded-xl bg-card/60 p-6 text-center text-sm text-muted-foreground">
        Sinu ostukorv on praegu t\u00fchi. Lisa tooteid, et n\u00e4ha hinnav\u00f5rdlust eri poodides.
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Store summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stores.map(store => {
          const stats = storeTotals[store.id]
          const isActive = selectedStoreId === store.id
          const isRecommended = recommendedStoreId === store.id

          return (
            <button
              key={store.id}
              type="button"
              onClick={() => setSelectedStoreId(store.id)}
              className={`group relative flex flex-col items-start justify-between gap-2 rounded-xl border bg-card/80 p-4 text-left text-sm shadow-sm transition hover:border-primary hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 ${
                isActive ? 'border-primary bg-primary/5' : ''
              }`}
            >
              <div className="flex w-full items-center justify-between gap-2">
                <span className="font-semibold tracking-tight">
                  {store.name ?? 'Pood'}
                </span>
                {isRecommended && stats?.total > 0 && (
                  <Badge
                    variant="secondary"
                    className="border-none bg-emerald-500/90 px-2 py-0 text-[11px] text-emerald-50 shadow-sm"
                  >
                    Soovitatud
                  </Badge>
                )}
              </div>

              <div className="mt-1 flex w-full items-baseline justify-between gap-3">
                <span className="text-xl font-bold tracking-tight">
                  {stats?.total ? `${stats.total.toFixed(2)} €` : '—'}
                </span>
                {stats?.missing > 0 && (
                  <span className="text-xs text-amber-700 dark:text-amber-400">
                    Puudub {stats.missing} toode
                    {stats.missing > 1 ? 't' : ''} sellest poest
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {loadingComparisons && (
        <p className="text-xs text-muted-foreground">
          Laen hinnavõrdlust ostukorvi toodetele...
        </p>
      )}

      {comparisonError && (
        <p className="text-xs text-destructive">{comparisonError}</p>
      )}

      {/* Cart table */}
      <div className="w-full overflow-x-auto rounded-xl border bg-card/80 shadow-sm">
        <table className="min-w-full text-sm align-top">
          <thead className="sticky top-0 z-10 border-b bg-muted/80 backdrop-blur">
            <tr className="[&>th]:px-3 [&>th]:py-2 text-left align-bottom">
              <th className="w-[40%]">Toode</th>
              <th className="w-[10%]">Kogus</th>
              {stores.map(store => (
                <th key={store.id} className="text-right whitespace-nowrap">
                  {store.name ?? 'Pood'}
                </th>
              ))}
              <th className="w-[40px]" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {items.map(item => (
              <CartRow
                key={item.product.id}
                item={item}
                stores={stores}
                comparison={comparisons[item.product.id] ?? null}
                overrides={overrides}
                selectedStoreId={selectedStoreId}
                onQtyChange={qty => updateQty(item.product.id, qty)}
                onRemove={() => removeItem(item.product.id)}
                onChooseOverride={(storeId, entry) =>
                  handleChooseOverride(item.product.id, storeId, entry)
                }
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

interface CartRowProps {
  item: CartItem
  stores: StoreRow[]
  comparison: PriceComparisonResult | null
  overrides: OverrideMap
  selectedStoreId: number | null
  onQtyChange: (qty: number) => void
  onRemove: () => void
  onChooseOverride: (storeId: number, entry: PriceComparisonEntry) => void
}

function CartRow({
  item,
  stores,
  comparison,
  overrides,
  selectedStoreId,
  onQtyChange,
  onRemove,
  onChooseOverride,
}: CartRowProps) {
  const [qtyInput, setQtyInput] = React.useState<string>(String(item.quantity))

  React.useEffect(() => {
    setQtyInput(String(item.quantity))
  }, [item.quantity])

  // Precompute line info for all stores and find the cheapest one.
  const perStore = React.useMemo(() => {
    return stores.map(store => {
      const override = overrides[makeOverrideKey(item.product.id, store.id)]
      const info = computeLineForStore(item, store.id, comparison, override)
      return { store, override, info }
    })
  }, [stores, item, comparison, overrides])

  const cheapestStoreId = React.useMemo(() => {
    let bestId: number | null = null
    let bestPrice = Number.POSITIVE_INFINITY

    for (const { store, info } of perStore) {
      if (info.lineTotal != null && info.lineTotal < bestPrice) {
        bestPrice = info.lineTotal
        bestId = store.id
      }
    }

    return Number.isFinite(bestPrice) ? bestId : null
  }, [perStore])

  const baseStoreId = (item.product as any).store_id as number | null
  const baseStoreName =
    baseStoreId != null
      ? stores.find(s => s.id === baseStoreId)?.name ?? `Pood #${baseStoreId}`
      : null

  return (
    <tr className="align-top">
      <td className="pl-8 pr-3 py-3">
        <div className="flex gap-3 items-start">
          <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded border bg-white">
            <img
              src={item.product.image_url || '/placeholder.png'}
              alt={item.product.name}
              className="h-full w-full object-contain"
            />
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-sm font-medium leading-snug">
              {item.product.name}
            </div>
            <div className="text-xs text-muted-foreground">
              {baseStoreName
                ? `Lisatud poest ${baseStoreName}`
                : 'Lisatud poe info puudub'}
            </div>
          </div>
        </div>
      </td>

      <td className="px-3 py-3 align-top">
        <div className="flex flex-col items-start gap-1">
          <input
            type="number"
            min={1}
            value={qtyInput}
            onChange={e => {
              const v = e.target.value
              setQtyInput(v)
              const n = Number(v)
              if (Number.isFinite(n) && n >= 1) {
                onQtyChange(n)
              }
            }}
            className="h-8 w-20 rounded-md border bg-background px-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          />
          <button
            type="button"
            onClick={() => onRemove()}
            className="text-xs text-muted-foreground hover:text-destructive"
          >
            Eemalda
          </button>
        </div>
      </td>

      {perStore.map(({ store, info, override }) => {
        const isCheapest = cheapestStoreId != null && store.id === cheapestStoreId
        const isActive = selectedStoreId != null && store.id === selectedStoreId
        const selectedOverrideId = override?.product?.id as number | undefined
        const isExact = info.exact && !info.missing

        let boxClasses =
          'group relative my-3 flex min-h-[112px] min-w-[210px] flex-col justify-between gap-1 rounded-lg border bg-background/80 px-4 py-3 text-xs shadow-sm'

        if (info.missing && !selectedOverrideId) {
          boxClasses += ' border-dashed border-amber-500/70 bg-amber-500/5'
        } else if (selectedOverrideId) {
          boxClasses += ' border-primary/80 bg-primary/5'
        } else if (info.unitPrice != null || info.lineTotal != null) {
          // Neutral style for stores where the product exists; only the best price gets a strong green highlight.
          boxClasses += ' border-border bg-card/80'
        } else {
          boxClasses += ' border-border/80 bg-muted/40'
        }

        if (isActive) boxClasses += ' ring-1 ring-primary/40'
        if (isCheapest && info.lineTotal != null)
          boxClasses += ' shadow-[0_0_0_1px_rgba(16,185,129,0.9)]'

        const chosen = info.chosen
        const chosenProduct = chosen?.product ?? item.product

        const statusLabel = (() => {
          if (selectedOverrideId) return 'Asendustoode'
          if (info.missing && info.similar.length === 0) return 'Toode puudub'
          if (info.missing && info.similar.length > 0)
            return 'Toode puudub, saadaval asendused'
          // For exact matches we don't show an extra text label to keep the UI cleaner.
          return null
        })()

        return (
          <td key={store.id} className="px-3 py-4 align-top">
            <div className={boxClasses}>
              <div className="flex items-stretch gap-3">
                {/* Left: product image */}
                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded border bg-white">
                  <img
                    src={chosenProduct?.image_url || '/placeholder.png'}
                    alt={chosenProduct?.name}
                    className="h-full w-full object-contain"
                  />
                </div>

                {/* Right: name on top, quantity + price on bottom */}
                <div className="flex min-w-0 flex-1 flex-col justify-between gap-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-xs font-medium leading-snug">
                        {chosenProduct?.name}
                      </div>
                      {statusLabel && (
                        <div className="mt-0.5 text-[11px] text-muted-foreground">
                          {statusLabel}
                        </div>
                      )}
                    </div>

                    {isCheapest && info.lineTotal != null && (
                      <Badge
                        variant="secondary"
                        className="ml-2 border-none bg-emerald-500/90 px-2 py-0 text-[10px] text-emerald-50 shadow-sm"
                      >
                        Parim hind
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-end justify-between gap-2 text-xs">
                    {info.unitPrice != null ? (
                      <span className="text-[11px] text-muted-foreground">
                        {info.unitPrice.toFixed(2)} € / tk
                      </span>
                    ) : (
                      <span className="text-[11px] text-muted-foreground">Puudub hind</span>
                    )}

                    {info.lineTotal != null && (
                      <span className="text-sm font-semibold">
                        {info.lineTotal.toFixed(2)} €
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {info.similar.length > 0 && !(isExact && !selectedOverrideId) && (
                <div className="mt-2 flex justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 rounded-md border border-border bg-background/80 px-2 py-1 text-[11px] font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                      >
                        <span className="max-w-[140px] truncate text-left">
                          {selectedOverrideId
                            ? 'Asendustoode valitud'
                            : 'Vali asendustoode'}
                        </span>
                        <span className="text-[9px] opacity-70">▼</span>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[260px]">
                      {info.similar.map(c => {
                        const price = toNumber(c.price ?? c.product?.price)
                        const name = String(c.product?.name ?? 'Toode')
                        const img = (c.product as any)?.image_url as string | undefined

                        return (
                          <DropdownMenuItem
                            key={c.product?.id}
                            className="flex items-center gap-2 text-xs"
                            onClick={() => onChooseOverride(store.id, c)}
                          >
                            <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded border bg-white">
                              {img ? (
                                <img
                                  src={img}
                                  alt={name}
                                  className="h-full w-full object-contain"
                                />
                              ) : (
                                <div className="h-full w-full bg-muted" />
                              )}
                            </div>
                            <div className="flex min-w-0 flex-1 flex-col">
                              <span className="truncate">{name}</span>
                              {price != null && (
                                <span className="text-[11px] text-muted-foreground">
                                  {price.toFixed(2)} €
                                </span>
                              )}
                            </div>
                          </DropdownMenuItem>
                        )
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          </td>
        )
      })}

      <td className="px-3 py-3" />
    </tr>
  )
}
