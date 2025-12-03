'use client'

import { useState, useEffect } from 'react'
import GlobalProductSearch from '@/components/ui/global-product-search'
import ProductInfoModal from '@/components/ui/product-info-modal'

export default function HomeClientWrapper({ allProducts }: { allProducts: any[] }) {
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null)

  useEffect(() => {
  }, [selectedProduct])

  return (
    <>
      <GlobalProductSearch
        allProducts={allProducts}
        onSelectProduct={p => setSelectedProduct(p)}
      />

      <ProductInfoModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  )
}
