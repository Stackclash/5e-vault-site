// ─── Types ────────────────────────────────────────────────────────

export interface Location {
  slug: string;
  name: string;
  type: string;
  image: string;
  description: string;
  status: string;
  threats: string;
  connectedNpcs: string[]; // NPC slugs
  connectedSessions: number[]; // session numbers
}

export interface Npc {
  slug: string;
  name: string;
  title: string;
  race: string;
  image: string;
  alignment: string;
  location: string;
  locationSlug: string;
  disposition: string;
  description: string;
  knownInfo: string;
  connectedSessions: number[];
  connectedItems: string[]; // item slugs
}

export interface Session {
  slug: string;
  number: number;
  title: string;
  date: string;
  highlight: string;
  summary: string;
  keyEvents: string[];
  lootFound: string[];
  connectedLocations: string[];
  connectedNpcs: string[];
}

export interface Item {
  slug: string;
  name: string;
  type: string;
  rarity: string;
  image: string;
  description: string;
  attunement: string;
  holder: string;
  properties: string[];
  foundInSession: number | null;
}

export interface LoreEntry {
  slug: string;
  title: string;
  category: string;
  content: string;
  relatedEntries: string[]; // other lore slugs
}

// ─── Data ─────────────────────────────────────────────────────────

export const locations: Location[] = [
  {
    slug: "eldergrove",
    name: "The Eldergrove",
    type: "Enchanted Forest",
    image: "/images/location-eldergrove.jpg",
    description:
      "An ancient woodland where the trees whisper secrets of ages past. Home to druids and fey creatures, the Eldergrove holds the first seal of the Dread Sovereign's prison. The canopy glows with bioluminescent moss at night, and the deeper paths shift and rearrange to confuse unwary travelers. The druids who tend the grove have grown wary of outsiders since the corruption began seeping through the roots.",
    status: "Explored",
    threats: "Corrupted treants, shadow sprites",
    connectedNpcs: ["seraphina-dawnlight"],
    connectedSessions: [21, 22],
  },
  {
    slug: "ironhold-fortress",
    name: "Ironhold Fortress",
    type: "Dwarven Stronghold",
    image: "/images/location-ironhold.jpg",
    description:
      "A massive fortress carved into the heart of Mount Anvil. Once the jewel of dwarven civilization, Ironhold has fallen under a dark enchantment. King Duran III rules from a cursed throne, and the forges burn with unnatural flame. The halls that once rang with the sound of hammers and song now echo only with the clank of enchanted guards patrolling endless corridors.",
    status: "Current Objective",
    threats: "Corrupted dwarven guard, shadow constructs, the cursed king",
    connectedNpcs: ["grimjaw-ironhand"],
    connectedSessions: [23, 24],
  },
  {
    slug: "mistport",
    name: "Mistport",
    type: "Coastal Town",
    image: "/images/location-mistport.jpg",
    description:
      "A fog-shrouded harbor town where smugglers and merchants trade in equal measure. The party's base of operations, with contacts in the Dockside Tavern. Rumored to house a secret entrance to the Underdark beneath its warehouses. The Silver Tower rises above the mist, home to the Silver Council and their vast library of arcane knowledge.",
    status: "Safe Haven",
    threats: "Thieves' guild, occasional sea monsters",
    connectedNpcs: ["theron-ashvale", "lyra-shadowmend"],
    connectedSessions: [20],
  },
];

export const npcs: Npc[] = [
  {
    slug: "theron-ashvale",
    name: "Theron Ashvale",
    title: "Archmage of the Silver Council",
    race: "Human",
    image: "/images/npc-theron.jpg",
    alignment: "Lawful Good",
    location: "Mistport (Silver Tower)",
    locationSlug: "mistport",
    disposition: "Friendly",
    description:
      "An elderly wizard of immense power and knowledge. Theron serves as the party's primary quest giver and has been researching the Dread Sovereign's phylactery for decades. He speaks in riddles but always has the party's best interests at heart. His robes bear the silver embroidery of the Council's highest rank, though they have grown threadbare over the years of constant study.",
    knownInfo:
      "Holds the map to the phylactery fragments. Lost his apprentice to the Shadow Covenant ten years ago. His magic is weakening as the seals break. Rumored to have once been an adventurer himself in his youth.",
    connectedSessions: [20, 21],
    connectedItems: [],
  },
  {
    slug: "lyra-shadowmend",
    name: "Lyra Shadowmend",
    title: "Information Broker",
    race: "Half-Elf",
    image: "/images/npc-lyra.jpg",
    alignment: "Chaotic Neutral",
    disposition: "Neutral",
    location: "Mistport (Dockside Tavern)",
    locationSlug: "mistport",
    description:
      "A cunning rogue who deals in secrets and stolen goods. Lyra has connections throughout the underworld and can procure nearly anything for the right price. Her true motivations remain unknown, but she has proven useful. She wears a sly smirk like armor and always seems to know more than she lets on.",
    knownInfo:
      "Former member of the Thieves' Guild. Knows the secret passages beneath Mistport. May have ties to the Shadow Covenant, though she denies it. She once saved the party from an ambush, but never explained how she knew about it.",
    connectedSessions: [20],
    connectedItems: [],
  },
  {
    slug: "grimjaw-ironhand",
    name: "Grimjaw Ironhand",
    title: "Master Smith of Ironhold",
    race: "Half-Orc",
    image: "/images/npc-grimjaw.jpg",
    alignment: "Neutral Good",
    disposition: "Friendly",
    location: "Ironhold (The Great Forge)",
    locationSlug: "ironhold-fortress",
    description:
      "A half-orc blacksmith of legendary skill who fled Ironhold when the corruption took hold. Now works from a makeshift forge near the mountain pass, crafting weapons for the resistance. Deeply loyal to the true king. His hands bear the scars of decades at the forge, and his voice carries the weight of a homeland lost.",
    knownInfo:
      "Knows the layout of Ironhold's inner chambers. Can forge weapons capable of harming shadow creatures. His brother Tormund remains inside, trapped under the king's enchantment. He crafted silvered weapons for the party.",
    connectedSessions: [23, 24],
    connectedItems: ["sunblade"],
  },
  {
    slug: "seraphina-dawnlight",
    name: "Seraphina Dawnlight",
    title: "High Priestess of Solaris",
    race: "Tiefling",
    image: "/images/npc-seraphina.jpg",
    alignment: "Lawful Good",
    disposition: "Friendly",
    location: "Temple of Dawn (Eldergrove)",
    locationSlug: "eldergrove",
    description:
      "A devoted cleric whose radiant faith stands in stark contrast to her infernal heritage. Seraphina tends to the Temple of Dawn, one of the last bastions of holy power against the encroaching darkness. She can heal wounds both physical and spiritual. Her golden eyes seem to glow faintly when she channels divine energy.",
    knownInfo:
      "Can perform the Ritual of Unbinding to cleanse corrupted phylactery fragments. The stolen relic the party seeks belongs to her temple. She senses a traitor among the Silver Council. She performed a partial cleansing on the second fragment.",
    connectedSessions: [22],
    connectedItems: ["amulet-of-the-dread-sovereign"],
  },
];

export const sessions: Session[] = [
  {
    slug: "session-24",
    number: 24,
    title: "Whispers in the Undermines",
    date: "February 15, 2026",
    highlight: "Key Discovery",
    summary:
      "The party descended into the Undermines beneath Mount Anvil, following Grimjaw's hand-drawn map. After navigating flooded tunnels and a collapsed mining shaft, they discovered a secret passage leading directly to Ironhold's undercroft. A tense encounter with a shadow patrol nearly ended in disaster, but Vex's quick thinking and a well-placed Silence spell saved the group.",
    keyEvents: [
      "Discovered the Undermines passage to Ironhold",
      "Encountered and evaded a shadow patrol of 6 corrupted dwarves",
      "Found ancient dwarven runes that may weaken the king's enchantment",
      "Kael attuned to the Sunblade found in Session 22",
    ],
    lootFound: ["Scroll of Dispel Magic", "3 potions of Shadow Resistance"],
    connectedLocations: ["ironhold-fortress"],
    connectedNpcs: ["grimjaw-ironhand"],
  },
  {
    slug: "session-23",
    number: 23,
    title: "The Smith's Bargain",
    date: "February 8, 2026",
    highlight: "New Ally",
    summary:
      "The party tracked down Grimjaw Ironhand at his exile forge near the mountain pass. After proving their intentions by defeating a band of shadow raiders attacking his forge, Grimjaw agreed to help them infiltrate Ironhold. He revealed that King Duran is being controlled through a cursed crown, and that his brother Tormund is among the enchanted guard.",
    keyEvents: [
      "Recruited Grimjaw Ironhand as an ally",
      "Defeated 8 shadow raiders in a pitched battle at the forge",
      "Learned about the Cursed Crown controlling King Duran",
      "Grimjaw forged silvered weapons for the party",
    ],
    lootFound: [
      "Silvered Longsword",
      "Silvered Arrows (20)",
      "Grimjaw's Map of Ironhold",
    ],
    connectedLocations: ["ironhold-fortress"],
    connectedNpcs: ["grimjaw-ironhand"],
  },
  {
    slug: "session-22",
    number: 22,
    title: "The Sunken Vault",
    date: "February 1, 2026",
    highlight: "Boss Fight",
    summary:
      "Deep within the ruins beneath the Eldergrove, the party confronted the guardian of the second phylactery fragment: an ancient treant corrupted by shadow magic. The battle was fierce, with Mira nearly falling to the creature's crushing vines. In the aftermath, they recovered the fragment and discovered the legendary Sunblade hidden in the vault.",
    keyEvents: [
      "Defeated the Corrupted Ancient Treant (boss encounter)",
      "Recovered the Second Phylactery Fragment",
      "Found the legendary Sunblade in the Sunken Vault",
      "Seraphina performed a partial cleansing ritual on the fragment",
    ],
    lootFound: [
      "Second Phylactery Fragment",
      "Sunblade",
      "Ring of Forest Walking",
    ],
    connectedLocations: ["eldergrove"],
    connectedNpcs: ["seraphina-dawnlight"],
  },
  {
    slug: "session-21",
    number: 21,
    title: "Roots of Corruption",
    date: "January 25, 2026",
    highlight: "Exploration",
    summary:
      "The party ventured deeper into the Eldergrove following Theron's divination. They discovered that the forest's corruption stemmed from the second phylactery fragment buried in a sunken elven vault. After solving a series of ancient puzzles and befriending a displaced dryad named Willow, they located the vault entrance.",
    keyEvents: [
      "Explored the deep Eldergrove and found signs of corruption",
      "Befriended Willow the Dryad, who guided them to the vault",
      "Solved the Puzzle of the Four Seasons to unlock the vault",
      "Detected a Shadow Covenant spy following the party",
    ],
    lootFound: ["Cloak of Elvenkind", "Dryad's Blessing (temporary buff)"],
    connectedLocations: ["eldergrove"],
    connectedNpcs: ["theron-ashvale"],
  },
  {
    slug: "session-20",
    number: 20,
    title: "Council of Shadows",
    date: "January 18, 2026",
    highlight: "Roleplay Heavy",
    summary:
      "Back in Mistport, the party reported their findings to Theron and the Silver Council. Tensions ran high as council members debated the best course of action. Lyra Shadowmend approached the party privately with intelligence about Shadow Covenant movements. The session ended with a shocking revelation: someone on the Silver Council is feeding information to the enemy.",
    keyEvents: [
      "Reported to the Silver Council in Mistport",
      "Learned of a traitor within the Silver Council",
      "Lyra provided intel on Shadow Covenant's next target: Ironhold",
      "Theron revealed the existence of a third fragment in Ironhold",
    ],
    lootFound: ["1000 gold from the Council", "Sending Stones (pair)"],
    connectedLocations: ["mistport"],
    connectedNpcs: ["theron-ashvale", "lyra-shadowmend"],
  },
];

export const items: Item[] = [
  {
    slug: "sunblade",
    name: "Sunblade",
    type: "Legendary Weapon",
    rarity: "Legendary",
    image: "/images/item-sunblade.jpg",
    description:
      "A longsword whose blade is forged from pure radiant energy. When unsheathed, it emits bright sunlight in a 15-foot radius. Deals an additional 2d6 radiant damage to undead and creatures of shadow. The hilt is warm to the touch, and the blade hums with a faint, comforting resonance.",
    attunement: "Requires attunement by a creature of good alignment",
    holder: "Kael (Paladin)",
    properties: [
      "+2 to attack and damage rolls",
      "Finesse",
      "2d6 bonus radiant vs undead/shadow",
      "Emits sunlight (15 ft bright, 15 ft dim)",
    ],
    foundInSession: 22,
  },
  {
    slug: "amulet-of-the-dread-sovereign",
    name: "Amulet of the Dread Sovereign",
    type: "Wondrous Item (Cursed)",
    rarity: "Very Rare",
    image: "/images/item-amulet.jpg",
    description:
      "A fragment of the Dread Sovereign's phylactery, bound in a tarnished silver amulet. It pulses with dark energy and whispers to those nearby. Two of five fragments have been collected. The amulet grows heavier with each fragment added, and those who hold it too long report nightmares of a crumbling throne.",
    attunement:
      "Cannot be attuned. Must be cleansed by the Ritual of Unbinding.",
    holder: "Party Inventory (Warded Box)",
    properties: [
      "Contains 2 of 5 phylactery fragments",
      "Detects other fragments within 1 mile",
      "Whispers dark secrets (WIS save DC 14 or gain 1 level of madness)",
      "Grows in power as fragments are combined",
    ],
    foundInSession: 22,
  },
  {
    slug: "cloak-of-elvenkind",
    name: "Cloak of Elvenkind",
    type: "Wondrous Item",
    rarity: "Uncommon",
    image: "/images/item-cloak.jpg",
    description:
      "A shimmering cloak woven by the dryads of the Eldergrove. The wearer can pull up the hood to become nearly invisible, blending seamlessly with their surroundings. The fabric seems to shift colors with the environment, from forest green to shadow grey.",
    attunement: "Requires attunement",
    holder: "Vex (Rogue)",
    properties: [
      "Advantage on Stealth checks",
      "Disadvantage on Perception checks to spot the wearer",
      "Hood grants near-invisibility in natural environments",
    ],
    foundInSession: 21,
  },
];

export const loreEntries: LoreEntry[] = [
  {
    slug: "the-dread-sovereign",
    title: "The Dread Sovereign",
    category: "Ancient History",
    content:
      "A thousand years ago, the lich known as the Dread Sovereign brought the continent of Vaeltharis to its knees. His armies of undead swept across every kingdom until a coalition of heroes shattered his phylactery into five fragments, each sealed in a hidden location guarded by powerful wards. The Sovereign's body was destroyed, but prophecy warns that if the fragments are ever reunited by dark hands, he shall rise again, more terrible than before. Ancient texts describe him as a once-noble king who turned to necromancy after the death of his beloved, seeking to conquer death itself.",
    relatedEntries: ["the-five-seals", "the-shadow-covenant"],
  },
  {
    slug: "the-shadow-covenant",
    title: "The Shadow Covenant",
    category: "Factions",
    content:
      "A secretive cult dedicated to resurrecting the Dread Sovereign. Their agents operate in the shadows, infiltrating governments and institutions across Vaeltharis. Led by a mysterious figure known only as the Pale Hand, the Covenant seeks to gather all five phylactery fragments. Their ranks include dark wizards, corrupted nobles, and hired mercenaries. The party has clashed with their agents on multiple occasions. Their symbol is a skeletal hand clutching a cracked gemstone.",
    relatedEntries: ["the-dread-sovereign", "the-silver-council"],
  },
  {
    slug: "the-silver-council",
    title: "The Silver Council",
    category: "Factions",
    content:
      "A council of mages, scholars, and leaders formed in the aftermath of the Dread Sovereign's original defeat. They have safeguarded the knowledge of the phylactery's locations for generations. Based in Mistport's Silver Tower, the Council provides resources and guidance to the party. However, recent events suggest a traitor lurks among their members. The Council's authority has waned in recent centuries, and some members question whether they have the strength to face the coming storm.",
    relatedEntries: ["the-shadow-covenant", "the-dread-sovereign"],
  },
  {
    slug: "the-ritual-of-unbinding",
    title: "The Ritual of Unbinding",
    category: "Magic & Religion",
    content:
      "An ancient divine ritual that can cleanse a phylactery fragment of its dark energy, rendering it inert and preventing it from being used to resurrect the Dread Sovereign. The ritual requires a consecrated altar, a cleric of sufficient power, and specific rare components. Seraphina Dawnlight is one of the few living clerics capable of performing it. Each fragment must be cleansed individually. The ritual takes a full day and leaves the caster exhausted for a week afterward.",
    relatedEntries: ["the-five-seals", "the-dread-sovereign"],
  },
  {
    slug: "the-five-seals",
    title: "The Five Seals",
    category: "Ancient History",
    content:
      "When the heroes of old shattered the phylactery, each fragment was placed within a Seal: a magical prison designed to contain the dark energy. The first seal was in the Eldergrove, now broken. The second was in the Sunken Vault, also broken. The third lies within Ironhold. The locations of the fourth and fifth remain unknown, though Theron believes the ancient library of Vos Kethara may hold the answers. Each seal was crafted by a different school of magic, making them uniquely challenging to breach.",
    relatedEntries: [
      "the-dread-sovereign",
      "the-ritual-of-unbinding",
      "the-cursed-crown-of-ironhold",
    ],
  },
  {
    slug: "the-cursed-crown-of-ironhold",
    title: "The Cursed Crown of Ironhold",
    category: "Artifacts",
    content:
      "An ancient dwarven artifact that was corrupted by Shadow Covenant agents. When placed on King Duran III's head, it enslaved his mind to the Covenant's will. The crown amplifies the wearer's authority, making all who hear his voice compelled to obey. Breaking the enchantment will likely require either destroying the crown or performing a focused Dispel Magic at the moment of the king's vulnerability. The crown was once a symbol of unity among the dwarven clans.",
    relatedEntries: ["the-five-seals", "the-shadow-covenant"],
  },
];

// ─── Lookup Helpers ───────────────────────────────────────────────

export function getLocationBySlug(slug: string): Location | undefined {
  return locations.find((l) => l.slug === slug);
}

export function getNpcBySlug(slug: string): Npc | undefined {
  return npcs.find((n) => n.slug === slug);
}

export function getSessionBySlug(slug: string): Session | undefined {
  return sessions.find((s) => s.slug === slug);
}

export function getSessionByNumber(num: number): Session | undefined {
  return sessions.find((s) => s.number === num);
}

export function getItemBySlug(slug: string): Item | undefined {
  return items.find((i) => i.slug === slug);
}

export function getLoreBySlug(slug: string): LoreEntry | undefined {
  return loreEntries.find((l) => l.slug === slug);
}
