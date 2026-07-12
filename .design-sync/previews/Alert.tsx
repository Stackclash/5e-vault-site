import { Alert, AlertTitle, AlertDescription } from '5e-vault-site'
import { ScrollText, TriangleAlert } from 'lucide-react'
import { Frame } from './_frame'

export function Default() {
  return (
    <Frame>
      <Alert className="max-w-lg">
        <ScrollText />
        <AlertTitle>Quest Updated</AlertTitle>
        <AlertDescription>
          The party has secured passage through the Undermines. A new objective is
          available in your journal.
        </AlertDescription>
      </Alert>
    </Frame>
  )
}

export function Destructive() {
  return (
    <Frame>
      <Alert variant="destructive" className="max-w-lg">
        <TriangleAlert />
        <AlertTitle>Ambush!</AlertTitle>
        <AlertDescription>
          Shadow Covenant scouts have discovered your position. Roll for initiative.
        </AlertDescription>
      </Alert>
    </Frame>
  )
}
