---
category: Display
---

Vertically stacked expandable sections. Compose: AccordionItem (value) > AccordionTrigger + AccordionContent.

Parts: `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`

```tsx
<Accordion type="single" collapsible defaultValue="lore">
  <AccordionItem value="lore">
    <AccordionTrigger>The Sundering</AccordionTrigger>
    <AccordionContent>Three centuries ago the realm shattered into floating shards...</AccordionContent>
  </AccordionItem>
  <AccordionItem value="factions">
    <AccordionTrigger>Factions</AccordionTrigger>
    <AccordionContent>The Ashen Covenant and the Circle of Dawn contest the shards.</AccordionContent>
  </AccordionItem>
</Accordion>
```
