'use client'

import { useEffect, useState } from 'react'
import type { Product } from '@/components/product-card'

interface ProductInfoModalProps {
  product: Product | null
  categoryName?: string
  onClose: () => void
  onAddToCart?: (product: Product, quantity: number) => void
}

export default function ProductInfoModal({
  product,
  categoryName,
  onClose,
  onAddToCart,
}: ProductInfoModalProps) {
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  if (!product) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div
        className="
        relative z-10 w-full max-w-md rounded-2xl p-6 
        bg-background text-foreground shadow-xl
      "
      >
        <button
          className="absolute top-3 right-3 text-lg opacity-60 hover:opacity-100"
          onClick={onClose}
        >
          ✕
        </button>

        <div className="w-full h-56 rounded-xl overflow-hidden mb-4 bg-muted/30">
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

        <p className="text-lg font-medium mb-4">{product.price} €</p>

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
          className="
            w-full py-3 rounded-xl 
            bg-primary text-primary-foreground 
            hover:bg-primary/90 transition
          "
          onClick={() => onAddToCart?.(product, quantity)}
        >
          Lisa korvi
        </button>
      </div>
    </div>
  )
}
