"use client"

import { useState } from "react"
import { Card, CardContent, CardTitle } from "@/components/ui/card"

export default function ProductModalWrapper() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card
            key={i}
            className="cursor-pointer hover:shadow-lg transition"
            onClick={() => setOpen(true)}
          >
            <div className="h-40 bg-muted-foreground/40 rounded-t-xl" />
            <CardContent>
              <CardTitle>Toode</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">Lühikirjeldus</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {open && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-semibold mb-2">Toode</h2>
            <p className="text-lg font-medium">Hind</p>

            <p className="text-muted-foreground mt-4">
              Kirjeldus.
            </p>

            <button
              onClick={() => setOpen(false)}
              className="mt-6 px-4 py-2 bg-black text-white rounded-lg"
            >
              Sulge
            </button>
          </div>
        </div>
      )}
    </>
  )
}
