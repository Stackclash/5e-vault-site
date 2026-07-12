---
category: Overlays
---

Slide-in panel. Compose: SheetTrigger + SheetContent (side="right" | "left" | "top" | "bottom") > SheetHeader (SheetTitle + SheetDescription) + body + SheetFooter.

Parts: `Sheet`, `SheetTrigger`, `SheetClose`, `SheetContent`, `SheetHeader`, `SheetFooter`, `SheetTitle`, `SheetDescription`

```tsx
<Sheet>
  <SheetTrigger asChild><Button variant="outline">Party inventory</Button></SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Inventory</SheetTitle>
      <SheetDescription>Shared party loot.</SheetDescription>
    </SheetHeader>
  </SheetContent>
</Sheet>
```
