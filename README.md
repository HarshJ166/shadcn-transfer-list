# Transfer List for shadcn/ui

A dual-listbox for moving items between two lists, with search, check-all, disabled items and keyboard support. Works with both Radix (`new-york`) and Base UI (`base-*`) shadcn projects.

Addresses shadcn-ui/ui [#2114](https://github.com/shadcn-ui/ui/issues/2114) and [#3371](https://github.com/shadcn-ui/ui/issues/3371).

## Install

```bash
npx shadcn@latest add @harshj/transfer-list
# or by URL
npx shadcn@latest add https://shadcn-transfer-list-d4gb-two.vercel.app/r/transfer-list.json
```

## Usage

```tsx
import { TransferList } from "@/components/ui/transfer-list"

const items = [
  { value: "next", label: "Next.js" },
  { value: "remix", label: "Remix" },
  { value: "gatsby", label: "Gatsby", disabled: true },
]

export function Example() {
  const [value, setValue] = React.useState<string[]>([])
  return <TransferList items={items} value={value} onValueChange={setValue} />
}
```

## Props

| Prop            | Type                                | Default                    |
| --------------- | ----------------------------------- | -------------------------- |
| `items`         | `{ value, label, disabled? }[]`     | required                   |
| `value`         | `string[]` (values in right pane)   | —                          |
| `defaultValue`  | `string[]`                          | `[]`                       |
| `onValueChange` | `(value: string[]) => void`         | —                          |
| `titles`        | `[string, string]`                  | `["Available", "Selected"]`|
| `searchable`    | `boolean`                           | `true`                     |
| `className`     | `string`                            | —                          |

Search matches string labels; items with non-string labels are matched by `value`. Disabled items are never moved.

## Development

```bash
pnpm dev               # demo at localhost:3000
pnpm registry:build    # writes public/r/*.json
pnpm test:e2e          # Playwright in Chrome, needs `pnpm dev` running
```
