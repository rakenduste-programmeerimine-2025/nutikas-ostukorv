'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import ProductCard, { Product } from '@/components/product-card'

export default function ProductModalWrapper() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      const supabase = createClient()
      const { data, error } = await supabase.from('product').select('*').in('id', [133, 214, 15])
      if (!error && data) {
        setProducts(data)
      }
      setLoading(false)
    }
    fetchProducts()
  }, [])

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 text-center">Laadimine...</div>
        ) : products.length === 0 ? (
          <div className="col-span-3 text-center">Tooteid ei leitud.</div>
        ) : (
          products.map(product => (
            <div
              key={product.id}
              onClick={() => {
                setSelectedProduct(product)
              }}
              className="cursor-pointer"
            >
              <ProductCard product={product} />
            </div>
          ))
        )}
      </div>
    </>
  )
}
