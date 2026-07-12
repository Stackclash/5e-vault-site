---
category: Forms
---

Single-choice group; compose with RadioGroupItem (each takes `value` and an id for its Label).

Parts: `RadioGroup`, `RadioGroupItem`

```tsx
<RadioGroup defaultValue="martial">
  <div className="flex items-center gap-2">
    <RadioGroupItem value="martial" id="martial" />
    <Label htmlFor="martial">Martial</Label>
  </div>
  <div className="flex items-center gap-2">
    <RadioGroupItem value="caster" id="caster" />
    <Label htmlFor="caster">Caster</Label>
  </div>
</RadioGroup>
```
