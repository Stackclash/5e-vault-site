---
category: Display
---

Show/hide a region. Compose: CollapsibleTrigger + CollapsibleContent.

Parts: `Collapsible`, `CollapsibleTrigger`, `CollapsibleContent`

```tsx
<Collapsible defaultOpen>
  <CollapsibleTrigger asChild><Button variant="ghost" size="sm">Spoilers (DM only)</Button></CollapsibleTrigger>
  <CollapsibleContent className="pt-2 text-sm text-muted-foreground">The innkeeper is secretly a silver dragon.</CollapsibleContent>
</Collapsible>
```
