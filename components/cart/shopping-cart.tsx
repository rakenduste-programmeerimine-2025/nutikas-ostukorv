'use client'

import * as React from 'react'
import { useCart } from './cart-context'

export default function ShoppingCart() {
  const { items, totalItems, removeItem, updateQty, clear } = useCart()
  const [open, setOpen] = React.useState(false)

  const totalPrice = items.reduce((sum, it) => sum + Number(it.product.price) * it.quantity, 0)

  return (
    <div className="fixed top-6 right-6 z-50">
      <div className="flex items-center gap-2">
        <button
          className="relative px-3 py-2 rounded-md bg-foreground text-background"
          onClick={() => setOpen(s => !s)}
          aria-label="Toggle cart"
        >
          Ostukorv
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
              {totalItems}
            </span>
          )}
        </button>
      </div>

      {open && (
        <div className="mt-3 w-80 bg-background border rounded shadow-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold">Ostukorv</h4>
            <button className="text-sm text-muted-foreground" onClick={() => clear()}>
              Tühjenda
            </button>
          </div>

          <div className="max-h-64 overflow-auto">
            {items.length === 0 && (
              <div className="text-sm text-muted-foreground">Ostukorvis on tühi</div>
            )}
            {items.map(it => (
              <div
                key={it.product.id}
                className="flex items-center gap-3 py-2 border-b last:border-b-0"
              >
                <div className="flex-1">
                  <div className="font-medium">{it.product.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {Number(it.product.price).toFixed(2)} €
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    value={String(it.quantity)}
                    className="w-14 border rounded px-2 py-1 text-sm"
                    onChange={e =>
                      updateQty(it.product.id, Math.max(1, Number(e.target.value) || 1))
                    }
                  />
                  <button
                    className="text-sm text-red-600"
                    onClick={() => removeItem(it.product.id)}
                  >
                    Eemalda
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="font-semibold">Kokku</div>
            <div className="font-semibold">{totalPrice.toFixed(2)} €</div>
          </div>

          <div className="mt-3">
            <button className="w-full px-3 py-2 bg-primary text-white rounded">
              Ostunimekirja eksport
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export { ShoppingCart }
