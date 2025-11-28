import Link from 'next/link'

type PillsNavProps = {
  active: 'Andmed' | 'Poenimekiri' | 'Otsing' | 'Tooted'
}

export default function PillsNav({ active }: PillsNavProps) {
  const links = [
    { href: '/data', label: 'Andmed' },
    { href: '/stores', label: 'Poenimekiri' },
    { href: '/', label: 'Otsing' },
    { href: '/browse', label: 'Tooted' },
  ]

  return (
    <div className="inline-flex rounded-lg border border-border bg-background p-1.5 text-base">
      {links.map(link => {
        const isActive = active === link.label

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`px-4 py-2 rounded-md transition-colors whitespace-nowrap ${
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            {link.label}
          </Link>
        )
      })}
    </div>
  )
}
