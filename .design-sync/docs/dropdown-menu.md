---
category: Overlays
---

Menu opened from a trigger button. Compose: DropdownMenuTrigger + DropdownMenuContent > DropdownMenuLabel / Item / CheckboxItem / RadioGroup+RadioItem / Separator / Shortcut / Sub menus. DropdownMenuItem takes variant="default" | "destructive" and inset.

Parts: `DropdownMenu`, `DropdownMenuPortal`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuGroup`, `DropdownMenuLabel`, `DropdownMenuItem`, `DropdownMenuCheckboxItem`, `DropdownMenuRadioGroup`, `DropdownMenuRadioItem`, `DropdownMenuSeparator`, `DropdownMenuShortcut`, `DropdownMenuSub`, `DropdownMenuSubTrigger`, `DropdownMenuSubContent`

```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild><Button variant="outline">Actions</Button></DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>Session</DropdownMenuLabel>
    <DropdownMenuItem>Edit notes</DropdownMenuItem>
    <DropdownMenuItem>Share recap</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```
