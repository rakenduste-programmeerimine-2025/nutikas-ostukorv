'use client'

import * as React from 'react'
import { useCart } from './cart-context'
import { Trash2, ShoppingCart as CartIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function ShoppingCart() {
  const { items, totalItems, removeItem, updateQty, clear } = useCart()
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  const [sortBy, setSortBy] = React.useState<
    'price-asc' | 'price-desc' | 'qty-asc' | 'qty-desc' | 'none'
  >('none')

  const totalPrice = items.reduce(
    (sum, it) => sum + Number(it.product.price) * it.quantity,
    0
  )

  const sortedItems = React.useMemo(() => {
    const copy = [...items]

    switch (sortBy) {
      case 'price-asc':
        return copy.sort((a, b) => a.product.price - b.product.price)
      case 'price-desc':
        return copy.sort((a, b) => b.product.price - a.product.price)
      case 'qty-asc':
        return copy.sort((a, b) => a.quantity - b.quantity)
      case 'qty-desc':
        return copy.sort((a, b) => b.quantity - a.quantity)
      case 'none':
      default:
        return items
    }
  }, [items, sortBy])

  function exportList() {
    const lines = items.map(
      it =>
        `${it.product.name} - ${Number(it.product.price).toFixed(2)} € x ${it.quantity}\r\n\r\n`
    )

    const totalBlock = `\r\nKokku: ${totalPrice.toFixed(2)} €`
    const text = lines.join('') + totalBlock

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = 'ostunimekiri.txt'
    a.click()

    URL.revokeObjectURL(url)
  }

  return (
    <div className="fixed top-6 right-6 z-50">
      <div className="flex items-center gap-2">
        <Button
          variant="default"
          size="lg"
          className="relative shadow-sm"
          onClick={() => setOpen(s => !s)}
          aria-label="Toggle cart"
        >
          <CartIcon className="mr-2 h-6 w-6" />
          Ostukorv
          {totalItems > 0 && (
            <span className="ml-2 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-600 px-1 text-[11px] font-semibold text-white">
              {totalItems}
            </span>
          )}
        </Button>
      </div>

      {open && (
        <div className="absolute right-0 mt-2 w-[28rem] rounded-xl border border-border bg-card/95 p-4 text-sm shadow-xl backdrop-blur">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="text-sm font-semibold tracking-tight">Ostukorv</h4>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
              onClick={clear}
            >
              <Trash2 className="h-4 w-4" />
              Tühjenda
            </Button>
          </div>

          <div className="mb-3 grid grid-cols-1 gap-2">
            <select
              className="h-8 rounded-md border border-border bg-background/80 px-2 text-xs text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/60"
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
            >
              <option value="none">– Sorteerimine –</option>
              <option value="price-asc">Hind: odavam → kallim</option>
              <option value="price-desc">Hind: kallim → odavam</option>
              <option value="qty-asc">Kogus: väiksem → suurem</option>
              <option value="qty-desc">Kogus: suurem → väiksem</option>
            </select>
          </div>

          <div className="max-h-72 space-y-1 overflow-auto">
            {sortedItems.length === 0 && (
              <div className="text-xs text-muted-foreground">Ostukorv on tühi</div>
            )}

            {sortedItems.map(it => (
              <div
                key={it.product.id}
                className="flex items-center gap-3 border-b border-border/60 py-2 last:border-b-0"
              >
                <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded border bg-white">
                  <img
                    src={it.product.image_url || '/placeholder.png'}
                    alt={it.product.name}
                    className="h-full w-full object-contain"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="truncate text-sm font-medium leading-snug">
                    {it.product.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {Number(it.product.price).toFixed(2)} € / tk
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    value={String(it.quantity)}
                    className="h-8 w-16 rounded-md border border-border bg-background px-2 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/60"
                    onChange={e =>
                      updateQty(
                        it.product.id,
                        Math.max(1, Number(e.target.value) || 1)
                      )
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="px-1 text-xs text-muted-foreground hover:text-destructive"
                    onClick={() => removeItem(it.product.id)}
                  >
                    Eemalda
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between text-sm">
            <div className="text-muted-foreground">Kokku</div>
            <div className="font-semibold">{totalPrice.toFixed(2)} €</div>
          </div>

          <div className="mt-4 space-y-3">
            <Button
              className="w-full"
              onClick={() => {
                setOpen(false)
                router.push('/cart')
              }}
            >
              Detailsem vaade
            </Button>

            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={exportList}
            >
              Ostunimekirja eksport
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full text-xs text-muted-foreground"
              onClick={() => setOpen(false)}
            >
              Sulge
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export { ShoppingCart }
