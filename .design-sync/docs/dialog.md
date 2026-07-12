---
category: Overlays
---

Modal dialog. Compose: DialogTrigger + DialogContent > DialogHeader (DialogTitle + DialogDescription) + body + DialogFooter (DialogClose).

Parts: `Dialog`, `DialogClose`, `DialogContent`, `DialogDescription`, `DialogFooter`, `DialogHeader`, `DialogOverlay`, `DialogPortal`, `DialogTitle`, `DialogTrigger`

```tsx
<Dialog>
  <DialogTrigger asChild><Button variant="outline">Add NPC</Button></DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>New NPC</DialogTitle>
      <DialogDescription>Add a character to the campaign roster.</DialogDescription>
    </DialogHeader>
    <Input placeholder="Name" />
    <DialogFooter><Button>Save</Button></DialogFooter>
  </DialogContent>
</Dialog>
```
