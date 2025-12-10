'use client'

import * as React from 'react'
import { useCart } from './cart-context'
import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

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
        <button
          className="relative px-3 py-2 2xl:px-4 2xl:py-2.5 rounded-md bg-foreground text-background text-sm 2xl:text-base"
          onClick={() => setOpen(s => !s)}
          aria-label="Toggle cart"
        >
          Ostukorv
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 2xl:w-7 2xl:h-7 flex items-center justify-center text-xs 2xl:text-sm">
              {totalItems}
            </span>
          )}
        </button>
      </div>

      {open && (
        <div className="absolute right-0 mt-2 w-[28rem] 2xl:w-[32rem] bg-background border rounded shadow-lg p-4 2xl:p-5">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-base 2xl:text-lg">Ostukorv</h4>

            <button
              className="flex items-center gap-1 text-sm 2xl:text-base text-foreground hover:text-red-500/80"
              onClick={clear}
            >
              <Trash2 className="w-4 h-4 2xl:w-5 2xl:h-5" />
              Tühjenda
            </button>
          </div>

          <div className="mb-3 grid grid-cols-1 gap-2">
            <select
              className="border rounded px-2 py-1 text-sm 2xl:text-base"
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

          <div className="max-h-72 2xl:max-h-80 overflow-auto">
            {sortedItems.length === 0 && (
              <div className="text-sm text-muted-foreground">
                Ostukorv on tühi
              </div>
            )}

            {sortedItems.map(it => (
              <div
                key={it.product.id}
                className="flex items-center gap-3 py-2 border-b last:border-b-0"
              >
                <img
                  src={it.product.image_url || '/placeholder.png'}
                  alt={it.product.name}
                  className="w-12 h-12 2xl:w-14 2xl:h-14 object-cover rounded border"
                />

                <div className="flex-1">
                  <div className="font-medium text-sm 2xl:text-base">
                    {it.product.name}
                  </div>
                  <div className="text-sm 2xl:text-base text-muted-foreground">
                    {Number(it.product.price).toFixed(2)} €
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    value={String(it.quantity)}
                    className="w-14 2xl:w-16 border rounded px-2 py-1 text-sm 2xl:text-base"
                    onChange={e =>
                      updateQty(
                        it.product.id,
                        Math.max(1, Number(e.target.value) || 1)
                      )
                    }
                  />
                  <button
                    className="text-sm 2xl:text-base text-foreground hover:text-red-500/80"
                    onClick={() => removeItem(it.product.id)}
                  >
                    Eemalda
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="font-semibold text-base 2xl:text-lg">Kokku</div>
            <div className="font-semibold text-base 2xl:text-lg">
              {totalPrice.toFixed(2)} €
            </div>
          </div>

          <div className="mt-3">
            <button
              onClick={() => {
                setOpen(false)
                router.push('/cart')
              }}
              className="w-full px-3 py-2 2xl:py-2.5 rounded bg-foreground text-background text-sm 2xl:text-base hover:opacity-90"
            >
              Detailsem vaade
            </button>
          </div>

          <div className="mt-3">
            <button
              onClick={exportList}
              className="w-full px-3 py-2 2xl:py-2.5 bg-blue-600 text-white rounded text-sm 2xl:text-base hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Ostunimekirja eksport
            </button>
          </div>

          <div className="mt-2">
            <button
              onClick={() => setOpen(false)}
              className="w-full px-3 py-2 2xl:py-2.5 rounded border border-muted-foreground text-muted-foreground text-sm 2xl:text-base hover:bg-muted/20"
            >
              Sulge
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export { ShoppingCart }
