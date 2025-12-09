'use client'

import { useState } from 'react'
import FilterBar from '@/components/ui/category-filter-bar'
import SearchableProductGrid from '@/components/searchable-product-grid'
import ProductInfoModal from '@/components/ui/product-info-modal'

import type { Product as CardProduct } from '@/components/product-card'

type Store = {
  id: string | number
  name: string
  [key: string]: unknown
}

export default function CategoryProductBrowser({
  products,
  stores,
}: {
  products: CardProduct[]
  stores: Store[]
}) {
  const [selectedStore, setSelectedStore] = useState<string | null>(null)
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [limit, setLimit] = useState(30)
  const [sort, setSort] = useState<string | null>('price_asc')
  const [selectedProduct, setSelectedProduct] = useState<CardProduct | null>(null)
  const [page, setPage] = useState(1)

  const filteredAll = products
    .filter(p => (selectedStore ? String(p.store_id) === selectedStore : true))
    .filter(p => (minPrice ? Number(p.price) >= Number(minPrice) : true))
    .filter(p => (maxPrice ? Number(p.price) <= Number(maxPrice) : true))
    .sort((a, b) => {
      if (sort === 'price_asc') return Number(a.price ?? 0) - Number(b.price ?? 0)
      if (sort === 'price_desc') return Number(b.price ?? 0) - Number(a.price ?? 0)
      return 0
    })

  const totalPages = Math.max(1, Math.ceil(filteredAll.length / limit))

  const filtered = filteredAll.slice((page - 1) * limit, page * limit)

  function goto(p: number) {
    setPage(Math.min(Math.max(1, p), totalPages))
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <FilterBar
        stores={stores}
        selectedStore={selectedStore}
        onStoreChange={v => {
          setSelectedStore(v)
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
        selectedSort={sort}
        onSortChange={v => {
          setSort(v)
          setPage(1)
        }}
        onClear={() => {
          setSelectedStore(null)
          setMinPrice('')
          setMaxPrice('')
          setLimit(30)
          setSort('price_asc')
          setPage(1)
        }}
      />

      <SearchableProductGrid
        categoryName=""
        products={filtered}
        storesMap={Object.fromEntries(stores.map(s => [String(s.id), s]))}
        onSelectProduct={setSelectedProduct}
      />

      <ProductInfoModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={() => goto(page - 1)}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Eelmine
          </button>

          <div className="flex items-center gap-2">
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

      <ProductInfoModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  )
}
