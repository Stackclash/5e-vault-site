---
category: Forms
---

Wraps an input with addons (icons, buttons, text). Use InputGroupInput instead of Input inside; InputGroupAddon takes align="inline-start" | "inline-end" | "block-start" | "block-end"; InputGroupButton takes size="xs" | "sm" | "icon-xs" | "icon-sm".

Parts: `InputGroup`, `InputGroupAddon`, `InputGroupButton`, `InputGroupText`, `InputGroupInput`, `InputGroupTextarea`

```tsx
<InputGroup>
  <InputGroupAddon align="inline-start"><Search className="size-4" /></InputGroupAddon>
  <InputGroupInput placeholder="Search NPCs..." />
</InputGroup>
```
