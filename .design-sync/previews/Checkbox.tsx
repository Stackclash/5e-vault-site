import { Checkbox, Label } from '5e-vault-site'
import { Frame } from './_frame'

export function States() {
  return (
    <Frame>
      <div className="grid gap-4">
        <div className="flex items-center gap-3">
          <Checkbox id="q1" defaultChecked />
          <Label htmlFor="q1">Recovered the First Fragment</Label>
        </div>
        <div className="flex items-center gap-3">
          <Checkbox id="q2" defaultChecked />
          <Label htmlFor="q2">Recovered the Second Fragment</Label>
        </div>
        <div className="flex items-center gap-3">
          <Checkbox id="q3" />
          <Label htmlFor="q3">Recover the Third Fragment</Label>
        </div>
        <div className="flex items-center gap-3">
          <Checkbox id="q4" disabled />
          <Label htmlFor="q4" className="text-muted-foreground">
            Confront the Dread Sovereign (locked)
          </Label>
        </div>
      </div>
    </Frame>
  )
}
