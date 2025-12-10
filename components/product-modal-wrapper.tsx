'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import ProductCard, { Product } from '@/components/product-card'
import ProductInfoModal from '@/components/ui/product-info-modal'

export default function ProductModalWrapper({
  extraSantaProducts = [],
}: {
  extraSantaProducts?: Product[]
}) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [categoriesMap, setCategoriesMap] = useState<Record<string, string>>({})
  const [storesMap, setStoresMap] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      const supabase = createClient()
      const { data, error } = await supabase
        .from('product')
        .select('*')
        .in('id', [2001, 2200, 1500])

      if (!error && data) {
        // Keep the original three featured products as-is
        setProducts(data as Product[])

        // Fetch categories and stores referenced by both featured and extra products
        const merged = [...data, ...extraSantaProducts] as any[]
        const categoryIds = Array.from(new Set(merged.map(p => p.category_id).filter(Boolean)))
        const storeIds = Array.from(new Set(merged.map(p => p.store_id).filter(Boolean)))

        if (categoryIds.length > 0) {
          const { data: cats } = await supabase.from('category').select('*').in('id', categoryIds)
          const cmap: Record<string, string> = {}
          ;(cats || []).forEach((c: any) => (cmap[String(c.id)] = c.name))
          setCategoriesMap(cmap)
        }

        if (storeIds.length > 0) {
          const { data: stores } = await supabase.from('store').select('*').in('id', storeIds)
          const smap: Record<string, string> = {}
          ;(stores || []).forEach((s: any) => (smap[String(s.id)] = s.name))
          setStoresMap(smap)
        }
      }
      setLoading(false)
    }
    fetchProducts()
  }, [extraSantaProducts])

  const displayProducts: Product[] = [
    ...products,
    ...extraSantaProducts.filter(p => !products.some(existing => existing.id === p.id)),
  ]

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 text-center">Laadimine...</div>
        ) : displayProducts.length === 0 ? (
          <div className="col-span-3 text-center">Tooteid ei leitud.</div>
        ) : (
          displayProducts.map(product => (
            <div
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className="cursor-pointer"
            >
              <ProductCard
                product={product}
                categoryName={categoriesMap[String(product.category_id)]}
                storeName={storesMap[String(product.store_id)]}
              />
            </div>
          ))
        )}
      </div>

      <ProductInfoModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        categoryName={
          selectedProduct ? categoriesMap[String(selectedProduct.category_id)] : undefined
        }
        storeName={selectedProduct ? storesMap[String(selectedProduct.store_id)] : undefined}
        onAddToCart={(product, qty) => {
          console.log('Added to cart:', product, 'qty:', qty)
        }}
      />
    </>
  )
}
