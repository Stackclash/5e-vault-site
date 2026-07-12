import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  Button,
} from '5e-vault-site'

export function RestDialog() {
  return (
    <Dialog defaultOpen>
      <DialogTrigger asChild>
        <Button variant="outline">Take a Long Rest</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Take a Long Rest?</DialogTitle>
          <DialogDescription>
            The party will recover all hit points and expended spell slots.
            Eight hours pass — the DM may trigger a random encounter.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button>Confirm Rest</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
