import { Avatar, AvatarImage, AvatarFallback } from '5e-vault-site'
import { Frame } from './_frame'

export function WithFallback() {
  return (
    <Frame>
      <Avatar className="size-12">
        <AvatarImage src="/images/kaelen.jpg" alt="Kaelen Duskbane" />
        <AvatarFallback>KD</AvatarFallback>
      </Avatar>
    </Frame>
  )
}

export function PartyGroup() {
  const members = ['KD', 'BI', 'SO', 'VN', 'TW']
  return (
    <Frame>
      <div className="flex -space-x-2">
        {members.map((m) => (
          <Avatar key={m} className="ring-background size-10 ring-2">
            <AvatarFallback>{m}</AvatarFallback>
          </Avatar>
        ))}
      </div>
    </Frame>
  )
}
