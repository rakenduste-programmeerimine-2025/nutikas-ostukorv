import Link from 'next/link'
import * as React from 'react'

interface NavbarProps {
  title?: string
  right?: React.ReactNode
}

export default function Navbar({ title = 'Nutikas ostukorv', right }: NavbarProps) {
  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-20 sticky top-0 z-50 bg-white">
      <div className="w-full max-w-5xl flex items-center justify-between p-3 px-5 text-sm">
        {/* Left section */}
        <div className="flex gap-5 items-center font-semibold">
          <Link href="/" className="text-xl">
            {title}
          </Link>
        </div>

        {/* Center spacer */}
        <div className="flex-1 flex items-center justify-center gap-3" />

        {/* Right section including search */}
        <div className="flex items-center gap-4">
          {/* Search Field */}
          <div className="relative">
            <svg
              className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 3a7.5 7.5 0 006.15 12.65z"
              />
            </svg>

            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-3 py-1.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/20 transition w-48 placeholder:text-gray-400"
            />
          </div>

          {/* Whatever was previously passed to `right` */}
          {right}
        </div>
      </div>
    </nav>
  )
}

export { Navbar }
