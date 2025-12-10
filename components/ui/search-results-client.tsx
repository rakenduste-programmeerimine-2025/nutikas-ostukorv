'use client'

import React, { useMemo, useState } from 'react'
import FilterBar from '@/components/ui/filter-bar'
import ProductInfoModal from '@/components/ui/product-info-modal'
import ProductCard from '@/components/product-card'
import { Product } from '@/components/product-card'
import { groupProducts, type AnyProduct, type ProductGroup } from '@/lib/product-grouping'

function toNumber(value: unknown): number | null {
  const n = Number(value as any)
  return Number.isFinite(n) ? n : null
}

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
  const categoriesNameMap = React.useMemo(
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

  const groups = useMemo(
    () => groupProducts(initialProducts as AnyProduct[], categories),
    [initialProducts, categories]
  )

  const filtered = useMemo(() => {
    const meetsPrice = (p: AnyProduct): boolean => {
      const price = toNumber(p.price)
      if (price == null) return false
      if (minPrice && price < Number(minPrice)) return false
      if (maxPrice && price > Number(maxPrice)) return false
      return true
    }

    const meetsStore = (p: AnyProduct): boolean => {
      if (!selectedStore) return true
      return String(p.store_id) === selectedStore
    }

    return groups
      .filter(g =>
        selectedCategory ? String(g.categoryId) === selectedCategory : true
      )
      .filter(g =>
        // At least one product in the group must be in the selected store and price range.
        g.items.some(p => meetsStore(p) && meetsPrice(p))
      )
      .sort((a, b) => {
        const metric = (x: ProductGroup): number => {
          const rep = x.representative
          const ppu = toNumber((rep as any).price_per_unit)
          const price = toNumber(rep.price)
          return ppu ?? price ?? Number.POSITIVE_INFINITY
        }
        const am = metric(a)
        const bm = metric(b)

        if (sort === 'price_desc') return bm - am
        // default price_asc
        return am - bm
      })
      .slice(0, limit)
  }, [groups, selectedCategory, selectedStore, minPrice, maxPrice, sort, limit])

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
        {filtered.map(group => {
          const rep = group.representative
          const categoryName =
            group.categoryId != null
              ? categoriesNameMap[String(group.categoryId)]
              : undefined

          const storeNames = Array.from(
            new Set(
              group.items
                .map(p => storesMap[String((p as any).store_id)] as string | undefined)
                .filter((n): n is string => Boolean(n))
            )
          )

          return (
            <div key={group.key} className="transition hover:scale-[1.01]">
              <div onClick={() => setSelectedProduct(rep)}>
                <ProductCard
                  product={rep}
                  categoryName={categoryName}
                  storeNames={storeNames}
                />
              </div>
              <div className="mt-2 text-sm text-muted-foreground flex items-center justify-between">
                {group.items.length > 1 && (
                  <span className="font-medium">
                    {group.items.length} poodi
                  </span>
                )}
              </div>
            </div>
          )
        })}
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
