'use client'

import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' })

    router.push('/')
    router.refresh()
  }

  return (
    <button onClick={handleLogout}>Logout</button>
  )
}
