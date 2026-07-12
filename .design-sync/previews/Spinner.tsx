import { Spinner } from '5e-vault-site'
import { Frame } from './_frame'

export function Sizes() {
  return (
    <Frame>
      <div className="text-primary flex items-center gap-6">
        <Spinner className="size-4" />
        <Spinner className="size-6" />
        <Spinner className="size-8" />
      </div>
    </Frame>
  )
}

export function WithLabel() {
  return (
    <Frame>
      <div className="text-muted-foreground flex items-center gap-3 text-sm">
        <Spinner className="text-primary size-5" />
        Rolling for the party…
      </div>
    </Frame>
  )
}
