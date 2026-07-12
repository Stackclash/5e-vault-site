import { SectionHeader } from '5e-vault-site'
import { MapPin } from 'lucide-react'
import { Frame } from './_frame'

export function Default() {
  return (
    <Frame className="!p-16">
      <div className="w-full max-w-2xl">
        <SectionHeader
          subtitle="Explore the Realm"
          title="Locations of Vaeltharis"
          icon={MapPin}
        />
      </div>
    </Frame>
  )
}
