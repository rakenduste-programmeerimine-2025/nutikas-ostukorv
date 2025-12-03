'use client'

import Link from 'next/link'
import * as React from 'react'

interface NavbarProps {
  title?: string
  right?: React.ReactNode
  globalSearch?: React.ReactNode
}

export default function Navbar({ title = 'Nutikas ostukorv', right, globalSearch }: NavbarProps) {
  return (
    <nav className="w-full flex justify-center border-b border-border h-20 sticky top-0 z-50 bg-background text-foreground">
      <div className="w-full max-w-5xl flex items-center justify-between p-3 px-5 text-sm">
        <div className="flex gap-5 items-center font-semibold">
          <Link href="/" className="text-xl">
            {title}
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center gap-3">{globalSearch}</div>

        <div className="flex items-center gap-4">{right}</div>
      </div>
    </nav>
  )
}

export { Navbar }
