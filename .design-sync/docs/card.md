---
category: Display
---

Content container — the workhorse surface of the vault. Compose: CardHeader (CardTitle + CardDescription + optional CardAction) + CardContent + CardFooter.

Parts: `Card`, `CardHeader`, `CardFooter`, `CardTitle`, `CardAction`, `CardDescription`, `CardContent`

```tsx
<Card>
  <CardHeader>
    <CardTitle>Ironhold</CardTitle>
    <CardDescription>Dwarven fortress-city in the northern shard</CardDescription>
    <CardAction><Badge variant="outline">Visited</Badge></CardAction>
  </CardHeader>
  <CardContent>
    <p>Carved into the mountain's heart, Ironhold guards the last working forge-gate.</p>
  </CardContent>
  <CardFooter><Button variant="ghost" size="sm">Read more</Button></CardFooter>
</Card>
```
