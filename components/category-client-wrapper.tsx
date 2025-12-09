'use client'

import { useState } from 'react'
import GlobalProductSearch from '@/components/ui/global-product-search'
import ProductInfoModal from '@/components/ui/product-info-modal'

export default function CategoryClientWrapper({ allProducts }: { allProducts: any[] }) {
  const [selectedProduct, setSelectedProduct] = useState(null)

  return (
    <>
      <GlobalProductSearch allProducts={allProducts} onSelectProduct={p => setSelectedProduct(p)} />

      <ProductInfoModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </>
  )
}
