"use client"

import { useMemo, useState } from "react"

interface DataTableViewerProps {
  categories: any[]
  products: any[]
  stores: any[]
}

const ALL_CATEGORIES = "all"
const UNCATEGORIZED = "uncategorized"

export default function DataTableViewer({
  categories,
  products,
  stores,
}: DataTableViewerProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(ALL_CATEGORIES)

  const storesMap = useMemo(
    () => Object.fromEntries((stores ?? []).map((s: any) => [String(s.id), s])),
    [stores]
  )

  const categoriesWithSpecial = useMemo(
    () => {
      const ordered = [...(categories ?? [])].sort((a: any, b: any) =>
        a.name.localeCompare(b.name)
      )
      return ordered
    },
    [categories]
  )

  const filteredProducts = useMemo(() => {
    if (!products) return []

    if (selectedCategoryId === ALL_CATEGORIES) {
      return products
    }

    if (selectedCategoryId === UNCATEGORIZED) {
      return products.filter((p: any) => !p.category_id)
    }

    return products.filter(
      (p: any) => p.category_id && String(p.category_id) === selectedCategoryId
    )
  }, [products, selectedCategoryId])

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold">Toodete tabel</h3>
          <p className="text-sm text-muted-foreground">
            Vali kategooria, et filtreerida tabelis kuvatavaid tooteid.
          </p>
        </div>

        <label className="flex flex-col text-sm font-medium gap-1 sm:text-base">
          <span>Kategooria</span>
          <select
            className="bg-background border border-border rounded-md px-3 py-2 text-sm sm:text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
          >
            <option value={ALL_CATEGORIES}>Kõik kategooriad</option>
            <option value={UNCATEGORIZED}>Määramata kategooria</option>
            {categoriesWithSpecial.map((category: any) => (
              <option key={category.id} value={String(category.id)}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="w-full overflow-x-auto rounded-md border border-border">
        <table className="w-full border-collapse text-sm sm:text-base">
          <thead className="border-b border-border text-left">
            <tr className="[&>th]:py-2 [&>th]:px-3">
              <th className="font-medium">Toode</th>
              <th className="font-medium">Hind</th>
              <th className="font-medium">Pood</th>
              <th className="font-medium hidden md:table-cell">Kategooria</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredProducts.map((product: any) => {
              const store = product.store_id
                ? storesMap[String(product.store_id)]
                : undefined
              const category = categories?.find(
                (c: any) => c.id === product.category_id
              )

              const price = (() => {
                const value = product.price
                if (typeof value === "number") return value.toFixed(2)
                if (typeof value === "string") return value
                return null
              })()

              return (
                <tr
                  key={product.id}
                  className="[&>td]:py-2 [&>td]:px-3 align-top"
                >
                  <td className="font-medium whitespace-normal break-words">
                    {product.name}
                  </td>
                  <td className="whitespace-nowrap text-right">
                    {price ? `${price} €` : "-"}
                  </td>
                  <td className="whitespace-nowrap">
                    {store?.name ?? "-"}
                  </td>
                  <td className="hidden md:table-cell whitespace-nowrap">
                    {category?.name ?? "-"}
                  </td>
                </tr>
              )
            })}

            {filteredProducts.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="py-4 px-3 text-sm text-muted-foreground text-center"
                >
                  Valitud kategoorias tooteid ei leitud.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
