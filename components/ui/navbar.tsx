import Link from 'next/link'
import * as React from 'react'

type NavLink = { href: string; label: string }

interface NavbarProps {
  title?: string
  links?: NavLink[]
  right?: React.ReactNode
}

export default function Navbar({ title = 'Nutikas ostukorv', links = [], right }: NavbarProps) {
  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-20">
      <div className="w-full max-w-5xl flex items-center justify-between p-3 px-5 text-sm">
        <div className="flex gap-5 items-center font-semibold">
          <Link href="/" className="text-xl">
            {title}
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center gap-3"></div>

        <div className="flex items-center gap-4">{right}</div>
      </div>
    </nav>
  )
}

export { Navbar }
