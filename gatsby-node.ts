import path from "path";
import type { GatsbyNode } from "gatsby";
import { entities } from "./src/entity-config";
import type { EntityConfig } from "./src/entity-config";

function extractWikilinkName(
  raw: string | undefined | null
): string | null {
  if (!raw) return null;

  let value = raw.trim();

  // Remove surrounding [[ ]] if present
  if (value.startsWith("[[") && value.endsWith("]]")) {
    value = value.slice(2, -2);
  }

  // Remove alias portion (after |)
  if (value.includes("|")) {
    value = value.split("|")[0];
  }

  value = value.trim();

  // Remove folder path
  const fileName = value.split("/").pop();
  if (!fileName) return null;

  // Remove extension safely (.md, .markdown, etc.)
  return path.parse(fileName).name;
}

function matchesEntity(
  node: any,
  config: EntityConfig
): boolean {
  const tags: string[] = node.frontmatter?.tags || []
  const filePath = node.internal.contentFilePath || ""

  const tagMatch =
    config.includeTag.length === 0 ||
    config.includeTag.some((tag: string) =>
      tags.includes(tag)
    )

  const pathMatch =
    config.includePath.length === 0 ||
    config.includePath.some((p: string) =>
      filePath.includes(p)
    )

  const excludeTagMatch =
    config.excludeTag?.some((tag: string) =>
      tags.includes(tag)
    ) ?? false

  const excludePathMatch =
    config.excludePath?.some((p: string) =>
      filePath.includes(p)
    ) ?? false

  const customFilter =
    config.filter?.(node.frontmatter ?? {}) ?? true

  return (
    tagMatch &&
    pathMatch &&
    !excludeTagMatch &&
    !excludePathMatch &&
    customFilter
  )
}

function getFileName(node: any): string {
  const filePath = node.internal.contentFilePath
  return path.basename(filePath, path.extname(filePath))
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-")
}

export const onCreateNode: GatsbyNode["onCreateNode"] = ({
  node,
  actions,
  getNode,
}) => {
  const { createNodeField } = actions;

  if (node.internal.type !== "Mdx") return;

  const fileName = getFileName(node)

  createNodeField({
    node,
    name: "name",
    value: fileName,
  })

  createNodeField({
    node,
    name: "slug",
    value: slugify(fileName),
  })

  // Classify entity type
  for (const [entityType, config] of Object.entries(entities)) {
    if (!matchesEntity(node, config)) continue;

    createNodeField({ node, name: "entityType", value: entityType })
  }

  // Normalize relationships
  const fm = node.frontmatter as Record<string, unknown> | undefined

  // World Relationships (for Campaigns)
  if (fm?.world) {
    createNodeField({
      node,
      name: "worldRef",
      value: extractWikilinkName(fm.world as string),
    })
  }

  // Location Relationships (for NPCs and Child Locations)
  if (fm?.location) {
    createNodeField({
      node,
      name: "locationRef",
      value: extractWikilinkName(fm.location as string),
    })
  }

  // Party Relationships (for Quests, NPCs, Players, and Campaigns)
  if (fm?.party || fm?.partyRelationships) {
    if (fm?.party) {
      createNodeField({
        node,
        name: "partyRef",
        value: [extractWikilinkName(fm.party as string)],
      })
    } else if (fm?.partyRelationships) {
      const partyRefs = typeof fm.partyRelationships === 'object' ? Object.keys(fm.partyRelationships) : []
      createNodeField({
        node,
        name: "partyRef",
        value: partyRefs,
      })
    }
  }
};

export const createSchemaCustomization: GatsbyNode["createSchemaCustomization"] =
  ({ actions }) => {
    actions.createTypes(`
      type MdxFields {
        entityType: String
        slug: String
      }

      type Mdx implements Node {
        fields: MdxFields
        frontmatter: MdxFrontmatter
      }

      type MdxFrontmatter {
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
      }
    `);
  };

interface MdxQueryResult {
  allMdx: {
    nodes: Array<{
      id: string;
      fields: {
        name: string;
        entityType: string;
        slug: string;
        worldRef?: string;
        partyRef?: string[];
        locationRef?: string;
      }
      frontmatter: Record<string, unknown>;
      internal: {
        contentFilePath: string;
      }
    }>;
  };
}

export const createResolvers: GatsbyNode["createResolvers"] = ({
  createResolvers,
}) => {
  createResolvers({
    Mdx: {
      // Reverse: World → Campaigns that reference this world
      campaigns: {
        type: "[Mdx]",
        resolve: async (source: any, _args: any, context: any) => {
          if (source.fields?.entityType !== "world" && source.fields?.entityType !== "party") {
            return null
          }
          const { entries } = await context.nodeModel.findAll({
            type: "Mdx",
            query: {
              filter: {
                fields: { entityType: { eq: "campaign" } },
              },
            },
          })
          const allCampaigns = Array.from(entries)
          return allCampaigns.filter((campaign: any) => {
            if (source.fields?.entityType === "world") {
              return campaign.fields?.worldRef === source.fields?.name
            }
            if (source.fields?.entityType === "party") {
              return campaign.fields?.partyRef?.includes(source.fields?.name)
            }
            return false
          })
        },
      },
      // Reverse: World → Top-level locations
      locations: {
        type: "[Mdx]",
        resolve: async (source: any, _args: any, context: any) => {
          if (source.fields?.entityType !== "world") return null
          
          // Fetch all locations
          const { entries: locationEntries } = await context.nodeModel.findAll({
            type: "Mdx",
            query: {
              filter: {
                fields: { entityType: { eq: "location" } },
              },
            },
          })
          const allLocations = Array.from(locationEntries)
          
          // Fetch all worlds to include in the lookup map
          const { entries: worldEntries } = await context.nodeModel.findAll({
            type: "Mdx",
            query: {
              filter: {
                fields: { entityType: { eq: "world" } },
              },
            },
          })
          const allWorlds = Array.from(worldEntries)
          
          // Combine locations and worlds for parent lookup
          const allNodes = [...allLocations, ...allWorlds]
          
          // Find locations that belong to this world
          return allLocations.filter((loc: any) => {
            return findWorldRootFromNode(loc, allNodes) === source.fields?.name
          })
        },
      },
      // Reverse: Location → Child locations
      children: {
        type: "[Mdx]",
        resolve: async (source: any, _args: any, context: any) => {
          if (source.fields?.entityType !== "location") return null
          const { entries } = await context.nodeModel.findAll({
            type: "Mdx",
            query: {
              filter: {
                fields: {
                  entityType: { eq: "location" },
                  locationRef: { eq: source.fields?.name },
                },
              },
            },
          })
          return Array.from(entries)
        },
      },
      // Reverse: Location → NPCs at this location
      npcs: {
        type: "[Mdx]",
        resolve: async (source: any, _args: any, context: any) => {
          if (source.fields?.entityType !== "location") return null
          const { entries } = await context.nodeModel.findAll({
            type: "Mdx",
            query: {
              filter: {
                fields: {
                  entityType: { eq: "npc" },
                  locationRef: { eq: source.fields?.name },
                },
              },
            },
          })
          return Array.from(entries)
        },
      },
      // Reverse: Party → Sessions
      sessions: {
        type: "[Mdx]",
        resolve: async (source: any, _args: any, context: any) => {
          if (source.fields?.entityType !== "party") return null
          const { entries } = await context.nodeModel.findAll({
            type: "Mdx",
            query: {
              filter: {
                fields: { entityType: { eq: "session" } },
              },
            },
          })
          const allSessions = Array.from(entries)
          return allSessions.filter((session: any) =>
            session.fields?.partyRef?.includes(source.fields?.name)
          )
        },
      },
    },
  })
}

function findWorldRootFromNode(node: any, allNodes: any[]): string | null {
  let current = node
  const nodeByName = new Map(allNodes.map((n: any) => [n.fields?.name, n]))

  // Walk up the location hierarchy via locationRef
  while (current?.fields?.locationRef) {
    const parent = nodeByName.get(current.fields.locationRef)
    if (!parent) break
    current = parent
  }

  // Check if the final node is a world
  if (current?.fields?.entityType === "world") {
    return current.fields.name
  }

  return null
}

export const createPages: GatsbyNode["createPages"] = async ({
  graphql,
  actions,
}) => {
  const { createPage } = actions

  // Pages can be created here if needed
  // Reverse relationships are now handled by createResolvers above
}
