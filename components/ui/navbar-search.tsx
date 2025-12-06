'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NavbarSearch() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim().length > 0) {
      router.push(`/search?query=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="flex items-center gap-3 border rounded-full px-3 py-2 bg-card">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Otsi toodet..."
          className="w-full bg-transparent outline-none text-sm"
          aria-label="Otsi tooteid"
        />
        {query && (
          <button aria-label="clear" className="text-sm opacity-60" onClick={() => setQuery('')}>
            ×
          </button>
        )}
      </div>
    </div>
  )
}
