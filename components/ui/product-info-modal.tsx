'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import type { Product } from '@/components/product-card'
import { useCart } from '@/components/cart/cart-context'
import { Button } from '@/components/ui/button'

interface ProductInfoModalProps {
  product: Product | null
  categoryName?: string
  storeName?: string
  onClose: () => void
  onAddToCart?: (product: Product, quantity: number) => void
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
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-md rounded-2xl p-6 bg-background text-foreground shadow-xl">
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
          <p className="text-sm text-muted-foreground mb-1">
            Kategooria: {categoryName}
          </p>
        )}

        {storeName && (
          <p className="text-sm text-muted-foreground mb-1">
            Pood: {storeName}
          </p>
        )}

        {(() => {
          const rawPrice = (product as any).price as number | null
          const qtyVal = (product as any).quantity_value as number | null
          const qtyUnit = ((product as any).quantity_unit as string | null) ?? 'ühik'
          const ppuExplicit = (product as any).price_per_unit as number | null

          const price2 =
            rawPrice != null && Number.isFinite(Number(rawPrice))
              ? Number(rawPrice).toFixed(2)
              : null

          const ppu = (() => {
            if (typeof ppuExplicit === 'number') return ppuExplicit
            if (rawPrice != null && qtyVal != null && qtyVal > 0) {
              return rawPrice / qtyVal
            }
            return null
          })()

          const ppu2 =
            ppu != null && Number.isFinite(Number(ppu))
              ? Number(ppu).toFixed(2)
              : null

          return (
            <div className="mb-4 flex flex-col gap-0.5">
              {price2 && (
                <p className="text-lg font-medium">{price2} €</p>
              )}
              {ppu2 && qtyVal != null && (
                <p className="text-xs text-muted-foreground">
                  {ppu2} € / {qtyUnit} · pakend: {qtyVal} {qtyUnit}
                </p>
              )}
            </div>
          )
        })()}

        <div className="mt-2 border-t pt-3 mb-4">
          <h3 className="text-sm font-semibold mb-2">Hinnavõrdlus poodide lõikes</h3>

          {comparisonLoading && (
            <p className="text-sm text-muted-foreground">Laen hinnavõrdlust...</p>
          )}

          {comparisonError && (
            <p className="text-sm text-destructive">{comparisonError}</p>
          )}

          {priceComparison && priceComparison.comparisons.length > 0 && (
            <ul className="space-y-2 text-sm">
              {priceComparison.comparisons.map((c: any, idx: number) => {
                const storeLabel = c.store?.name ?? 'Tundmatu pood'
                const productName =
                  (c.product?.name as string | undefined) ?? 'Tundmatu toode'
                const quantityValue = c.product?.quantity_value as number | null
                const quantityUnit =
                  (c.product?.quantity_unit as string | null) ?? 'ühik'
                const rawPrice = (c.price as number | null) ?? (c.product?.price as number | null)
                const rawPpu = c.pricePerUnit as number | null

                const price2 =
                  rawPrice != null && Number.isFinite(Number(rawPrice))
                    ? Number(rawPrice).toFixed(2)
                    : null
                const ppu2 =
                  rawPpu != null && Number.isFinite(Number(rawPpu))
                    ? Number(rawPpu).toFixed(2)
                    : null

                const productId = Number(c.product?.id)

                return (
                  <li
                    key={c.product?.id ?? idx}
                    className="flex flex-col gap-1 border-b last:border-b-0 pb-2"
                  >
                    {/* First row: product name (primary) + price + add button */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold truncate">
                            {productName}
                          </span>
                          <span className="text-right font-semibold whitespace-nowrap">
                            {ppu2
                              ? `${ppu2} € / ${quantityUnit}`
                              : price2
                              ? `${price2} €`
                              : '-'}
                          </span>
                        </div>
                      </div>

                      {Number.isFinite(productId) && (
                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          className="h-7 w-7 rounded-full border-green-500 text-green-600 hover:bg-green-500 hover:text-white flex-shrink-0"
                          onClick={() => {
                            if (!cart) return
                            const usablePrice =
                              rawPrice != null
                                ? Number(rawPrice)
                                : rawPpu != null
                                ? Number(rawPpu)
                                : 0
                            cart.addItem(
                              {
                                id: productId,
                                name: productName,
                                price: usablePrice,
                                image_url: c.product?.image_url ?? undefined,
                              } as any,
                              1
                            )
                          }}
                          aria-label={`Lisa korvi: ${productName}`}
                        >
                          <span className="text-base font-bold">+</span>
                        </Button>
                      )}
                    </div>

                    {/* Second row: store + quantity */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="truncate pr-2">{storeLabel}</span>
                      {quantityValue != null && (
                        <span>
                          {quantityValue} {quantityUnit}
                        </span>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          )}

          {priceComparison &&
            priceComparison.comparisons.length === 0 &&
            !comparisonLoading && (
              <p className="text-sm text-muted-foreground">
                Teistes poodides vastavat toodet ei leitud.
              </p>
            )}
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
