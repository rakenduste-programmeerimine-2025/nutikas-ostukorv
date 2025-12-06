'use client'

import * as React from 'react'

export interface CartProduct {
  id: number
  name: string
  price: number
  image_url?: string
}

export interface CartItem {
  product: CartProduct
  quantity: number
}

type CartContextType = {
  items: CartItem[]
  addItem: (p: CartProduct, quantity?: number) => void
  removeItem: (id: number) => void
  updateQty: (id: number, qty: number) => void
  clear: () => void
  totalItems: number
}

const CartContext = React.createContext<CartContextType | undefined>(undefined)

function useLocalStorage<T>(key: string, initial: T) {
  const [state, setState] = React.useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : initial
    } catch {
      return initial
    }
  })

  React.useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state))
    } catch {}
  }, [key, state])

  return [state, setState] as const
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useLocalStorage<CartItem[]>('cart.items', [])

  const addItem = React.useCallback(
    (product: CartProduct, quantity: number = 1) => {
      setItems(prev => {
        const idx = prev.findIndex(i => i.product.id === product.id)
        if (idx >= 0) {
          const copy = [...prev]
          copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + quantity }
          return copy
        }
        return [...prev, { product, quantity }]
      })
    },
    [setItems]
  )

  const removeItem = React.useCallback(
    (id: number) => {
      setItems(prev => prev.filter(i => i.product.id !== id))
    },
    [setItems]
  )

  const updateQty = React.useCallback(
    (id: number, qty: number) => {
      setItems(prev => prev.map(i => (i.product.id === id ? { ...i, quantity: qty } : i)))
    },
    [setItems]
  )

  const clear = React.useCallback(() => setItems([]), [setItems])

  const totalItems = items.reduce((sum, it) => sum + it.quantity, 0)

  const value = React.useMemo(
    () => ({ items, addItem, removeItem, updateQty, clear, totalItems }),
    [items, addItem, removeItem, updateQty, clear, totalItems]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = React.useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

export default CartProvider
