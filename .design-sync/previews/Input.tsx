import { Input, Label } from '5e-vault-site'
import { Frame } from './_frame'

export function WithLabel() {
  return (
    <Frame>
      <div className="grid w-72 gap-2">
        <Label htmlFor="char-name">Character Name</Label>
        <Input id="char-name" placeholder="e.g. Kaelen Duskbane" />
      </div>
    </Frame>
  )
}

export function Types() {
  return (
    <Frame>
      <div className="grid w-72 gap-3">
        <Input type="search" placeholder="Search the bestiary…" />
        <Input type="number" defaultValue={20} />
        <Input type="password" defaultValue="secret" />
      </div>
    </Frame>
  )
}

export function Disabled() {
  return (
    <Frame>
      <div className="grid w-72 gap-2">
        <Label htmlFor="locked-field">Sealed Entry</Label>
        <Input id="locked-field" disabled placeholder="Requires DM approval" />
      </div>
    </Frame>
  )
}
