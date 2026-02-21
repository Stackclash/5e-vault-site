import { BookOpen } from "lucide-react";

const loreEntries = [
  {
    title: "The Dread Sovereign",
    category: "Ancient History",
    content:
      "A thousand years ago, the lich known as the Dread Sovereign brought the continent of Vaeltharis to its knees. His armies of undead swept across every kingdom until a coalition of heroes shattered his phylactery into five fragments, each sealed in a hidden location guarded by powerful wards. The Sovereign's body was destroyed, but prophecy warns that if the fragments are ever reunited by dark hands, he shall rise again, more terrible than before.",
  },
  {
    title: "The Shadow Covenant",
    category: "Factions",
    content:
      "A secretive cult dedicated to resurrecting the Dread Sovereign. Their agents operate in the shadows, infiltrating governments and institutions across Vaeltharis. Led by a mysterious figure known only as the Pale Hand, the Covenant seeks to gather all five phylactery fragments. Their ranks include dark wizards, corrupted nobles, and hired mercenaries. The party has clashed with their agents on multiple occasions.",
  },
  {
    title: "The Silver Council",
    category: "Factions",
    content:
      "A council of mages, scholars, and leaders formed in the aftermath of the Dread Sovereign's original defeat. They have safeguarded the knowledge of the phylactery's locations for generations. Based in Mistport's Silver Tower, the Council provides resources and guidance to the party. However, recent events suggest a traitor lurks among their members.",
  },
  {
    title: "The Ritual of Unbinding",
    category: "Magic & Religion",
    content:
      "An ancient divine ritual that can cleanse a phylactery fragment of its dark energy, rendering it inert and preventing it from being used to resurrect the Dread Sovereign. The ritual requires a consecrated altar, a cleric of sufficient power, and specific rare components. Seraphina Dawnlight is one of the few living clerics capable of performing it. Each fragment must be cleansed individually.",
  },
  {
    title: "The Five Seals",
    category: "Ancient History",
    content:
      "When the heroes of old shattered the phylactery, each fragment was placed within a Seal: a magical prison designed to contain the dark energy. The first seal was in the Eldergrove, now broken. The second was in the Sunken Vault, also broken. The third lies within Ironhold. The locations of the fourth and fifth remain unknown, though Theron believes the ancient library of Vos Kethara may hold the answers.",
  },
  {
    title: "The Cursed Crown of Ironhold",
    category: "Artifacts",
    content:
      "An ancient dwarven artifact that was corrupted by Shadow Covenant agents. When placed on King Duran III's head, it enslaved his mind to the Covenant's will. The crown amplifies the wearer's authority, making all who hear his voice compelled to obey. Breaking the enchantment will likely require either destroying the crown or performing a focused Dispel Magic at the moment of the king's vulnerability.",
  },
];

export function LoreSection() {
  return (
    <section id="lore" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="mb-16 text-center">
          <p className="mb-3 font-serif text-sm tracking-[0.3em] uppercase text-primary">
            World Knowledge
          </p>
          <h2 className="mb-4 font-serif text-3xl font-bold tracking-wide text-foreground md:text-5xl">
            Lore & History
          </h2>
          <div className="mx-auto mt-4 flex items-center justify-center gap-3">
            <div className="h-px w-12 bg-primary/40" />
            <BookOpen className="h-4 w-4 text-primary" />
            <div className="h-px w-12 bg-primary/40" />
          </div>
        </div>

        {/* Lore entries */}
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          {loreEntries.map((entry) => (
            <div
              key={entry.title}
              className="rounded-lg border border-border/50 bg-card p-8 transition-colors hover:border-primary/30"
            >
              <span className="mb-3 inline-flex rounded-sm border border-primary/30 bg-primary/10 px-2 py-0.5 font-serif text-xs tracking-wider uppercase text-primary">
                {entry.category}
              </span>
              <h3 className="mb-3 font-serif text-lg font-bold tracking-wide text-foreground">
                {entry.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {entry.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
