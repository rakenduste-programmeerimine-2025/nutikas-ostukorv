'use client'

import * as React from 'react'
import { Card, CardContent, CardFooter } from './ui/card'
import { Button } from './ui/button'
import { useCart } from '@/components/cart/cart-context'

export interface Product {
  id: number
  name: string
  price: number
  category_id?: string | number | null
  store_id?: number | string | null
  image_url?: string
}

interface ProductCardProps {
  product: Product
  categoryName?: string
  // Single store name (legacy use). If storeNames is provided, this is ignored.
  storeName?: string
  // Optional multiple store names for grouped products.
  storeNames?: string[]
  onAdd?: (product: Product) => void
}

export function ProductCard({
  product,
  categoryName,
  storeName,
  storeNames,
  onAdd,
}: ProductCardProps) {
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

  const effectiveStoreNames: string[] = React.useMemo(() => {
    if (storeNames && storeNames.length > 0) {
      return Array.from(new Set(storeNames))
    }
    return storeName ? [storeName] : []
  }, [storeName, storeNames])

  const renderStorePill = (name: string, idx: number) => {
    const lower = name.toLowerCase()
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

    return (
      <span key={`${name}-${idx}`} className={classes}>
        {name}
      </span>
    )
  }

  return (
    <Card className="w-full h-80 flex flex-col justify-between overflow-hidden relative pb-12 border border-muted shadow-sm hover:shadow-lg transition-shadow duration-200 bg-white dark:bg-neutral-900">
      <div className="relative flex-shrink-0 bg-white">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-44 object-contain rounded-t-md bg-white border-b border-muted"
          />
        ) : (
          <div className="w-full h-44 bg-white flex items-center justify-center text-sm text-muted-foreground rounded-t-md border-b border-muted">
            No image
          </div>
        )}

        {categoryName && (
          <div className="absolute top-3 left-3 z-10">
            <span className="px-2 py-0.5 rounded bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-medium whitespace-nowrap shadow-sm">
              {categoryName}
            </span>
          </div>
        )}

        <Button
          variant="default"
          size="icon"
          className="absolute top-3 right-3 rounded-full shadow-md bg-green-500 hover:bg-green-600 text-white border-2 border-white dark:border-neutral-900"
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
          <div className="flex items-center justify-between mb-1 min-h-[24px]">
            <span className="text-sky-500 font-semibold text-base">{price}</span>
            {effectiveStoreNames.length > 0 && (
              <div className="flex gap-1 flex-wrap justify-end max-w-[70%]">
                {effectiveStoreNames.map((n, idx) => renderStorePill(n, idx))}
              </div>
            )}
          </div>
          <div className="mt-1 text-lg font-bold line-clamp-2 text-foreground">
            {product.name}
          </div>
        </div>
      </CardContent>

      <CardFooter className="absolute bottom-0 left-0 w-full pb-4">
        <div className="flex w-full items-center justify-between text-sm text-muted-foreground">
          <div>1 tk</div>
          <div>{price}/tk</div>
        </div>
      </CardFooter>
    </Card>
  )
}

export default ProductCard
