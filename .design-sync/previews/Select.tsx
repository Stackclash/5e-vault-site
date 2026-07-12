import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  Label,
} from '5e-vault-site'
import { Frame } from './_frame'

export function ClassSelect() {
  return (
    <Frame>
      <div className="grid w-64 gap-2">
        <Label>Character Class</Label>
        <Select defaultValue="warlock">
          <SelectTrigger>
            <SelectValue placeholder="Choose a class" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Martial</SelectLabel>
              <SelectItem value="fighter">Fighter</SelectItem>
              <SelectItem value="rogue">Rogue</SelectItem>
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>Caster</SelectLabel>
              <SelectItem value="warlock">Warlock</SelectItem>
              <SelectItem value="cleric">Cleric</SelectItem>
              <SelectItem value="druid">Druid</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </Frame>
  )
}
