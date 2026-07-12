---
category: Overlays
---

Card shown on hover over a trigger (e.g. an NPC name). Compose: HoverCardTrigger + HoverCardContent.

Parts: `HoverCard`, `HoverCardTrigger`, `HoverCardContent`

```tsx
<HoverCard>
  <HoverCardTrigger asChild><Button variant="link">@Elaria</Button></HoverCardTrigger>
  <HoverCardContent>Half-elf ranger of the Eldergrove. Ally of the party since session 3.</HoverCardContent>
</HoverCard>
```
