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
    <div className="flex items-center gap-3">
      {links.map(link => {
        const isActive = active === link.label

        return (
          <Link
            key={link.href}
            href={link.href}
            className={
              isActive
                ? 'px-4 py-2 rounded-md bg-primary text-primary-foreground'
                : 'px-4 py-2 rounded-md bg-card text-card-foreground border'
            }
          >
            {link.label}
          </Link>
        )
      })}
    </div>
  )
}
