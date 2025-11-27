"use client"

import { usePathname } from "next/navigation"
import ShoppingCart from "./shopping-cart"

const HIDDEN_ROUTES = ["/auth/login", "/auth/sign-up"]

export function CartVisibilityWrapper() {
  const pathname = usePathname()

  if (HIDDEN_ROUTES.includes(pathname)) {
    return null
  }

  return <ShoppingCart />
}
