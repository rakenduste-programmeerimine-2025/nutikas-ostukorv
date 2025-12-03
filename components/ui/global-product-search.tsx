'use client'

import { useState, useEffect } from 'react'

export default function GlobalProductSearch({
  allProducts,
  onSelectProduct,
}: {
  allProducts: any[]
  onSelectProduct: (product: any) => void
}) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])

  useEffect(() => {
    if (query.length < 4) return setResults([])
    setResults(allProducts.filter(p => p.name.toLowerCase().includes(query.toLowerCase())))
  }, [query, allProducts])

  return (
    <div className="w-full flex flex-col items-center gap-6 relative">
      <h2 className="text-2xl font-medium">Sisesta toote nimi</h2>

      <div className="w-full max-w-2xl relative">
        <div className="flex items-center gap-3 border rounded-full px-4 py-3">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none"
            placeholder="Otsi toodet (min 4 tähemärki)"
          />

          {query && (
            <button
              aria-label="clear"
              className="text-sm opacity-60"
              onClick={() => setQuery('')}
            >
              ×
            </button>
          )}
        </div>

        {query.length >= 4 && results.length > 0 && (
          <div className="absolute left-0 right-0 mt-2 bg-background border rounded-xl shadow-lg max-h-64 overflow-auto z-50">
            {results.map(prod => (
              <div
                key={prod.id}
                onClick={() => onSelectProduct(prod)}
                className="flex items-center gap-3 p-3 border-b last:border-none hover:bg-muted/40 transition cursor-pointer"
              >
                <img
                  src={prod.image_url}
                  alt={prod.name}
                  className="w-12 h-12 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="font-medium">{prod.name}</p>
                  <p className="text-sm text-muted-foreground">{prod.price} €</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {query.length >= 4 && results.length === 0 && (
          <div className="absolute left-0 right-0 mt-2 bg-background border rounded-xl shadow-lg p-4 text-sm text-muted-foreground">
            Tulemusi ei leitud
          </div>
        )}
      </div>
    </div>
  )
}
