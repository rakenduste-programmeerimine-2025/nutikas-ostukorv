/* eslint-disable @typescript-eslint/no-explicit-any */

import { AuthButton } from '@/components/auth-button'
import { createClient } from '@supabase/supabase-js'
import Navbar from '@/components/ui/navbar'
import PillsNav from '@/components/ui/pills-nav'
import DataTablesTabs from '@/components/data-tables-tabs'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function Page() {
  const { data: stores, error: storeError } = await supabase.from('store').select('*')
  const { data: categories, error: categoryError } =
    await supabase.from('category').select('*')
  const { data: products, error: productError } =
    await supabase.from('product').select('*')
  const { data: users, error: userError } =
    await supabase.from('user').select('*')
  const { data: globalProducts, error: globalProductError } =
    await supabase.from('global_product').select('*')

  if (storeError || categoryError || productError || userError || globalProductError) {
    console.error('Errors:', storeError, categoryError, productError, userError, globalProductError)
    return <p>Error loading data. Check console.</p>
  }

  const categoriesOrdered = (categories ?? []).sort((a: any, b: any) =>
    a.name.localeCompare(b.name)
  )

  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-14 items-center">
        <Navbar right={<AuthButton />} />

        <PillsNav active="Andmed" />

        <div className="w-full max-w-5xl p-6 flex flex-col items-start gap-10">
          <header className="w-full flex flex-col gap-2">
            <h1 className="text-2xl font-semibold">Andmete ülevaade</h1>
            <p className="text-sm text-muted-foreground">
              Supabase tabelite andmete vaatamine ühes kohas.
            </p>
          </header>

          <section className="w-full flex flex-col gap-4">
            <DataTablesTabs
              products={products ?? []}
              categories={categoriesOrdered ?? []}
              stores={stores ?? []}
              users={users ?? []}
              globalProducts={globalProducts ?? []}
            />
          </section>
        </div>
      </div>
    </main>
  )
}
