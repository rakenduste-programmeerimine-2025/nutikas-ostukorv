'use client'

import * as React from 'react'
import ProductCard, { Product } from '@/components/product-card'
import FilterBar from '@/components/ui/filter-bar'

export default function StoreProductsBrowser({
  products,
  storeName,
}: {
  products: Product[]
  storeName: string
}) {
  const [page, setPage] = React.useState(1)
  const [limit, setLimit] = React.useState(15)
  const [minPrice, setMinPrice] = React.useState('')
  const [maxPrice, setMaxPrice] = React.useState('')
  const [selectedSort, setSelectedSort] = React.useState<string | null>('price_asc')

  const filteredAll = products
    .filter(p => (minPrice ? p.price >= Number(minPrice) : true))
    .filter(p => (maxPrice ? p.price <= Number(maxPrice) : true))
    .sort((a, b) => {
      if (selectedSort === 'price_asc') return a.price - b.price
      if (selectedSort === 'price_desc') return b.price - a.price
      return 0
    })

  const totalPages = Math.max(1, Math.ceil(filteredAll.length / limit))
  const visible = filteredAll.slice((page - 1) * limit, page * limit)

  function goto(p: number) {
    setPage(Math.min(Math.max(1, p), totalPages))
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <FilterBar
        categories={[]}
        stores={[]}
        selectedCategory={null}
        onCategoryChange={() => {}}
        selectedStore={null}
        onStoreChange={() => {}}
        selectedSort={selectedSort}
        onSortChange={v => {
          setSelectedSort(v)
          setPage(1)
        }}
        minPrice={minPrice}
        maxPrice={maxPrice}
        onMinPriceChange={v => {
          setMinPrice(v)
          setPage(1)
        }}
        onMaxPriceChange={v => {
          setMaxPrice(v)
          setPage(1)
        }}
        limit={limit}
        onLimitChange={n => {
          setLimit(n)
          setPage(1)
        }}
        onClear={() => {
          setMinPrice('')
          setMaxPrice('')
          setLimit(15)
          setSelectedSort('price_asc')
          setPage(1)
        }}
      />

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {visible.map(product => (
          <div key={product.id} className="min-h-[320px] flex">
            <ProductCard product={product} storeName={storeName} />
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={() => goto(page - 1)}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Eelmine
          </button>

          <div className="flex gap-2">
            {Array.from({ length: Math.min(7, totalPages) }).map((_, i) => {
              const start = Math.max(1, Math.min(page - 3, totalPages - 6))
              const p = start + i
              if (p > totalPages) return null

              return (
                <button
                  key={p}
                  onClick={() => goto(p)}
                  className={`px-3 py-1 border rounded ${
                    p === page ? 'bg-foreground text-background' : ''
                  }`}
                >
                  {p}
                </button>
              )
            })}
          </div>

          <button
            onClick={() => goto(page + 1)}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Järgmine
          </button>
        </div>
      )}
    </div>
  )
}
