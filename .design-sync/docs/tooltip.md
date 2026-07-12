---
category: Overlays
---

Hover hint. Compose: TooltipTrigger + TooltipContent. TooltipProvider is already included inside Tooltip in this codebase.

Parts: `Tooltip`, `TooltipTrigger`, `TooltipContent`, `TooltipProvider`

```tsx
<Tooltip>
  <TooltipTrigger asChild><Button variant="ghost" size="icon"><Info className="size-4" /></Button></TooltipTrigger>
  <TooltipContent>Advantage on stealth checks</TooltipContent>
</Tooltip>
```
