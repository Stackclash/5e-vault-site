import { Button } from '5e-vault-site'
import { Swords, Scroll, Trash2, Dices } from 'lucide-react'
import { Frame } from './_frame'

export function Variants() {
  return (
    <Frame>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button variant="default">Roll Initiative</Button>
        <Button variant="secondary">View Character</Button>
        <Button variant="outline">Open Map</Button>
        <Button variant="ghost">Notes</Button>
        <Button variant="hover">Cast Spell</Button>
        <Button variant="destructive">End Campaign</Button>
        <Button variant="link">Session Log</Button>
      </div>
    </Frame>
  )
}

export function Sizes() {
  return (
    <Frame>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button size="sm">Short Rest</Button>
        <Button size="default">Long Rest</Button>
        <Button size="lg">Begin Session</Button>
      </div>
    </Frame>
  )
}

export function WithIcons() {
  return (
    <Frame>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button>
          <Dices /> Roll d20
        </Button>
        <Button variant="outline">
          <Scroll /> Read Lore
        </Button>
        <Button variant="hover">
          <Swords /> Attack
        </Button>
        <Button variant="outline" size="icon" aria-label="Delete">
          <Trash2 />
        </Button>
      </div>
    </Frame>
  )
}

export function Disabled() {
  return (
    <Frame>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button disabled>Cast (No Slots)</Button>
        <Button variant="outline" disabled>
          Locked
        </Button>
      </div>
    </Frame>
  )
}
