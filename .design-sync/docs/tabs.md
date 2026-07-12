---
category: Display
---

Tabbed views. Compose: TabsList > TabsTrigger (value) + TabsContent (value).

Parts: `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`

```tsx
<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="npcs">NPCs</TabsTrigger>
    <TabsTrigger value="loot">Loot</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">The Shattered Realm campaign overview.</TabsContent>
  <TabsContent value="npcs">Known characters and factions.</TabsContent>
  <TabsContent value="loot">Party treasure and attunements.</TabsContent>
</Tabs>
```
