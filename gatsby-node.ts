import path from "path";
import type { GatsbyNode } from "gatsby";
import { entities } from "./src/entity-config";
import type { EntityConfig } from "./src/entity-config";

function matchesEntity(
  config: EntityConfig,
  tags: string[],
  relativePath: string,
): boolean {
  const tagMatch = config.includeTag.some((t) => tags.includes(t));
  const pathMatch = config.includePath.some((p) => relativePath.startsWith(p));

  if (!tagMatch && !pathMatch) return false;

  if (config.excludeTag?.some((t) => tags.includes(t))) return false;
  if (config.excludePath?.some((p) => relativePath.startsWith(p))) return false;

  return true;
}

/** Extract the note name from an Obsidian wikilink: [[Path/To/Note]] or [[Note|Alias]] */
function extractWikilinkName(raw: string | undefined | null): string | null {
  if (!raw) return null;
  const match = raw.match(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/);
  if (!match) return null;
  const fullPath = match[1].trim();
  const parts = fullPath.split("/");
  return parts[parts.length - 1].trim();
}

/** Recursively follow location→parent chain to find the ultimate ancestor (world). */
function resolveWorld(
  name: string,
  locationToParent: Map<string, string | null>,
  visited = new Set<string>(),
): string {
  if (visited.has(name)) return name;
  visited.add(name);
  const parent = locationToParent.get(name);
  if (!parent) return name;
  return resolveWorld(parent, locationToParent, visited);
}

export const onCreateNode: GatsbyNode["onCreateNode"] = ({
  node,
  actions,
  getNode,
}) => {
  const { createNodeField } = actions;

  if (node.internal.type !== "MarkdownRemark") return;

  const frontmatter = node.frontmatter as Record<string, unknown> | undefined;
  const rawTags = frontmatter?.tags;
  const tags: string[] = Array.isArray(rawTags)
    ? (rawTags as string[])
    : typeof rawTags === "string"
      ? [rawTags]
      : [];

  const parent = node.parent ? getNode(node.parent) : undefined;
  const relativePath = (parent?.relativePath as string) ?? "";

  for (const [entityType, config] of Object.entries(entities)) {
    if (!matchesEntity(config, tags, relativePath)) continue;
    if (config.filter && !config.filter(frontmatter ?? {})) continue;

    const fileName = (parent?.name as string) ?? "";
    const slug = fileName.toLowerCase().replace(/\s+/g, "-");

    createNodeField({ node, name: "entityType", value: entityType });
    createNodeField({ node, name: "slug", value: slug });
    return;
  }
};

export const createSchemaCustomization: GatsbyNode["createSchemaCustomization"] =
  ({ actions }) => {
    actions.createTypes(`
      type MarkdownRemarkFields {
        entityType: String
        slug: String
      }

      type MarkdownRemark implements Node {
        fields: MarkdownRemarkFields
        frontmatter: MarkdownRemarkFrontmatter
      }

      type MarkdownRemarkFrontmatter {
        tags: [String]
        aliases: [String]
        cssclasses: [String]
        date: Date @dateformat
        summary: String
        party: String
        race: String
        gender: String
        alignment: String
        condition: String
        personality: String
        ideal: String
        bond: String
        flaw: String
        likes: String
        dislikes: String
        location: String
        pronounced: String
        terrain: String
        government: String
        campaign: String
        world: String
        partyRelationship: String
      }
    `);
  };

interface BasicNode {
  id: string;
  fields: { entityType: string; slug: string };
}

interface MarkdownQueryResult {
  allMarkdownRemark: { nodes: BasicNode[] };
}

interface CampaignQueryResult {
  allMarkdownRemark: {
    nodes: Array<{
      id: string;
      fields: { slug: string };
      frontmatter: { party?: string; world?: string };
      parent: { name?: string } | null;
    }>;
  };
}

interface LocationQueryResult {
  allMarkdownRemark: {
    nodes: Array<{
      id: string;
      fields: { slug: string };
      frontmatter: { location?: string };
      parent: { name?: string } | null;
    }>;
  };
}

interface SessionQueryResult {
  allMarkdownRemark: {
    nodes: Array<{
      id: string;
      fields: { slug: string };
      frontmatter: { party?: string };
      parent: { name?: string } | null;
    }>;
  };
}

interface NpcQueryResult {
  allMarkdownRemark: {
    nodes: Array<{
      id: string;
      fields: { slug: string };
      frontmatter: { location?: string; partyRelationship?: string };
      parent: { name?: string } | null;
    }>;
  };
}

interface QuestQueryResult {
  allMarkdownRemark: {
    nodes: Array<{
      id: string;
      fields: { slug: string };
      frontmatter: { world?: string; campaign?: string };
      parent: { name?: string } | null;
    }>;
  };
}

export const createPages: GatsbyNode["createPages"] = async ({
  graphql,
  actions,
  reporter,
}) => {
  const { createPage } = actions;

  // ── 1. Global entity detail pages (unchanged behaviour) ──────────────────
  const globalEntityTypes = ["npcs", "locations", "sessions", "items", "lore"];
  for (const entityType of globalEntityTypes) {
    const result = await graphql<MarkdownQueryResult>(`
      {
        allMarkdownRemark(
          filter: { fields: { entityType: { eq: "${entityType}" } } }
        ) {
          nodes {
            id
            fields { entityType slug }
          }
        }
      }
    `);

    if (result.errors) {
      reporter.panicOnBuild(
        `Error querying ${entityType} pages`,
        result.errors as Error,
      );
      return;
    }

    const nodes = result.data?.allMarkdownRemark.nodes ?? [];
    nodes.forEach((node) => {
      createPage({
        path: `/${entityType}/${node.fields.slug}`,
        component: path.resolve(`./src/templates/${entityType}-detail.tsx`),
        context: { id: node.id },
      });
    });
  }

  // ── 2. Query data needed for campaign-scoped pages ────────────────────────
  const [campaignRes, locationRes, sessionRes, npcRes, questRes] =
    await Promise.all([
      graphql<CampaignQueryResult>(`
        {
          allMarkdownRemark(
            filter: { fields: { entityType: { eq: "campaigns" } } }
          ) {
            nodes {
              id
              fields { slug }
              frontmatter { party world }
              parent { ... on File { name } }
            }
          }
        }
      `),
      graphql<LocationQueryResult>(`
        {
          allMarkdownRemark(
            filter: { fields: { entityType: { eq: "locations" } } }
          ) {
            nodes {
              id
              fields { slug }
              frontmatter { location }
              parent { ... on File { name } }
            }
          }
        }
      `),
      graphql<SessionQueryResult>(`
        {
          allMarkdownRemark(
            filter: { fields: { entityType: { eq: "sessions" } } }
          ) {
            nodes {
              id
              fields { slug }
              frontmatter { party }
              parent { ... on File { name } }
            }
          }
        }
      `),
      graphql<NpcQueryResult>(`
        {
          allMarkdownRemark(
            filter: { fields: { entityType: { eq: "npcs" } } }
          ) {
            nodes {
              id
              fields { slug }
              frontmatter { location partyRelationship }
              parent { ... on File { name } }
            }
          }
        }
      `),
      graphql<QuestQueryResult>(`
        {
          allMarkdownRemark(
            filter: { fields: { entityType: { eq: "lore" } } }
          ) {
            nodes {
              id
              fields { slug }
              frontmatter { world campaign }
              parent { ... on File { name } }
            }
          }
        }
      `),
    ]);

  for (const res of [campaignRes, locationRes, sessionRes, npcRes, questRes]) {
    if (res.errors) {
      reporter.panicOnBuild(
        "Error querying campaign-related pages",
        res.errors as Error,
      );
      return;
    }
  }

  const campaigns = campaignRes.data?.allMarkdownRemark.nodes ?? [];
  const locationNodes = locationRes.data?.allMarkdownRemark.nodes ?? [];
  const sessionNodes = sessionRes.data?.allMarkdownRemark.nodes ?? [];
  const npcNodes = npcRes.data?.allMarkdownRemark.nodes ?? [];
  const questNodes = questRes.data?.allMarkdownRemark.nodes ?? [];

  // Build location-name → parent-location-name map for world resolution
  const locationToParent = new Map<string, string | null>();
  for (const loc of locationNodes) {
    const name = loc.parent?.name ?? "";
    if (!name) continue;
    const parentName = extractWikilinkName(loc.frontmatter?.location);
    locationToParent.set(name, parentName);
  }

  // Pre-compute resolved world for every location (cache to avoid redundant traversals)
  const locationWorldCache = new Map<string, string>();
  for (const loc of locationNodes) {
    const name = loc.parent?.name ?? "";
    if (!name) continue;
    locationWorldCache.set(name, resolveWorld(name, locationToParent));
  }

  // ── 3. Create per-campaign pages ──────────────────────────────────────────
  for (const campaign of campaigns) {
    const campaignSlug = campaign.fields.slug;
    const campaignFileName = campaign.parent?.name ?? "";
    const partyName = campaign.frontmatter?.party ?? "";
    const worldName = extractWikilinkName(campaign.frontmatter?.world);

    // Locations: those whose resolved world matches this campaign's world
    const campaignLocationIds = locationNodes
      .filter((loc) => {
        const locName = loc.parent?.name ?? "";
        if (!locName || !worldName) return false;
        return locationWorldCache.get(locName) === worldName;
      })
      .map((n) => n.id);

    // Sessions: those whose party field matches this campaign's party
    const campaignSessionIds = sessionNodes
      .filter((s) => {
        const sp = s.frontmatter?.party;
        if (!sp || !partyName) return false;
        if (Array.isArray(sp)) return (sp as string[]).includes(partyName);
        return sp === partyName;
      })
      .map((n) => n.id);

    // NPCs: those with a partyRelationship matching the party name
    // (player-facing: only show NPCs that have an explicit party relationship)
    const campaignNpcIds = npcNodes
      .filter((npc) => {
        const pr = npc.frontmatter?.partyRelationship;
        if (!pr || !partyName) return false;
        if (Array.isArray(pr)) return (pr as string[]).includes(partyName);
        return pr === partyName;
      })
      .map((n) => n.id);

    // Quests/lore: linked to this world or this campaign
    const campaignQuestIds = questNodes
      .filter((q) => {
        const qWorld = extractWikilinkName(q.frontmatter?.world);
        const qCampaign = extractWikilinkName(q.frontmatter?.campaign);
        return (
          (worldName && qWorld === worldName) ||
          (campaignFileName && qCampaign === campaignFileName)
        );
      })
      .map((n) => n.id);

    // Campaign index page
    createPage({
      path: `/${campaignSlug}/`,
      component: path.resolve(`./src/templates/campaign-index.tsx`),
      context: {
        id: campaign.id,
        campaignSlug,
        partyName,
        worldName,
        locationCount: campaignLocationIds.length,
        sessionCount: campaignSessionIds.length,
        npcCount: campaignNpcIds.length,
        questCount: campaignQuestIds.length,
      },
    });

    // Campaign entity list pages
    const listPageTypes = [
      {
        type: "locations",
        ids: campaignLocationIds,
        template: "campaign-locations",
      },
      {
        type: "sessions",
        ids: campaignSessionIds,
        template: "campaign-sessions",
      },
      { type: "npcs", ids: campaignNpcIds, template: "campaign-npcs" },
      { type: "lore", ids: campaignQuestIds, template: "campaign-lore" },
    ] as const;

    for (const { type, ids, template } of listPageTypes) {
      createPage({
        path: `/${campaignSlug}/${type}`,
        component: path.resolve(`./src/templates/${template}.tsx`),
        context: { campaignSlug, partyName, worldName, ids },
      });
    }

    // Campaign entity detail pages (reuse existing detail templates, add campaign context)
    const detailTypes = [
      { entityType: "locations", ids: campaignLocationIds },
      { entityType: "sessions", ids: campaignSessionIds },
      { entityType: "npcs", ids: campaignNpcIds },
      { entityType: "lore", ids: campaignQuestIds },
    ];

    for (const { entityType, ids } of detailTypes) {
      const allNodes =
        entityType === "locations"
          ? locationNodes
          : entityType === "sessions"
            ? sessionNodes
            : entityType === "npcs"
              ? npcNodes
              : questNodes;

      allNodes
        .filter((n) => ids.includes(n.id))
        .forEach((node) => {
          createPage({
            path: `/${campaignSlug}/${entityType}/${node.fields.slug}`,
            component: path.resolve(
              `./src/templates/${entityType}-detail.tsx`,
            ),
            context: { id: node.id, campaignSlug },
          });
        });
    }
  }
};
