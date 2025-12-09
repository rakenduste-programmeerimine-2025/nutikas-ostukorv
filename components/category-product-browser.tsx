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

  const filtered = products
    .filter(p => (selectedStore ? String(p.store_id) === selectedStore : true))
    .filter(p => (minPrice ? Number(p.price) >= Number(minPrice) : true))
    .filter(p => (maxPrice ? Number(p.price) <= Number(maxPrice) : true))
    .sort((a, b) => {
      if (sort === 'price_asc') return Number(a.price ?? 0) - Number(b.price ?? 0)
      if (sort === 'price_desc') return Number(b.price ?? 0) - Number(a.price ?? 0)
      return 0
    })
    .slice(0, limit)

  return (
    <div className="w-full flex flex-col gap-6">
      <FilterBar
        stores={stores}
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
          setSelectedStore(null)
          setMinPrice('')
          setMaxPrice('')
          setLimit(30)
          setSort('price_asc')
        }}
      />

      <SearchableProductGrid
        categoryName=""
        products={filtered}
        storesMap={Object.fromEntries(stores.map(s => [String(s.id), s]))}
        onSelectProduct={setSelectedProduct}
      />

      <ProductInfoModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  )
}
