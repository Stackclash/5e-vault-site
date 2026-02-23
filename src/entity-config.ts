export interface EntityConfig {
  includeTag: string[];
  includePath: string[];
  excludeTag?: string[];
  excludePath?: string[];
  filter?: (frontmatter: Record<string, unknown>) => boolean;
}

export const entities: Record<string, EntityConfig> = {
  npcs: {
    includeTag: ["npc"],
    includePath: ["4. World Almanac/NPCs/"],
  },
  locations: {
    includeTag: ["location"],
    includePath: [
      "4. World Almanac/Settlements/",
      "4. World Almanac/Places of Interest/",
      "4. World Almanac/Regions/",
    ],
  },
  sessions: {
    includeTag: ["session-journal"],
    includePath: ["1. DM Stuff/Session Journals/"],
  },
  items: {
    includeTag: ["item"],
    includePath: ["5. Mechanics/Items/"],
  },
  lore: {
    includeTag: ["quest"],
    includePath: ["3. The Party/Quests/"],
  },
};
