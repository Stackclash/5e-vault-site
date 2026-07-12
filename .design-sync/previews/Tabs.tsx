import { Tabs, TabsList, TabsTrigger, TabsContent } from '5e-vault-site'
import { Frame } from './_frame'

export function CampaignTabs() {
  return (
    <Frame>
      <Tabs defaultValue="story" className="w-[28rem]">
        <TabsList>
          <TabsTrigger value="story">Story</TabsTrigger>
          <TabsTrigger value="party">Party</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
        </TabsList>
        <TabsContent value="story" className="text-muted-foreground text-sm leading-relaxed">
          With two phylactery fragments recovered, the party marches on Ironhold to
          break the corrupted dwarven king&apos;s enchantment.
        </TabsContent>
        <TabsContent value="party" className="text-muted-foreground text-sm leading-relaxed">
          Five heroes bound by prophecy: a warlock, a fighter, a cleric, a rogue,
          and a druid.
        </TabsContent>
        <TabsContent value="locations" className="text-muted-foreground text-sm leading-relaxed">
          The Eldergrove, the Sunken Citadel, and the fortress of Ironhold have all
          been charted.
        </TabsContent>
      </Tabs>
    </Frame>
  )
}
