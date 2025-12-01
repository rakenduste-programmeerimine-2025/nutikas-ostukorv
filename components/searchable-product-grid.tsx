'use client'

import { useState } from 'react'
import ProductCard from '@/components/product-card'

type Product = {
  id: string | number
  name: string
  store_id: string | number | null
  [key: string]: unknown
}

type Store = {
  id: string | number
  name: string
  [key: string]: unknown
}

export default function SearchableProductGrid({
  categoryName,
  products,
  storesMap,
}: {
  categoryName: string
  products: Product[]
  storesMap: Record<string, Store>
}) {
  const [query, setQuery] = useState('')

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <>
      <div className="w-full flex justify-center mb-4">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Otsi toodet"
          className="
            w-full 
            max-w-xl 
            mx-auto 
            border 
            rounded-full 
            px-4 
            py-3 
            bg-background 
            text-foreground 
            outline-none
          "
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {filteredProducts.map(p => (
          <ProductCard
            key={p.id}
            product={p}
            categoryName={categoryName}
            storeName={storesMap[String(p.store_id)]?.name}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <p className="text-muted-foreground mt-6">Ühtegi toodet ei leitud.</p>
      )}
    </>
  )
}
