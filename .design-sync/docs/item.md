---
category: Display
---

List row. Compose: ItemMedia (variant="icon" | "image") + ItemContent (ItemTitle + ItemDescription) + ItemActions; group rows with ItemGroup + ItemSeparator.

Parts: `Item`, `ItemMedia`, `ItemContent`, `ItemActions`, `ItemGroup`, `ItemSeparator`, `ItemTitle`, `ItemDescription`, `ItemHeader`, `ItemFooter`

```tsx
<ItemGroup>
  <Item variant="outline">
    <ItemMedia variant="icon"><Swords className="size-4" /></ItemMedia>
    <ItemContent>
      <ItemTitle>Sunblade</ItemTitle>
      <ItemDescription>Legendary longsword, radiant damage</ItemDescription>
    </ItemContent>
    <ItemActions><Badge variant="secondary">Attuned</Badge></ItemActions>
  </Item>
</ItemGroup>
```
