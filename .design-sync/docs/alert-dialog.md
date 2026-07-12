---
category: Overlays
---

Confirmation dialog that interrupts the user. Compose: AlertDialogTrigger + AlertDialogContent > AlertDialogHeader (Title/Description) + AlertDialogFooter (AlertDialogCancel + AlertDialogAction).

Parts: `AlertDialog`, `AlertDialogPortal`, `AlertDialogOverlay`, `AlertDialogTrigger`, `AlertDialogContent`, `AlertDialogHeader`, `AlertDialogFooter`, `AlertDialogTitle`, `AlertDialogDescription`, `AlertDialogAction`, `AlertDialogCancel`

```tsx
<AlertDialog>
  <AlertDialogTrigger asChild><Button variant="destructive">Delete quest</Button></AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Delete this quest?</AlertDialogTitle>
      <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Delete</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```
