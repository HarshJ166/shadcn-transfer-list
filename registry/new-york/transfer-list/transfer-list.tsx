"use client"

import * as React from "react"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/new-york/ui/button"
import { Checkbox } from "@/registry/new-york/ui/checkbox"
import { Input } from "@/registry/new-york/ui/input"

export type TransferItem = {
  value: string
  label: React.ReactNode
  disabled?: boolean
}

type TransferListProps = {
  items: TransferItem[]
  /** Values in the right pane (controlled). */
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  titles?: [string, string]
  searchable?: boolean
  className?: string
}

function TransferList({
  items,
  value,
  defaultValue,
  onValueChange,
  titles = ["Available", "Selected"],
  searchable = true,
  className,
}: TransferListProps) {
  const [internal, setInternal] = React.useState(defaultValue ?? [])
  const [checked, setChecked] = React.useState<Set<string>>(() => new Set())
  const selected = value ?? internal

  const selectedSet = new Set(selected)
  const left = items.filter((item) => !selectedSet.has(item.value))
  const right = items.filter((item) => selectedSet.has(item.value))

  function setSelected(next: string[]) {
    if (value === undefined) setInternal(next)
    onValueChange?.(next)
  }

  function toggle(values: string[], on: boolean) {
    setChecked((prev) => {
      const next = new Set(prev)
      for (const v of values) {
        if (on) next.add(v)
        else next.delete(v)
      }
      return next
    })
  }

  function movable(source: TransferItem[], onlyChecked: boolean) {
    return source
      .filter((item) => !item.disabled && (!onlyChecked || checked.has(item.value)))
      .map((item) => item.value)
  }

  function move(toRight: boolean, onlyChecked: boolean) {
    const moving = movable(toRight ? left : right, onlyChecked)
    const movingSet = new Set(moving)
    setSelected(
      toRight
        ? [...selected, ...moving]
        : selected.filter((v) => !movingSet.has(v))
    )
    toggle(moving, false)
  }

  const actions = [
    { label: "Move all to " + titles[1], icon: ChevronsRightIcon, toRight: true, onlyChecked: false },
    { label: "Move checked to " + titles[1], icon: ChevronRightIcon, toRight: true, onlyChecked: true },
    { label: "Move checked to " + titles[0], icon: ChevronLeftIcon, toRight: false, onlyChecked: true },
    { label: "Move all to " + titles[0], icon: ChevronsLeftIcon, toRight: false, onlyChecked: false },
  ]

  return (
    <div
      data-slot="transfer-list"
      className={cn(
        "grid w-full gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center",
        className
      )}
    >
      <TransferPane
        title={titles[0]}
        items={left}
        checked={checked}
        onToggle={toggle}
        searchable={searchable}
      />
      <div className="flex justify-center gap-2 sm:flex-col">
        {actions.map(({ label, icon: Icon, toRight, onlyChecked }) => (
          <Button
            key={label}
            type="button"
            variant="outline"
            size="icon"
            aria-label={label}
            title={label}
            disabled={!movable(toRight ? left : right, onlyChecked).length}
            onClick={() => move(toRight, onlyChecked)}
          >
            <Icon className="rotate-90 sm:rotate-0" />
          </Button>
        ))}
      </div>
      <TransferPane
        title={titles[1]}
        items={right}
        checked={checked}
        onToggle={toggle}
        searchable={searchable}
      />
    </div>
  )
}

function TransferPane({
  title,
  items,
  checked,
  onToggle,
  searchable,
}: {
  title: string
  items: TransferItem[]
  checked: Set<string>
  onToggle: (values: string[], on: boolean) => void
  searchable: boolean
}) {
  const titleId = React.useId()
  const [query, setQuery] = React.useState("")

  // Non-string labels are searched by their value.
  const q = query.trim().toLowerCase()
  const visible = q
    ? items.filter((item) =>
        (typeof item.label === "string" ? item.label : item.value)
          .toLowerCase()
          .includes(q)
      )
    : items
  const enabled = visible.filter((item) => !item.disabled)
  const checkedCount = items.filter((item) => checked.has(item.value)).length
  const enabledChecked = enabled.filter((item) => checked.has(item.value)).length
  // Plain boolean (no "indeterminate") so it works with both Radix and Base UI checkboxes.
  const allChecked = enabled.length > 0 && enabledChecked === enabled.length

  return (
    <div
      role="group"
      aria-labelledby={titleId}
      data-slot="transfer-list-pane"
      className="flex min-w-0 flex-col rounded-md border bg-background shadow-xs"
    >
      <div className="flex items-center gap-2 border-b px-3 py-2">
        <Checkbox
          aria-label={`Check all in ${title}`}
          checked={allChecked}
          disabled={!enabled.length}
          onCheckedChange={(c) =>
            onToggle(
              enabled.map((item) => item.value),
              c === true
            )
          }
        />
        <span id={titleId} className="text-sm font-medium">
          {title}
        </span>
        <span className="ml-auto text-xs text-muted-foreground tabular-nums">
          {checkedCount}/{items.length}
        </span>
      </div>
      {searchable && (
        <div className="border-b p-2">
          <Input
            type="search"
            placeholder="Search…"
            aria-label={`Search ${title}`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-8"
          />
        </div>
      )}
      <ul className="h-64 overflow-y-auto p-1">
        {visible.map((item) => (
          <li key={item.value}>
            <label className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50 has-[:disabled]:hover:bg-transparent">
              <Checkbox
                checked={checked.has(item.value)}
                disabled={item.disabled}
                onCheckedChange={(c) => onToggle([item.value], c === true)}
              />
              {item.label}
            </label>
          </li>
        ))}
        {!visible.length && (
          <li className="py-6 text-center text-sm text-muted-foreground">
            No items
          </li>
        )}
      </ul>
    </div>
  )
}

export { TransferList }
