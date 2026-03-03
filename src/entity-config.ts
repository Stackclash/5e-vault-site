export interface EntityConfig {
  includeTag: string[];
  includePath: string[];
  excludeTag?: string[];
  excludePath?: string[];
  filter?: (frontmatter: Record<string, unknown>) => boolean;
}

export const entities: Record<string, EntityConfig> = {
  campaign: {
    includeTag: ["campaign"],
    includePath: ["1. DM Stuff/Campaigns/"],
  },
  party: {
    includeTag: ["party"],
    includePath: ["3. The Party/Parties/"],
  },
  session: {
    includeTag: ["session-journal"],
    includePath: ["1. DM Stuff/Session Journals/"],
  },
  world: {
    includeTag: ["world"],
    includePath: ["4. World Almanac/Worlds/"],
  },
  npc: {
    includeTag: ["npc"],
    includePath: ["4. World Almanac/NPCs/"],
  },
  shop: {
    includeTag: ["location", "shop"],
    includePath: ["4. World Almanac/Shops/"],
  },
  settlement: {
    includeTag: ["location", "settlement"],
    includePath: ["4. World Almanac/Settlements/"],
  },
  pointOfInterest: {
    includeTag: ["location", "point-of-interest"],
    includePath: ["4. World Almanac/Places of Interest/"],
  },
  region: {
    includeTag: ["location", "region"],
    includePath: ["4. World Almanac/Regions/"],
  },
  quest: {
    includeTag: ["quest"],
    includePath: ["3. The Party/Quests/"],
  }
};
