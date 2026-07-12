import { HeroSection } from '5e-vault-site'

export function Default() {
  return (
    <div className="bg-background text-foreground">
      <HeroSection
        title="The Shattered Phylactery"
        counts={{ sessions: 24, players: 5, locations: 18, npcs: 42, quests: 9 }}
      />
    </div>
  )
}
