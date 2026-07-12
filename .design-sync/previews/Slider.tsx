import { Slider, Label } from '5e-vault-site'
import { Frame } from './_frame'

export function Single() {
  return (
    <Frame>
      <div className="grid w-72 gap-3">
        <Label>Encounter Difficulty</Label>
        <Slider defaultValue={[60]} max={100} step={1} />
      </div>
    </Frame>
  )
}

export function Range() {
  return (
    <Frame>
      <div className="grid w-72 gap-3">
        <Label>Party Level Range</Label>
        <Slider defaultValue={[5, 12]} max={20} step={1} />
      </div>
    </Frame>
  )
}
