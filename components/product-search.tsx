'use client'

import * as React from 'react'
import { Input } from './ui/input'
import { Search, X } from 'lucide-react'

interface ProductSearchProps {
  onSearchChange: (query: string) => void
  value: string
}

export default function ProductSearch({ onSearchChange, value }: ProductSearchProps) {
  const [query, setQuery] = React.useState(value)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value
    setQuery(newQuery)
    onSearchChange(newQuery)
  }

  const handleClear = () => {
    setQuery('')
    onSearchChange('')
  }

  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Otsi tooted..."
        value={query}
        onChange={handleChange}
        className="pl-10 pr-10"
      />
      {query && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-muted rounded"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      )}
    </div>
  )
}

export { ProductSearch }
