---
category: Forms
---

Layout primitive for a labeled form control: FieldLabel + control + FieldDescription / FieldError, grouped by FieldGroup / FieldSet / FieldLegend.

Parts: `Field`, `FieldLabel`, `FieldDescription`, `FieldError`, `FieldGroup`, `FieldLegend`, `FieldSeparator`, `FieldSet`, `FieldContent`, `FieldTitle`

```tsx
<FieldGroup>
  <Field>
    <FieldLabel htmlFor="name">Character name</FieldLabel>
    <Input id="name" placeholder="Elaria Moonshadow" />
    <FieldDescription>Shown on the party roster.</FieldDescription>
  </Field>
</FieldGroup>
```
