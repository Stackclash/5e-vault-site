export interface EntityConfig {
  includeTag: string[];
  includePath: string[];
  excludeTag?: string[];
  excludePath?: string[];
  filter?: (frontmatter: Record<string, unknown>) => boolean;
}

export const entities: Record<string, EntityConfig> = {
  npc: {
    includeTag: ["npc"],
    includePath: ["4. World Almanac/NPCs/"],
  },
  location: {
    includeTag: ["location"],
    excludeTag: ["world"],
    includePath: [
      "4. World Almanac/Settlements/",
      "4. World Almanac/Places of Interest/",
      "4. World Almanac/Regions/",
    ],
  },
  session: {
    includeTag: ["session-journal"],
    includePath: ["1. DM Stuff/Session Journals/"],
  },
  campaign: {
    includeTag: ["campaign"],
    includePath: ["1. DM Stuff/Campaigns/"],
  },
  lore: {
    includeTag: ["quest"],
    includePath: ["3. The Party/Quests/"],
  },
  world: {
    includeTag: ["world"],
    includePath: ["4. World Almanac/Worlds/"],
  }
};
