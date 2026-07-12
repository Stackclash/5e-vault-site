---
category: Overlays
---

Transient notification. Compose inside ToastProvider with a ToastViewport; Toast > ToastTitle + ToastDescription + optional ToastAction / ToastClose. (The site drives these through its use-toast hook.)

Parts: `ToastProvider`, `ToastViewport`, `Toast`, `ToastTitle`, `ToastDescription`, `ToastClose`, `ToastAction`

```tsx
<ToastProvider>
  <Toast open>
    <div className="grid gap-1">
      <ToastTitle>Initiative rolled</ToastTitle>
      <ToastDescription>Combat order updated.</ToastDescription>
    </div>
    <ToastClose />
  </Toast>
  <ToastViewport />
</ToastProvider>
```
