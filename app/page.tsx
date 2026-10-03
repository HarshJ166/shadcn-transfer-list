"use client"

import * as React from "react"
import { OpenInV0Button } from "@/components/open-in-v0-button"
import {
  TransferList,
  type TransferItem,
} from "@/registry/new-york/transfer-list/transfer-list"

const frameworks: TransferItem[] = [
  { value: "next", label: "Next.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
  { value: "nuxt", label: "Nuxt" },
  { value: "sveltekit", label: "SvelteKit" },
  { value: "solid", label: "SolidStart" },
  { value: "gatsby", label: "Gatsby", disabled: true },
  { value: "vite", label: "Vite" },
  { value: "angular", label: "Angular" },
  { value: "qwik", label: "Qwik" },
]

export default function Home() {
  const [value, setValue] = React.useState(["astro"])

  return (
    <div className="max-w-3xl mx-auto flex flex-col min-h-svh px-4 py-8 gap-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Transfer List</h1>
        <p className="text-muted-foreground">
          A dual-listbox for moving items between two lists, built on shadcn/ui.
        </p>
        <code className="mt-2 w-fit rounded-md bg-muted px-3 py-1.5 text-sm">
          npx shadcn@latest add @harshj/transfer-list
        </code>
      </header>
      <main className="flex flex-col flex-1 gap-8">
        <div className="flex flex-col gap-4 border rounded-lg p-4 relative">
          <div className="flex items-center justify-between">
            <h2 className="text-sm text-muted-foreground sm:pl-3">
              Controlled, with a disabled item
            </h2>
            <OpenInV0Button name="transfer-list" className="w-fit" />
          </div>
          <TransferList
            items={frameworks}
            value={value}
            onValueChange={setValue}
            titles={["Frameworks", "Your stack"]}
          />
          <pre className="rounded-md bg-muted p-3 text-xs">
            {JSON.stringify(value)}
          </pre>
        </div>
      </main>
    </div>
  )
}
