'use client'

import React, { useMemo, useState } from 'react'
import FilterBar from '@/components/ui/filter-bar'
import ProductInfoModal from '@/components/ui/product-info-modal'
import ProductCard from '@/components/product-card'
import { Product } from '@/components/product-card'

export default function SearchResultsClient({
  initialProducts,
  categories,
  stores,
}: {
  initialProducts: Product[]
  categories: any[]
  stores: any[]
  initialQuery: string
}) {
  const categoriesMap = React.useMemo(
    () => Object.fromEntries((categories || []).map((c: any) => [String(c.id), c.name])),
    [categories]
  )
  const storesMap = React.useMemo(
    () => Object.fromEntries((stores || []).map((s: any) => [String(s.id), s.name])),
    [stores]
  )

  const [selectedStore, setSelectedStore] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [limit, setLimit] = useState(30)
  const [sort, setSort] = useState<string | null>('price_asc')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [page, setPage] = useState(1)

  const filteredAll = useMemo(() => {
    return initialProducts
      .filter(p => (selectedCategory ? String(p.category_id) === selectedCategory : true))
      .filter(p => (selectedStore ? String(p.store_id) === selectedStore : true))
      .filter(p => (minPrice ? Number(p.price) >= Number(minPrice) : true))
      .filter(p => (maxPrice ? Number(p.price) <= Number(maxPrice) : true))
      .sort((a, b) => {
        if (sort === 'price_asc') return Number(a.price) - Number(b.price)
        if (sort === 'price_desc') return Number(b.price) - Number(a.price)
        return 0
      })
  }, [initialProducts, selectedCategory, selectedStore, minPrice, maxPrice, sort])

  const totalPages = Math.max(1, Math.ceil(filteredAll.length / limit))

  const visible = filteredAll.slice((page - 1) * limit, page * limit)

  function goto(p: number) {
    setPage(Math.min(Math.max(1, p), totalPages))
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <FilterBar
        categories={categories}
        stores={stores}
        selectedCategory={selectedCategory}
        onCategoryChange={v => {
          setSelectedCategory(v)
          setPage(1)
        }}
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
          setSelectedCategory(null)
          setSelectedStore(null)
          setMinPrice('')
          setMaxPrice('')
          setLimit(30)
          setSort('price_asc')
          setPage(1)
        }}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visible.map(p => (
          <div
            key={p.id}
            className="cursor-pointer transition hover:scale-[1.01]"
            onClick={() => setSelectedProduct(p)}
          >
            <ProductCard
              product={p}
              categoryName={categoriesMap[String(p.category_id)]}
              storeName={storesMap[String(p.store_id)]}
            />
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
