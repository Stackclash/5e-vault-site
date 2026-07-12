---
category: Display
---

Empty-state block. Compose: EmptyHeader > EmptyMedia (variant="icon" for an icon tile) + EmptyTitle + EmptyDescription, then EmptyContent for actions.

Parts: `Empty`, `EmptyHeader`, `EmptyTitle`, `EmptyDescription`, `EmptyContent`, `EmptyMedia`

```tsx
<Empty>
  <EmptyHeader>
    <EmptyMedia variant="icon"><MapPin className="size-6" /></EmptyMedia>
    <EmptyTitle>No locations yet</EmptyTitle>
    <EmptyDescription>Locations appear here once the party discovers them.</EmptyDescription>
  </EmptyHeader>
  <EmptyContent><Button size="sm">Add location</Button></EmptyContent>
</Empty>
```
