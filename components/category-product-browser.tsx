'use client'

import { useMemo, useState } from 'react'
import FilterBar from '@/components/ui/category-filter-bar'
import SearchableProductGrid from '@/components/searchable-product-grid'
import ProductInfoModal from '@/components/ui/product-info-modal'
import type { Product as CardProduct } from '@/components/product-card'
import { groupProducts, type AnyProduct, type ProductGroup } from '@/lib/product-grouping'

type Store = {
  id: string | number
  name: string
  [key: string]: unknown
}

interface CategoryProductBrowserProps {
  products: CardProduct[]
  stores: Store[]
  categories: any[]
}

export default function CategoryProductBrowser({
  products,
  stores,
  categories,
}: CategoryProductBrowserProps) {
  const [selectedStore, setSelectedStore] = useState<string | null>(null)
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [limit, setLimit] = useState(30)
  const [sort, setSort] = useState<string | null>('price_asc')
  const [selectedProduct, setSelectedProduct] = useState<CardProduct | null>(null)
  const [page, setPage] = useState(1)

  const groups: ProductGroup[] = useMemo(
    () => groupProducts(products as AnyProduct[], categories),
    [products, categories]
  )

  const filteredAll = useMemo(() => {
    const meetsPrice = (p: AnyProduct): boolean => {
      const price = Number((p as any).price)
      if (!Number.isFinite(price)) return false
      if (minPrice && price < Number(minPrice)) return false
      if (maxPrice && price > Number(maxPrice)) return false
      return true
    }

    const meetsStore = (p: AnyProduct): boolean => {
      if (!selectedStore) return true
      return String(p.store_id) === selectedStore
    }

    return groups
      .filter(g => g.items.some(p => meetsStore(p) && meetsPrice(p)))
      .sort((a, b) => {
        const metric = (x: ProductGroup): number => {
          const rep = x.representative as any
          const ppu = rep.price_per_unit as number | null
          const price = rep.price as number | null
          const n = (ppu ?? price) ?? Number.POSITIVE_INFINITY
          return Number.isFinite(n) ? n : Number.POSITIVE_INFINITY
        }

        const am = metric(a)
        const bm = metric(b)

        if (sort === 'price_desc') return bm - am
        // default price_asc
        return am - bm
      })
  }, [groups, selectedStore, minPrice, maxPrice, sort])

  const totalPages = Math.max(1, Math.ceil(filteredAll.length / limit))
  const pageGroups = filteredAll.slice((page - 1) * limit, page * limit)
  const pageProducts = pageGroups.map(g => g.representative as CardProduct)

  const storeNamesByProductId = useMemo(() => {
    const map: Record<string, string[]> = {}
    const nameMap = Object.fromEntries(stores.map(s => [String(s.id), s.name]))
    for (const g of pageGroups) {
      const names = Array.from(
        new Set(
          g.items
            .map(p => nameMap[String(p.store_id)] as string | undefined)
            .filter((n): n is string => Boolean(n))
        )
      )
      map[String((g.representative as any).id)] = names
    }
    return map
  }, [pageGroups, stores])

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
        categoryName={''}
        products={pageProducts}
        storesMap={Object.fromEntries(stores.map(s => [String(s.id), s]))}
        storeNamesByProductId={storeNamesByProductId}
        onSelectProduct={setSelectedProduct}
      />

      <ProductInfoModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

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
    </div>
  )
}
