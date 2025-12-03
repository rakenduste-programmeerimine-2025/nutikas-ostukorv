'use client'

import * as React from 'react'
import ProductCard, { Product } from './product-card'
import FilterBar from './ui/filter-bar'
import ProductSearch from './product-search'

export default function BrowseProducts() {
  const [page, setPage] = React.useState(1)
  const [limit, setLimit] = React.useState(15)
  const [products, setProducts] = React.useState<Product[]>([])
  const [categories, setCategories] = React.useState<any[]>([])
  const [stores, setStores] = React.useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null)
  const [selectedStore, setSelectedStore] = React.useState<string | null>(null)
  const [minPrice, setMinPrice] = React.useState('')
  const [maxPrice, setMaxPrice] = React.useState('')
  const [selectedSort, setSelectedSort] = React.useState<string | null>('price_asc')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [total, setTotal] = React.useState(0)
  const [loading, setLoading] = React.useState(false)
  const totalPages = Math.max(1, Math.ceil(total / Math.max(limit, 1)))

  React.useEffect(() => {
    let canceled = false
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (selectedCategory) params.set('category', selectedCategory)
    if (selectedStore) params.set('store', selectedStore)
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)
    if (selectedSort) params.set('sort', selectedSort)
    if (searchQuery) params.set('search', searchQuery)

    fetch(`/api/products?${params.toString()}`)
      .then(r => r.json())
      .then(data => {
        if (canceled) return
        setProducts(data.products ?? [])
        setTotal(data.total ?? 0)
        setCategories(data.categories ?? [])
        setStores(data.stores ?? [])
      })
      .catch(() => {
        if (canceled) return
        setProducts([])
        setTotal(0)
      })
      .finally(() => !canceled && setLoading(false))

    return () => {
      canceled = true
    }
  }, [page, limit, selectedCategory, selectedStore, minPrice, maxPrice, selectedSort, searchQuery])

  function goto(p: number) {
    setPage(Math.min(Math.max(1, p), totalPages))
  }

  const categoriesMap = Object.fromEntries((categories ?? []).map((c: any) => [String(c.id), c]))
  const storesMap = Object.fromEntries((stores ?? []).map((s: any) => [String(s.id), s]))

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4 mb-6">
        <ProductSearch
          value={searchQuery}
          onSearchChange={v => {
            setSearchQuery(v)
            setPage(1)
          }}
        />

        <div className="flex items-center justify-between">
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
              setSelectedCategory(null)
              setSelectedStore(null)
              setSelectedSort(null)
              setMinPrice('')
              setMaxPrice('')
              setLimit(15)
              setPage(1)
            }}
          />

          <div className="text-sm text-muted-foreground">
            Kuvatud {(products ?? []).length} of {total}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading
          ? Array.from({ length: limit }).map((_, i) => (
              <div key={i} className="h-40 bg-muted-foreground/20 rounded" />
            ))
          : products.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                categoryName={categoriesMap[String((p as any).category_id)]?.name}
                storeName={storesMap[String((p as any).store_id)]?.name}
              />
            ))}
      </div>

      <div className="flex items-center justify-center gap-3 mt-6">
        <button
          onClick={() => goto(page - 1)}
          disabled={page <= 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Eelmine
        </button>

        <div className="flex items-center gap-2">
          {Array.from({ length: Math.min(7, totalPages) }).map((_, i) => {
            // show a sliding window around current page
            const start = Math.max(1, Math.min(page - 3, totalPages - 6))
            const p = start + i
            if (p > totalPages) return null
            return (
              <button
                key={p}
                onClick={() => goto(p)}
                className={`px-3 py-1 rounded border ${p === page ? 'bg-foreground text-background' : ''}`}
              >
                {p}
              </button>
            )
          })}
        </div>

        <button
          onClick={() => goto(page + 1)}
          disabled={page >= totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Järgmine
        </button>
      </div>
    </div>
  )
}

export { BrowseProducts }
