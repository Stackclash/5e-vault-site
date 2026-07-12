import { Badge } from '5e-vault-site'
import { Sparkles, Skull, ShieldCheck } from 'lucide-react'
import { Frame } from './_frame'

export function Variants() {
  return (
    <Frame>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Badge variant="default">Attuned</Badge>
        <Badge variant="secondary">Common</Badge>
        <Badge variant="destructive">Cursed</Badge>
        <Badge variant="outline">Unidentified</Badge>
      </div>
    </Frame>
  )
}

export function WithIcons() {
  return (
    <Frame>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Badge variant="default">
          <Sparkles /> Legendary
        </Badge>
        <Badge variant="destructive">
          <Skull /> Poisoned
        </Badge>
        <Badge variant="secondary">
          <ShieldCheck /> Warded
        </Badge>
      </div>
    </Frame>
  )
}
