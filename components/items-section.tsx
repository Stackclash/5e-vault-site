import { Gem } from "lucide-react";

const items = [
  {
    name: "Sunblade",
    type: "Legendary Weapon",
    rarity: "Legendary",
    image: "/images/item-sunblade.jpg",
    description:
      "A longsword whose blade is forged from pure radiant energy. When unsheathed, it emits bright sunlight in a 15-foot radius. Deals an additional 2d6 radiant damage to undead and creatures of shadow.",
    attunement: "Requires attunement by a creature of good alignment",
    holder: "Kael (Paladin)",
    properties: ["+2 to attack and damage rolls", "Finesse", "2d6 bonus radiant vs undead/shadow", "Emits sunlight (15 ft bright, 15 ft dim)"],
  },
  {
    name: "Amulet of the Dread Sovereign",
    type: "Wondrous Item (Cursed)",
    rarity: "Very Rare",
    image: "/images/item-amulet.jpg",
    description:
      "A fragment of the Dread Sovereign's phylactery, bound in a tarnished silver amulet. It pulses with dark energy and whispers to those nearby. Two of five fragments have been collected. The amulet grows heavier with each fragment added.",
    attunement: "Cannot be attuned. Must be cleansed by the Ritual of Unbinding.",
    holder: "Party Inventory (Warded Box)",
    properties: ["Contains 2 of 5 phylactery fragments", "Detects other fragments within 1 mile", "Whispers dark secrets (WIS save DC 14 or gain 1 level of madness)", "Grows in power as fragments are combined"],
  },
  {
    name: "Cloak of Elvenkind",
    type: "Wondrous Item",
    rarity: "Uncommon",
    image: "/images/item-cloak.jpg",
    description:
      "A shimmering cloak woven by the dryads of the Eldergrove. The wearer can pull up the hood to become nearly invisible, blending seamlessly with their surroundings. The fabric seems to shift colors with the environment.",
    attunement: "Requires attunement",
    holder: "Vex (Rogue)",
    properties: ["Advantage on Stealth checks", "Disadvantage on Perception checks to spot the wearer", "Hood grants near-invisibility in natural environments"],
  },
];

function RarityBadge({ rarity }: { rarity: string }) {
  const colors: Record<string, string> = {
    Legendary: "bg-primary/20 text-primary border-primary/30",
    "Very Rare": "bg-accent/20 text-accent border-accent/30",
    Rare: "bg-chart-3/20 text-chart-3 border-chart-3/30",
    Uncommon: "bg-chart-4/20 text-chart-4 border-chart-4/30",
  };

  return (
    <span
      className={`inline-flex rounded-sm border px-2 py-0.5 font-serif text-xs tracking-wider uppercase ${colors[rarity] ?? "bg-muted text-muted-foreground border-border"}`}
    >
      {rarity}
    </span>
  );
}

export function ItemsSection() {
  return (
    <section id="items" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="mb-16 text-center">
          <p className="mb-3 font-serif text-sm tracking-[0.3em] uppercase text-primary">
            Party Inventory
          </p>
          <h2 className="mb-4 font-serif text-3xl font-bold tracking-wide text-foreground md:text-5xl">
            Notable Items
          </h2>
          <div className="mx-auto mt-4 flex items-center justify-center gap-3">
            <div className="h-px w-12 bg-primary/40" />
            <Gem className="h-4 w-4 text-primary" />
            <div className="h-px w-12 bg-primary/40" />
          </div>
        </div>

        {/* Items grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.name}
              className="group flex flex-col overflow-hidden rounded-lg border border-border/50 bg-card transition-colors hover:border-primary/30"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={item.image}
                  alt={`Illustration of ${item.name}`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <RarityBadge rarity={item.rarity} />
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-6">
                <p className="mb-1 text-xs tracking-wider uppercase text-muted-foreground">
                  {item.type}
                </p>
                <h3 className="mb-2 font-serif text-xl font-bold tracking-wide text-foreground">
                  {item.name}
                </h3>
                <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>

                {/* Properties */}
                <div className="mb-4">
                  <h4 className="mb-2 font-serif text-xs font-semibold tracking-wider uppercase text-accent">
                    Properties
                  </h4>
                  <ul className="flex flex-col gap-1.5">
                    {item.properties.map((prop) => (
                      <li
                        key={prop}
                        className="flex items-start gap-2 text-xs text-muted-foreground"
                      >
                        <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-primary" />
                        {prop}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Footer */}
                <div className="flex flex-col gap-1 border-t border-border/50 pt-4 text-xs text-muted-foreground">
                  <span>
                    <span className="font-serif font-semibold text-foreground">Held by:</span>{" "}
                    {item.holder}
                  </span>
                  <span className="italic">{item.attunement}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
