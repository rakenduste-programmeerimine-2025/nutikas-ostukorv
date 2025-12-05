'use client'

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
  onSelectProduct,
}: {
  categoryName: string
  products: Product[]
  storesMap: Record<string, Store>
  onSelectProduct: (product: Product) => void
}) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {products.map(p => (
          <div
            key={p.id}
            onClick={() => onSelectProduct(p)}
            className="cursor-pointer"
          >
            <ProductCard
              product={p}
              categoryName={categoryName}
              storeName={storesMap[String(p.store_id)]?.name}
            />
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <p className="text-muted-foreground mt-6">Ühtegi toodet ei leitud.</p>
      )}
    </>
  )
}
