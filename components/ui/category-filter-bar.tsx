'use client'

import * as React from 'react'

interface CategoryFilterBarProps {
  stores: any[]
  selectedStore: string | null
  onStoreChange: (v: string | null) => void

  minPrice: string
  maxPrice: string
  onMinPriceChange: (v: string) => void
  onMaxPriceChange: (v: string) => void

  limit: number
  onLimitChange: (n: number) => void

  selectedSort?: string | null
  onSortChange?: (v: string | null) => void

  onClear: () => void
}

export default function CategoryFilterBar({
  stores,
  selectedStore,
  onStoreChange,
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  limit,
  onLimitChange,
  selectedSort,
  onSortChange,
  onClear,
}: CategoryFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-3xl self-center">
      <label className="text-sm">Pood</label>
      <select
        value={selectedStore ?? ''}
        onChange={e => onStoreChange(e.target.value || null)}
        className="border rounded px-2 py-1 bg-background"
      >
        <option value="">Kõik</option>
        {stores.map(s => (
          <option key={s.id} value={String(s.id)}>
            {s.name}
          </option>
        ))}
      </select>

      <label className="text-sm">Hind</label>
      <input
        type="number"
        placeholder="min"
        value={minPrice}
        onChange={e => onMinPriceChange(e.target.value)}
        className="border rounded px-2 py-1 w-20 bg-background"
      />
      <input
        type="number"
        placeholder="max"
        value={maxPrice}
        onChange={e => onMaxPriceChange(e.target.value)}
        className="border rounded px-2 py-1 w-20 bg-background"
      />

      <label className="text-sm">Kuva</label>
      <select
        value={String(limit)}
        onChange={e => onLimitChange(Number(e.target.value))}
        className="border rounded px-2 py-1 bg-background"
      >
        <option value="15">15</option>
        <option value="30">30</option>
        <option value="90">90</option>
      </select>

      <label className="text-sm">Sorteeri</label>
      <select
        value={selectedSort ?? ''}
        onChange={e => onSortChange?.(e.target.value || null)}
        className="border rounded px-2 py-1 bg-background"
      >
        <option value="price_asc">Odavaim</option>
        <option value="price_desc">Kalleim</option>
      </select>

      <button
        onClick={onClear}
        type="button"
        className="
          ml-2 px-3 py-1 border rounded text-sm 
          text-muted-foreground 
          transition-colors
          bg-background
          hover:bg-muted/50
        "
      >
        Tühjenda
      </button>
    </div>
  )
}
