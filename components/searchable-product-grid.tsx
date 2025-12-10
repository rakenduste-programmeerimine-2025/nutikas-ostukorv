'use client'

import ProductCard, { Product as CardProduct } from '@/components/product-card'

type Store = {
  id: string | number
  name: string
  [key: string]: unknown
}

export default function SearchableProductGrid({
  categoryName,
  products,
  storesMap,
  storeNamesByProductId,
  onSelectProduct,
}: {
  categoryName: string
  products: CardProduct[]
  storesMap: Record<string, Store>
  storeNamesByProductId?: Record<string, string[]>
  onSelectProduct: (product: CardProduct) => void
}) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {products.map(p => {
          const pid = String(p.id)
          const multi = storeNamesByProductId?.[pid]
          const singleStore = storesMap[String((p as any).store_id)]?.name

          return (
            <div key={p.id} onClick={() => onSelectProduct(p)} className="cursor-pointer">
              <ProductCard
                product={p}
                categoryName={categoryName}
                storeNames={multi}
                storeName={!multi || multi.length === 0 ? singleStore : undefined}
              />
            </div>
          )
        })}
      </div>

      {products.length === 0 && (
        <p className="text-muted-foreground mt-6">Ühtegi toodet ei leitud.</p>
      )}
    </>
  )
}
