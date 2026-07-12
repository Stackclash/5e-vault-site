# 5e Vault — design system conventions

A **dark-fantasy** design system (shadcn/ui primitives on a Tailwind v4 CSS-first theme). The look is dark-by-default, gold/amber primary, serif display type. Build screens that read like a TTRPG campaign journal.

## Setup — no provider, but you MUST theme the page root

There is **no ThemeProvider and no context wrapper**. Components read their colors from CSS custom properties defined on `:root` in the stylesheet, so importing a component and rendering it Just Works — *except* the theme's dark background/foreground are applied via the page body. Give your top-level screen container `bg-background text-foreground` (and let it fill the viewport) or every design renders dark-on-white and washes out:

```jsx
<div className="min-h-screen bg-background text-foreground font-sans">
  {/* screens go here */}
</div>
```

Overlay components (`Dialog`, `Sheet`, `Popover`, `Tooltip`, `DropdownMenu`, `Select`) portal to `document.body` and are controlled by their own `open`/`defaultOpen` props — no extra setup.

## Styling idiom — Tailwind utilities bound to theme tokens

Style with Tailwind classes that map to the theme tokens. **Do not invent hex colors** — use these token-backed families so light/dark and brand stay consistent:

| Surface / text | Class family |
|---|---|
| Page / card / popover surface | `bg-background`, `bg-card`, `bg-popover`, `bg-muted` |
| Body & de-emphasized text | `text-foreground`, `text-muted-foreground` |
| Brand accent (gold) | `bg-primary` / `text-primary` / `text-primary-foreground` |
| Secondary / accent / destructive | `bg-secondary`, `bg-accent`, `bg-destructive` (+ matching `text-*-foreground`) |
| Borders / focus ring | `border-border`, `ring-ring`, `border-input` |

**Type:** the default font is a serif (`font-sans` → *Crimson Text*, body). Display headings use **`font-serif`** → *Cinzel* (an all-caps engraved face — use it for titles, section headers, hero text, often with `tracking-wide`/`tracking-[0.3em] uppercase` for the small-caps eyebrow look). `font-mono` → *Geist Mono*. Radius via `rounded-md`/`rounded-lg` (base `--radius` 0.5rem).

**Component variants** carry the design language — prefer props over restyling: `Button` `variant` (`default|secondary|outline|ghost|hover|destructive|link`) + `size` (`default|sm|lg|icon|icon-sm|icon-lg`); `Badge`/`Alert`/`Toggle` `variant`. `hover` is this theme's accent-on-hover button style.

## Where the truth lives

- **Tokens & fonts:** the bound `styles.css` and its `@import` closure (the compiled theme — all `--background`/`--primary`/… definitions and `@font-face` rules). Read it before choosing colors.
- **Per component:** `<Name>.d.ts` is the exact prop contract; `<Name>.prompt.md` is usage. Compound components export their parts as named exports (e.g. `Card` + `CardHeader`/`CardTitle`/`CardContent`/`CardFooter`; `Table` + `TableHeader`/`TableRow`/`TableCell`; `Select` + `SelectTrigger`/`SelectContent`/`SelectItem`).

## One idiomatic build snippet

```jsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Badge } from '<pkg>'

<div className="bg-background text-foreground p-8">
  <Card className="w-80">
    <CardHeader>
      <CardTitle className="font-serif tracking-wide">Kaelen Duskbane</CardTitle>
      <CardDescription>Half-Elf Warlock · Level 7</CardDescription>
    </CardHeader>
    <CardContent className="grid grid-cols-3 gap-4 text-sm">
      <div><p className="text-muted-foreground text-xs uppercase tracking-wide">HP</p><p className="font-serif text-lg">54</p></div>
      <div><p className="text-muted-foreground text-xs uppercase tracking-wide">AC</p><p className="font-serif text-lg">15</p></div>
      <div><p className="text-muted-foreground text-xs uppercase tracking-wide">Speed</p><p className="font-serif text-lg">30ft</p></div>
    </CardContent>
    <CardFooter className="gap-2">
      <Button size="sm">View Sheet</Button>
      <Badge variant="destructive">Wounded</Badge>
    </CardFooter>
  </Card>
</div>
```
