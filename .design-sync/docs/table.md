---
category: Display
---

Data table. Compose: TableHeader > TableRow > TableHead; TableBody > TableRow > TableCell; optional TableCaption / TableFooter.

Parts: `Table`, `TableHeader`, `TableBody`, `TableFooter`, `TableHead`, `TableRow`, `TableCell`, `TableCaption`

```tsx
<Table>
  <TableCaption>Party roster</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Character</TableHead>
      <TableHead>Class</TableHead>
      <TableHead className="text-right">Level</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Elaria</TableCell>
      <TableCell>Ranger</TableCell>
      <TableCell className="text-right">7</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Thorgrim</TableCell>
      <TableCell>Paladin</TableCell>
      <TableCell className="text-right">6</TableCell>
    </TableRow>
  </TableBody>
</Table>
```
