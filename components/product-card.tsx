'use client'

import * as React from 'react'
import { Card, CardContent, CardFooter } from './ui/card'
import { Button } from './ui/button'

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
  storeName?: string
  onAdd?: (product: Product) => void
}

export function ProductCard({ product, categoryName, storeName, onAdd }: ProductCardProps) {
  const price = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'EUR' }).format(
    Number(product.price)
  )

  return (
    <Card className="w-full overflow-hidden relative pb-12">
      <div className="relative">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-full h-44 object-cover" />
        ) : (
          <div className="w-full h-44 bg-gray-100 flex items-center justify-center text-sm text-muted-foreground">
            No image
          </div>
        )}

        <Button
          variant="default"
          size="icon"
          className="absolute top-3 right-3 rounded-full shadow-md bg-green-500 hover:bg-green-600 text-white"
          onClick={() => onAdd?.(product)}
          aria-label={`Add ${product.name}`}
        >
          +
        </Button>
      </div>

      <CardContent>
        <div className="flex flex-col">
          <div className="text-sky-500 font-medium text-base">{price}</div>
          <div className="mt-1 text-lg font-bold">{product.name}</div>
          {categoryName && <div className="text-sm text-muted-foreground mt-2">{categoryName}</div>}
        </div>
      </CardContent>

      <CardFooter className="absolute bottom-0 left-0 w-full pb-4">
        <div className="flex w-full items-center justify-between text-sm text-muted-foreground">
          <div>{'1 tk'}</div>
          <div>{price}/tk</div>
        </div>
      </CardFooter>
    </Card>
  )
}

export default ProductCard
