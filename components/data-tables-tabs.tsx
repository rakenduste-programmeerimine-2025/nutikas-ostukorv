"use client"

import { useState } from "react"
import DataTableViewer from "@/components/data-table-viewer"

interface DataTablesTabsProps {
  products: any[]
  categories: any[]
  stores: any[]
  users: any[]
}

type TabId = "products" | "categories" | "stores" | "users"

const TABS: { id: TabId; label: string }[] = [
  { id: "products", label: "Tooted" },
  { id: "categories", label: "Kategooriad" },
  { id: "stores", label: "Poed" },
  { id: "users", label: "Kasutajad" },
]

export default function DataTablesTabs({
  products,
  categories,
  stores,
  users,
}: DataTablesTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("products")

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">Supabase tabelid</h2>
          <p className="text-sm text-muted-foreground">
            Vali, millise tabeli andmeid soovid vaadata.
          </p>
        </div>

        <div className="inline-flex rounded-md border border-border bg-background p-1 text-sm">
          {TABS.map((tab) => {
            const isActive = tab.id === activeTab
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {activeTab === "products" && (
        <DataTableViewer
          categories={categories ?? []}
          products={products ?? []}
          stores={stores ?? []}
        />
      )}

      {activeTab === "categories" && (
        <div className="w-full space-y-3">
          <h3 className="text-lg font-semibold">Kategooriad</h3>
          <div className="w-full overflow-x-auto rounded-md border border-border">
            <table className="w-full border-collapse text-sm sm:text-base">
              <thead className="border-b border-border text-left">
                <tr className="[&>th]:py-2 [&>th]:px-3">
                  <th className="font-medium w-[80px]">ID</th>
                  <th className="font-medium">Nimi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(categories ?? []).map((category: any) => (
                  <tr key={category.id} className="[&>td]:py-2 [&>td]:px-3">
                    <td className="text-xs sm:text-sm text-muted-foreground">
                      {category.id}
                    </td>
                    <td className="font-medium">{category.name}</td>
                  </tr>
                ))}
                {(categories ?? []).length === 0 && (
                  <tr>
                    <td
                      colSpan={2}
                      className="py-4 px-3 text-sm text-muted-foreground text-center"
                    >
                      Kategooriaid ei leitud.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "stores" && (
        <div className="w-full space-y-3">
          <h3 className="text-lg font-semibold">Poed</h3>
          <div className="w-full overflow-x-auto rounded-md border border-border">
            <table className="w-full border-collapse text-sm sm:text-base">
              <thead className="border-b border-border text-left">
                <tr className="[&>th]:py-2 [&>th]:px-3">
                  <th className="font-medium w-[80px]">ID</th>
                  <th className="font-medium">Pood</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(stores ?? []).map((store: any) => (
                  <tr key={store.id} className="[&>td]:py-2 [&>td]:px-3">
                    <td className="text-xs sm:text-sm text-muted-foreground">
                      {store.id}
                    </td>
                    <td className="font-medium">{store.name}</td>
                  </tr>
                ))}
                {(stores ?? []).length === 0 && (
                  <tr>
                    <td
                      colSpan={2}
                      className="py-4 px-3 text-sm text-muted-foreground text-center"
                    >
                      Poode ei leitud.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "users" && (
        <div className="w-full space-y-3">
          <h3 className="text-lg font-semibold">Kasutajad</h3>
          <p className="text-xs text-muted-foreground">
            Näidatakse ainult põhiandmeid (ilma parooli räsi väljata).
          </p>
          <div className="w-full overflow-x-auto rounded-md border border-border">
            <table className="w-full border-collapse text-sm sm:text-base">
              <thead className="border-b border-border text-left">
                <tr className="[&>th]:py-2 [&>th]:px-3">
                  <th className="font-medium w-[90px]">User ID</th>
                  <th className="font-medium">Kasutajanimi</th>
                  <th className="font-medium">E-mail</th>
                  <th className="font-medium hidden lg:table-cell">Loodud</th>
                  <th className="font-medium hidden xl:table-cell">
                    Viimane sisselogimine
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(users ?? []).map((user: any) => {
                  const createdAt = user.created_at
                    ? new Date(user.created_at).toLocaleString()
                    : "-"
                  const lastLogin = user.last_login
                    ? new Date(user.last_login).toLocaleString()
                    : "-"

                  return (
                    <tr key={user.user_id} className="[&>td]:py-2 [&>td]:px-3">
                      <td className="text-xs sm:text-sm text-muted-foreground">
                        {user.user_id}
                      </td>
                      <td className="font-medium whitespace-nowrap">
                        {user.username}
                      </td>
                      <td className="whitespace-nowrap break-all">
                        {user.email}
                      </td>
                      <td className="hidden lg:table-cell whitespace-nowrap text-xs sm:text-sm">
                        {createdAt}
                      </td>
                      <td className="hidden xl:table-cell whitespace-nowrap text-xs sm:text-sm">
                        {lastLogin}
                      </td>
                    </tr>
                  )
                })}
                {(users ?? []).length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-4 px-3 text-sm text-muted-foreground text-center"
                    >
                      Kasutajaid ei leitud.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
