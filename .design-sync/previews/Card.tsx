import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
  Button,
  Badge,
} from '5e-vault-site'
import { Frame } from './_frame'

export function CharacterCard() {
  return (
    <Frame>
      <Card className="w-80">
        <CardHeader>
          <CardTitle>Kaelen Duskbane</CardTitle>
          <CardDescription>Half-Elf Warlock · Level 7</CardDescription>
          <CardAction>
            <Badge variant="secondary">Pact of the Blade</Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground text-xs uppercase tracking-wide">HP</p>
            <p className="font-serif text-lg">54</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs uppercase tracking-wide">AC</p>
            <p className="font-serif text-lg">15</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs uppercase tracking-wide">Speed</p>
            <p className="font-serif text-lg">30ft</p>
          </div>
        </CardContent>
        <CardFooter className="gap-2">
          <Button size="sm">View Sheet</Button>
          <Button size="sm" variant="outline">
            Inventory
          </Button>
        </CardFooter>
      </Card>
    </Frame>
  )
}

export function QuestCard() {
  return (
    <Frame>
      <Card className="w-80">
        <CardHeader>
          <CardTitle>The Siege of Ironhold</CardTitle>
          <CardDescription>Current Arc · Session 25</CardDescription>
        </CardHeader>
        <CardContent className="text-muted-foreground text-sm leading-relaxed">
          Break the dwarven king&apos;s enchantment and secure the third phylactery
          fragment before the Shadow Covenant arrives at the gates.
        </CardContent>
        <CardFooter>
          <Badge variant="destructive">Urgent</Badge>
        </CardFooter>
      </Card>
    </Frame>
  )
}
