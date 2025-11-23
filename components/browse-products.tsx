'use client'

import * as React from 'react'
import ProductCard, { Product } from './product-card'

export default function BrowseProducts() {
  const [page, setPage] = React.useState(1)
  const [limit, setLimit] = React.useState(12)
  const [products, setProducts] = React.useState<Product[]>([])
  const [categories, setCategories] = React.useState<any[]>([])
  const [stores, setStores] = React.useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null)
  const [total, setTotal] = React.useState(0)
  const [loading, setLoading] = React.useState(false)
  const totalPages = Math.max(1, Math.ceil(total / Math.max(limit, 1)))

  React.useEffect(() => {
    let canceled = false
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (selectedCategory) params.set('category', selectedCategory)

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
  }, [page, limit])

  function goto(p: number) {
    setPage(Math.min(Math.max(1, p), totalPages))
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <label className="text-sm">Kategooria</label>
          <select
            value={selectedCategory ?? ''}
            onChange={e => {
              const v = e.target.value || null
              setSelectedCategory(v)
              setPage(1)
            }}
            className="border rounded px-2 py-1"
          >
            <option value="">Kõik</option>
            {categories.map(c => (
              <option key={c.id} value={String(c.id)}>
                {c.name}
              </option>
            ))}
          </select>

          <label className="text-sm">Kuva</label>
          <select
            value={String(limit)}
            onChange={e => {
              setLimit(Number(e.target.value))
              setPage(1)
            }}
            className="border rounded px-2 py-1"
          >
            <option value="6">6</option>
            <option value="12">12</option>
            <option value="24">24</option>
          </select>
          <span className="text-sm text-muted-foreground">rows</span>
        </div>

        <div className="text-sm text-muted-foreground">
          Kuvatud {(products ?? []).length} of {total}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading
          ? Array.from({ length: limit }).map((_, i) => (
              <div key={i} className="h-40 bg-muted-foreground/20 rounded" />
            ))
          : (() => {
              const categoriesMap = Object.fromEntries(
                (categories ?? []).map((c: any) => [String(c.id), c])
              )
              const storesMap = Object.fromEntries(
                (stores ?? []).map((s: any) => [String(s.id), s])
              )
              return products.map(p => (
                <ProductCard
                  key={p.id}
                  product={p}
                  categoryName={categoriesMap[String((p as any).category_id)]?.name}
                  storeName={storesMap[String((p as any).store_id)]?.name}
                />
              ))
            })()}
          : products.map(p => {
              const categoriesMap = Object.fromEntries(
                (categories ?? []).map((c: any) => [c.id, c])
              )
              const storesMap = Object.fromEntries((stores ?? []).map((s: any) => [s.id, s]))
              return (
                <ProductCard
                  key={p.id}
                  product={p}
                  categoryName={categoriesMap[String(p.category_id)]?.name}
                  storeName={storesMap[String(p.store_id)]?.name}
                />
              )
            })}
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
