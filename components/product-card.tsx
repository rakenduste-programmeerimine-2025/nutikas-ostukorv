'use client'

import * as React from 'react'
import { Card, CardContent, CardFooter } from './ui/card'
import { Button } from './ui/button'
import { useCart } from '@/components/cart/cart-context'

export interface Product {
  id: number
  name: string
  price: number
  category_id?: string
  store_id?: number
  image_url?: string
}

interface ProductCardProps {
  product: Product
  categoryName?: string
  storeName?: string | string[]
  onAdd?: (product: Product) => void
}

function getStorePillClasses(name: string): string {
  const key = name.toLowerCase()
  if (key.includes('coop')) {
    return 'bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300'
  }
  if (key.includes('rimi')) {
    return 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
  }
  if (key.includes('selver')) {
    return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
  }
  return 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
}

export function ProductCard({ product, categoryName, storeName, onAdd }: ProductCardProps) {
  const storeLabels = React.useMemo(() => {
    if (!storeName) return [] as string[]
    return Array.isArray(storeName) ? storeName : [storeName]
  }, [storeName])
  const price = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'EUR',
  }).format(Number(product.price))

  const cart = (() => {
    try {
      return useCart()
    } catch {
      return null
    }
  })()

  return (
    <Card className="w-full flex flex-col overflow-hidden border border-muted shadow-sm hover:shadow-lg transition-shadow duration-200 bg-white dark:bg-neutral-900">
      <div className="relative bg-white">
        <div className="w-full aspect-[4/3] bg-white flex items-center justify-center border-b border-muted">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          ) : (
            <span className="text-sm text-muted-foreground">No image</span>
          )}
        </div>

        <Button
          variant="outline"
          size="icon"
          className="absolute top-3 right-3 rounded-full border-2 border-emerald-500 text-emerald-500 bg-white/90 hover:bg-emerald-500 hover:text-white shadow-sm dark:bg-neutral-900/80 dark:hover:bg-emerald-500"
          onClick={e => {
            e.stopPropagation()
            onAdd?.(product)
            cart?.addItem(product as any)
          }}
          aria-label={`Add ${product.name}`}
        >
          <span className="text-lg font-bold">+</span>
        </Button>
      </div>

      <CardContent className="flex-1 flex flex-col justify-between px-4 py-2">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sky-500 font-semibold text-base">{price}</span>

            {(categoryName || storeLabels.length > 0) && (
              <div className="flex gap-1">
                {categoryName && (
                  <span className="px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300 text-xs font-medium whitespace-nowrap">
                    {categoryName}
                  </span>
                )}
                {storeLabels.map(name => (
                  <span
                    key={name}
                    className={`px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap ${getStorePillClasses(
                      name
                    )}`}
                  >
                    {name}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="mt-1 text-lg font-bold line-clamp-2 min-h-[3.5rem] text-foreground">
            {product.name}
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-4 pb-4">
        <div className="flex w-full items-center justify-between text-sm text-muted-foreground">
          <div>1 tk</div>
          <div>{price}/tk</div>
        </div>
      </CardFooter>
    </Card>
  )
}

export default ProductCard
