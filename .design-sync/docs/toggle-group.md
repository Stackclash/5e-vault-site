---
category: Actions
---

A set of Toggle buttons where one (`type="single"`) or several (`type="multiple"`) can be pressed. Compose with ToggleGroupItem (each takes `value`).

Parts: `ToggleGroup`, `ToggleGroupItem`

```tsx
<ToggleGroup type="single" defaultValue="grid" variant="outline">
  <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
  <ToggleGroupItem value="list">List</ToggleGroupItem>
</ToggleGroup>
```
