---
category: Forms
---

Dropdown select. Compose: Select > SelectTrigger (with SelectValue placeholder) + SelectContent > SelectItem. SelectTrigger takes size="sm" | "default".

Parts: `Select`, `SelectContent`, `SelectGroup`, `SelectItem`, `SelectLabel`, `SelectScrollDownButton`, `SelectScrollUpButton`, `SelectSeparator`, `SelectTrigger`, `SelectValue`

```tsx
<Select defaultValue="wizard">
  <SelectTrigger className="w-48"><SelectValue placeholder="Choose a class" /></SelectTrigger>
  <SelectContent>
    <SelectItem value="wizard">Wizard</SelectItem>
    <SelectItem value="rogue">Rogue</SelectItem>
    <SelectItem value="paladin">Paladin</SelectItem>
  </SelectContent>
</Select>
```
