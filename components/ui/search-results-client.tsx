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

  const filtered = useMemo(() => {
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
      .slice(0, limit)
  }, [initialProducts, selectedCategory, selectedStore, minPrice, maxPrice, limit, sort])

  return (
    <div className="w-full flex flex-col gap-6">
      <FilterBar
        categories={categories}
        stores={stores}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedStore={selectedStore}
        onStoreChange={setSelectedStore}
        minPrice={minPrice}
        maxPrice={maxPrice}
        onMinPriceChange={setMinPrice}
        onMaxPriceChange={setMaxPrice}
        limit={limit}
        onLimitChange={setLimit}
        selectedSort={sort}
        onSortChange={setSort}
        onClear={() => {
          setSelectedCategory(null)
          setSelectedStore(null)
          setMinPrice('')
          setMaxPrice('')
          setLimit(30)
          setSort('price_asc')
        }}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(p => (
          <div key={p.id} className="transition hover:scale-[1.01]">
            <div onClick={() => setSelectedProduct(p)}>
              <ProductCard
                product={p}
                categoryName={categoriesMap[String(p.category_id)]}
                storeName={storesMap[String(p.store_id)]}
              />
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              <span className="font-medium"></span>
            </div>
          </div>
        ))}
      </div>

      <ProductInfoModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  )
}
