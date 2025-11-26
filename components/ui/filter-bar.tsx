'use client'

import * as React from 'react'

interface FilterBarProps {
  categories: any[]
  stores: any[]
  selectedCategory: string | null
  onCategoryChange: (v: string | null) => void
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

export default function FilterBar({
  categories,
  stores,
  selectedCategory,
  onCategoryChange,
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
}: FilterBarProps) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-sm">Kategooria</label>
      <select
        value={selectedCategory ?? ''}
        onChange={e => onCategoryChange(e.target.value || null)}
        className="border rounded px-2 py-1"
      >
        <option value="">Kõik</option>
        {categories.map(c => (
          <option key={c.id} value={String(c.id)}>
            {c.name}
          </option>
        ))}
      </select>

      <label className="text-sm">Pood</label>
      <select
        value={selectedStore ?? ''}
        onChange={e => onStoreChange(e.target.value || null)}
        className="border rounded px-2 py-1"
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
        className="border rounded px-2 py-1 w-20"
      />
      <input
        type="number"
        placeholder="max"
        value={maxPrice}
        onChange={e => onMaxPriceChange(e.target.value)}
        className="border rounded px-2 py-1 w-20"
      />

      <label className="text-sm">Kuva</label>
      <select
        value={String(limit)}
        onChange={e => onLimitChange(Number(e.target.value))}
        className="border rounded px-2 py-1"
      >
        <option value="15">15</option>
        <option value="30">30</option>
        <option value="90">90</option>
      </select>

      <label className="text-sm">Sorteeri</label>
      <select
        value={selectedSort ?? ''}
        onChange={e => onSortChange?.(e.target.value || null)}
        className="border rounded px-2 py-1"
      >
        <option value="price_asc">Odavaim</option>
        <option value="price_desc">Kalleim</option>
      </select>

      <button
        onClick={onClear}
        className="ml-2 px-2 py-1 border rounded text-sm text-muted-foreground"
        type="button"
      >
        Tühjenda
      </button>
    </div>
  )
}
