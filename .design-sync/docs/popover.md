---
category: Overlays
---

Floating panel anchored to a trigger. Compose: PopoverTrigger + PopoverContent (align="start" | "center" | "end", sideOffset).

Parts: `Popover`, `PopoverTrigger`, `PopoverContent`, `PopoverAnchor`

```tsx
<Popover>
  <PopoverTrigger asChild><Button variant="outline">Roll initiative</Button></PopoverTrigger>
  <PopoverContent className="w-64">
    <p className="text-sm text-muted-foreground">d20 + DEX modifier</p>
  </PopoverContent>
</Popover>
```
