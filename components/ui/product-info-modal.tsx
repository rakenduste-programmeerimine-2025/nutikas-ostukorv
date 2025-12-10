'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useCart } from '@/components/cart/cart-context'
import { Button } from '@/components/ui/button'

const STORE_NAMES_BY_ID: Record<number, string> = {
  1: 'Coop',
  2: 'Rimi',
  3: 'Selver',
}

const STORE_LOGOS: Record<string, string> = {
  coop: '/coop_logo.png',
  rimi: '/rimi_logo.avif',
  selver: '/selver_logo.png',
}

function getStoreLogo(name: string | null | undefined): string | undefined {
  if (!name) return undefined
  const key = name.toLowerCase()
  if (key.includes('coop')) return STORE_LOGOS.coop
  if (key.includes('rimi')) return STORE_LOGOS.rimi
  if (key.includes('selver')) return STORE_LOGOS.selver
  return undefined
}

interface ProductInfoModalProps {
  product: any | null
  categoryName?: string
  storeName?: string
  onClose: () => void
  onAddToCart?: (product: any, quantity: number) => void
}

export default function ProductInfoModal({
  product,
  categoryName,
  storeName,
  onClose,
  onAddToCart,
}: ProductInfoModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [mounted, setMounted] = useState(false)
  const [priceComparison, setPriceComparison] = useState<{
    baseProduct: any
    comparisons: any[]
  } | null>(null)
  const [comparisonLoading, setComparisonLoading] = useState(false)
  const [comparisonError, setComparisonError] = useState<string | null>(null)
  const [showSimilar, setShowSimilar] = useState(false)

  const cart = (() => {
    try {
      return useCart()
    } catch {
      return null
    }
  })()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!product) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [product])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  useEffect(() => {
    setQuantity(1)
  }, [product])

  useEffect(() => {
    if (!product) {
      setPriceComparison(null)
      setComparisonError(null)
      return
    }

    setComparisonLoading(true)
    setComparisonError(null)

    fetch(`/api/price-comparison?productId=${product.id}`)
      .then(r => (r.ok ? r.json() : Promise.reject(new Error('Viga hinnavõrdluse laadimisel'))))
      .then(data => {
        setPriceComparison(data)
      })
      .catch(err => {
        console.error(err)
        setComparisonError('Hinnavõrdlust ei õnnestunud laadida')
      })
      .finally(() => setComparisonLoading(false))
  }, [product])

  if (!product || !mounted) return null

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-lg rounded-2xl p-6 bg-background text-foreground shadow-xl">
        <button
          className="absolute top-3 right-3 text-lg opacity-60 hover:opacity-100"
          onClick={onClose}
        >
          ✕
        </button>

        <div className="w-full h-56 rounded-xl overflow-hidden mb-4 bg-white">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-contain"
          />
        </div>

        <h2 className="text-xl font-semibold mb-2">{product.name}</h2>

        {categoryName && (
          <p className="text-sm text-muted-foreground mb-1">Kategooria: {categoryName}</p>
        )}

        {storeName && <p className="text-sm text-muted-foreground mb-1">Pood: {storeName}</p>}

        {(() => {
          const rawPrice = (product as any).price as number | null
          const qtyVal = (product as any).quantity_value as number | null
          const qtyUnit = ((product as any).quantity_unit as string | null) ?? 'ühik'
          const ppuExplicit = (product as any).price_per_unit as number | null

          let price2 =
            rawPrice != null && Number.isFinite(Number(rawPrice))
              ? Number(rawPrice).toFixed(2)
              : null

          // If we have comparison data, show a price range across stores
          // that offer the same logical item.
          try {
            const comps: any[] | undefined = (priceComparison as any)?.comparisons
            if (comps && comps.length > 0) {
              const sameItems = comps.filter(c => c.isSameItem)
              const relevant = sameItems.length > 0 ? sameItems : comps

              const prices = [
                ...relevant.map(c =>
                  Number(
                    (c.price as number | null) ?? (c.product?.price as number | null)
                  )
                ),
                Number(rawPrice ?? NaN),
              ].filter(n => Number.isFinite(n))

              if (prices.length > 0) {
                const min = Math.min(...prices)
                const max = Math.max(...prices)
                if (min === max) price2 = min.toFixed(2)
                else price2 = `${min.toFixed(2)}–${max.toFixed(2)}`
              }
            }
          } catch {
            // best-effort; fall back to single price
          }

          const ppu = (() => {
            if (typeof ppuExplicit === 'number') return ppuExplicit
            if (rawPrice != null && qtyVal != null && qtyVal > 0) {
              return rawPrice / qtyVal
            }
            return null
          })()

          const ppu2 = ppu != null && Number.isFinite(Number(ppu)) ? Number(ppu).toFixed(2) : null

          return (
            <div className="mb-4 flex flex-col gap-0.5">
              {price2 && <p className="text-lg font-medium">{price2} €</p>}
              {ppu2 && qtyVal != null && (
                <p className="text-xs text-muted-foreground">
                  {ppu2} € / {qtyUnit} · pakend: {qtyVal} {qtyUnit}
                </p>
              )}
            </div>
          )
        })()}

        <div className="mt-2 border-t pt-3 mb-4">
          {comparisonLoading && (
            <p className="text-sm text-muted-foreground">Laen hinnavõrdlust...</p>
          )}

          {comparisonError && (
            <p className="text-sm text-destructive">{comparisonError}</p>
          )}

          {priceComparison && priceComparison.comparisons.length > 0 && (() => {
            const comparisons: any[] = priceComparison.comparisons ?? []
            const sameItemsFromApiRaw = comparisons.filter(c => c.isSameItem)
            const similarItemsRaw = comparisons.filter(c => !c.isSameItem)

            const toNum = (v: unknown): number | null => {
              const n = Number(v as any)
              return Number.isFinite(n) ? n : null
            }

            const priceMetric = (c: any): number => {
              const ppu = toNum(c.pricePerUnit ?? (c.product as any)?.price_per_unit)
              const price = toNum(c.price ?? (c.product as any)?.price)
              return ppu ?? price ?? Number.POSITIVE_INFINITY
            }

            // Deduplicate exact matches per store: keep the cheapest candidate for each store.
            const sameItemsFromApi = (() => {
              const byStore = new Map<string, any>()
              for (const c of sameItemsFromApiRaw) {
                const storeId = c.store?.id ?? (c.store as any)?.id
                if (storeId == null) continue
                const key = String(storeId)
                const existing = byStore.get(key)
                if (!existing || priceMetric(c) < priceMetric(existing)) {
                  byStore.set(key, c)
                }
              }
              return Array.from(byStore.values())
            })()

            // Synthesize a base-row entry for the store where the user opened
            // the modal so that the top comparison block always includes it.
            const baseStoreId = (product as any)?.store_id as number | null
            const baseStoreName =
              (product as any)?.store_name ??
              (typeof baseStoreId === 'number' ? STORE_NAMES_BY_ID[baseStoreId] : undefined)

            const baseRow =
              typeof baseStoreId === 'number' && baseStoreName
                ? {
                    product: {
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      quantity_value: (product as any).quantity_value ?? null,
                      quantity_unit: (product as any).quantity_unit ?? null,
                    },
                    store: { id: baseStoreId, name: baseStoreName },
                    price: product.price,
                    pricePerUnit: (product as any).price_per_unit ?? null,
                    isSameItem: true,
                  }
                : null

            const sameItems = (() => {
              const list = baseRow
                ? [baseRow, ...sameItemsFromApi.filter(c => c.store?.name !== baseStoreName)]
                : sameItemsFromApi

              // Final dedupe by store name to avoid showing the same store multiple
              // times if there are still duplicates remaining.
              const byName = new Map<string, any>()
              for (const c of list) {
                const name = (c.store?.name as string | undefined) ?? 'Tundmatu pood'
                const existing = byName.get(name)
                if (!existing || priceMetric(c) < priceMetric(existing)) {
                  byName.set(name, c)
                }
              }
              return Array.from(byName.values())
            })()

            // Group "similar" items by normalised product name so that the same
            // logical variant across multiple stores appears once with
            // multiple store pills.
            const similarGroups = (() => {
              const map = new Map<
                string,
                {
                  key: string
                  name: string
                  items: any[]
                }
              >()

              const canonicalKey = (name: string): string => {
                // 1) lower-case everything
                let lower = name.toLowerCase()

                // 2) normalise patterns like "30 g" -> "30g", "0,5 kg" -> "0.5kg"
                //    so that stores that write the quantity differently still match.
                lower = lower.replace(/(\d+[.,]?\d*)\s*(g|kg|ml|l)\b/g, (_m, num, unit) => {
                  const n = String(num).replace(',', '.')
                  return `${n}${unit}`
                })

                // 3) strip punctuation and collapse whitespace
                const normalised = lower
                  .replace(/[,.;:()]/g, ' ')
                  .replace(/\s+/g, ' ')
                  .trim()

                // 4) sort tokens alphabetically so word order differences don't matter
                return normalised.split(' ').sort().join(' ')
              }

              for (const c of similarItemsRaw) {
                const name = String(c.product?.name ?? '').trim()
                const key = canonicalKey(name)
                const existing = map.get(key)
                if (existing) {
                  existing.items.push(c)
                } else {
                  map.set(key, { key, name, items: [c] })
                }
              }

              return Array.from(map.values()).slice(0, 5)
            })()

            const renderStoreVisual = (storeLabel: string, useLogo: boolean) => {
              if (useLogo) {
                const logo = getStoreLogo(storeLabel)
                if (logo) {
      const lower = storeLabel.toLowerCase()
      const imgClasses = [
        'h-full w-full',
        lower.includes('rimi')
          ? 'object-cover scale-[1.6]'
          : lower.includes('coop')
          ? 'object-contain scale-[1.4]'
          : lower.includes('selver')
          ? 'object-contain scale-[0.85]'
          : 'object-contain',
      ].join(' ')

      return (
        <div className="h-9 w-16 flex items-center justify-center rounded bg-white dark:bg-white/90 overflow-hidden border border-muted">
          <img
            src={logo}
            alt={storeLabel}
            className={imgClasses}
          />
        </div>
      )
                }
              }

              const lower = storeLabel.toLowerCase()
              let classes =
                'px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'

              if (lower.includes('coop')) {
                classes =
                  'px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300'
              } else if (lower.includes('rimi')) {
                classes =
                  'px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
              } else if (lower.includes('selver')) {
                classes =
                  'px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-200'
              }

              return <span className={classes}>{storeLabel}</span>
            }

            const renderRow = (
              c: any,
              idx: number,
              opts: { showName: boolean; emphasize: boolean; useLogo: boolean }
            ) => {
              const storeLabel = c.store?.name ?? 'Tundmatu pood'
              const productName =
                (c.product?.name as string | undefined) ?? 'Tundmatu toode'
              const quantityValue = c.product?.quantity_value as number | null
              const quantityUnit =
                (c.product?.quantity_unit as string | null) ?? 'ühik'
              const rawPrice =
                (c.price as number | null) ?? (c.product?.price as number | null)
              const rawPpu = c.pricePerUnit as number | null

              const price2 =
                rawPrice != null && Number.isFinite(Number(rawPrice))
                  ? Number(rawPrice).toFixed(2)
                  : null
              const ppu2 =
                rawPpu != null && Number.isFinite(Number(rawPpu))
                  ? Number(rawPpu).toFixed(2)
                  : null

              const rowClasses = opts.emphasize
                ? 'flex items-center justify-between gap-3 rounded-lg bg-muted/40 px-3 py-2'
                : 'flex items-center justify-between gap-3 border-b last:border-b-0 pb-2 pt-1'

              const priceSize = opts.emphasize ? 'text-sm md:text-base' : 'text-xs'

              return (
                <li
                  key={c.product?.id ?? idx}
                  className={rowClasses}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {renderStoreVisual(storeLabel, opts.useLogo)}
                    {opts.showName && (
                      <span className="truncate text-xs">
                        {productName}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col items-end text-xs">
                    {price2 && (
                      <span className={`font-semibold ${priceSize}`}>{price2} €</span>
                    )}
                    {ppu2 && (
                      <span className="text-muted-foreground">
                        {ppu2} € / {quantityUnit}
                      </span>
                    )}
                    {!ppu2 && quantityValue != null && (
                      <span className="text-muted-foreground">
                        {quantityValue} {quantityUnit}
                      </span>
                    )}
                  </div>
                </li>
              )
            }

            const renderSimilarGroup = (g: { key: string; name: string; items: any[] }, idx: number) => {
              const storeLabels = Array.from(
                new Set(
                  g.items.map(c => (c.store?.name as string | undefined) ?? 'Tundmatu pood')
                )
              )

              const quantityUnit =
                (g.items[0]?.product?.quantity_unit as string | null) ?? 'ühik'

              const prices = g.items
                .map(c =>
                  Number(
                    (c.price as number | null) ?? (c.product?.price as number | null)
                  )
                )
                .filter(n => Number.isFinite(n))

              let rangeLabel: string | null = null
              if (prices.length > 0) {
                const min = Math.min(...prices)
                const max = Math.max(...prices)
                rangeLabel = min === max ? `${min.toFixed(2)} €` : `${min.toFixed(2)}–${max.toFixed(2)} €`
              }

              return (
                <li
                  key={g.key ?? idx}
                  className="flex items-center justify-between gap-3 border-b last:border-b-0 pb-2 pt-1"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {storeLabels.map(label => (
                      <span key={label}>{renderStoreVisual(label, false)}</span>
                    ))}
                    <span className="truncate text-xs">{g.name}</span>
                  </div>

                  <div className="flex flex-col items-end text-xs">
                    {rangeLabel && <span className="font-semibold text-xs">{rangeLabel}</span>}
                    <span className="text-muted-foreground">{quantityUnit}</span>
                  </div>
                </li>
              )
            }

            return (
              <ul className="space-y-2 text-sm">
                {sameItems.length > 0 && (
                  <>
                    {sameItems.map((c, idx) =>
                      renderRow(c, idx, {
                        showName: false,
                        emphasize: true,
                        useLogo: true,
                      })
                    )}
                    {similarGroups.length > 0 && (
                      <li className="pt-3 pb-1">
                        <button
                          type="button"
                          className="w-full flex items-center justify-between rounded-md bg-muted/40 px-3 py-2 text-sm font-semibold hover:bg-muted/60"
                          onClick={() => setShowSimilar(v => !v)}
                        >
                          <span>Sarnased tooted</span>
                          <span className="text-xs text-muted-foreground">
                            {showSimilar ? 'Peida' : 'Näita'} · {similarGroups.length}
                          </span>
                        </button>
                      </li>
                    )}
                    {showSimilar &&
                      similarGroups.map((g, idx) => renderSimilarGroup(g, idx))}
                  </>
                )}

                {sameItems.length === 0 &&
                  showSimilar &&
                  similarGroups.map((g, idx) => renderSimilarGroup(g, idx))}
              </ul>
            )
          })()}
        </div>

        <div className="flex items-center gap-3 mb-6">
          <span className="text-sm">Kogus:</span>

          <button
            className="px-3 py-1 border rounded hover:bg-muted"
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
          >
            -
          </button>

          <span className="px-3">{quantity}</span>

          <button
            className="px-3 py-1 border rounded hover:bg-muted"
            onClick={() => setQuantity(q => q + 1)}
          >
            +
          </button>
        </div>

        <button
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition"
          onClick={() => {
            cart?.addItem(product as any, quantity)
            onAddToCart?.(product, quantity)
            onClose()
          }}
        >
          Lisa korvi
        </button>
      </div>
    </div>,
    document.body
  )
}
