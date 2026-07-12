---
category: Overlays
---

Horizontal application menu bar. Compose: MenubarMenu > MenubarTrigger + MenubarContent > MenubarItem / CheckboxItem / RadioGroup / Sub / Separator / Shortcut.

Parts: `Menubar`, `MenubarPortal`, `MenubarMenu`, `MenubarTrigger`, `MenubarContent`, `MenubarGroup`, `MenubarSeparator`, `MenubarLabel`, `MenubarItem`, `MenubarShortcut`, `MenubarCheckboxItem`, `MenubarRadioGroup`, `MenubarRadioItem`, `MenubarSub`, `MenubarSubTrigger`, `MenubarSubContent`

```tsx
<Menubar>
  <MenubarMenu>
    <MenubarTrigger>Campaign</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>New session <MenubarShortcut>⌘N</MenubarShortcut></MenubarItem>
      <MenubarItem>Export vault</MenubarItem>
    </MenubarContent>
  </MenubarMenu>
  <MenubarMenu>
    <MenubarTrigger>View</MenubarTrigger>
    <MenubarContent><MenubarItem>Toggle map</MenubarItem></MenubarContent>
  </MenubarMenu>
</Menubar>
```
