---
category: Overlays
---

Right-click menu. Compose: ContextMenuTrigger (the right-clickable area) + ContextMenuContent > ContextMenuItem / CheckboxItem / RadioItem / Sub menus / Separator / Shortcut.

Parts: `ContextMenu`, `ContextMenuTrigger`, `ContextMenuContent`, `ContextMenuItem`, `ContextMenuCheckboxItem`, `ContextMenuRadioItem`, `ContextMenuLabel`, `ContextMenuSeparator`, `ContextMenuShortcut`, `ContextMenuGroup`, `ContextMenuPortal`, `ContextMenuSub`, `ContextMenuSubContent`, `ContextMenuSubTrigger`, `ContextMenuRadioGroup`

```tsx
<ContextMenu>
  <ContextMenuTrigger className="flex h-24 items-center justify-center rounded-md border border-dashed">Right-click the map</ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem>Add pin</ContextMenuItem>
    <ContextMenuItem>Measure distance</ContextMenuItem>
    <ContextMenuSeparator />
    <ContextMenuItem variant="destructive">Clear markers</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>
```
