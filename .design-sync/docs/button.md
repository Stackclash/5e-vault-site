---
category: Actions
---

Push button in the vault theme. Defaults to the gold primary; `outline`/`ghost`/`secondary` for lower emphasis, `destructive` for dangerous actions.

```tsx
<div className="flex gap-2">
  <Button>Begin Session</Button>
  <Button variant="outline">View Map</Button>
  <Button variant="destructive" size="sm">Delete NPC</Button>
</div>
```
