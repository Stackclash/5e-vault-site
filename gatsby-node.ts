import path from "path";
import type { GatsbyNode } from "gatsby";
import { entities } from "./src/entity-config";
import type { EntityConfig } from "./src/entity-config";

function push(
  map: Map<string, string[]>,
  key: string,
  value: string
) {
  if (!map.has(key)) map.set(key, [])
  map.get(key)!.push(value)
}

function attachReverse(
  node: any,
  map: Map<string, string[]>,
  fieldName: string,
  createNodeField: any
) {
  const values = map.get(node.fields.name)
  if (!values?.length) return

  createNodeField({
    node,
    name: `${fieldName}___NODE`,
    value: values,
  })
}

function findWorldRoot(node: any, nodeByName: Map<string, any>) {
  let current = node

  while (current?.fields?.locationRef) {
    current = nodeByName.get(current.fields.locationRef)
  }

  if (current?.fields?.entityType === "world") {
    return current.fields.name
  }

  return null
}

function extractWikilinkName(raw: string | undefined | null): string | null {
  if (!raw) return null;
  const match = raw.match(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/);
  if (!match) return null;
  const fullPath = match[1].trim();
  const parts = fullPath.split("/");
  return parts[parts.length - 1].trim();
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
    return;
  }

  // Normalize relationships
  const fm = node.frontmatter as Record<string, unknown> | undefined
  if (matchesEntity(node, entities['campaign'])) console.log(fm)

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

  // Party Relationships (for Quests, NPCs, Players)
  if (fm?.party || fm?.partyRelationships) {
    if (fm?.party) {
      createNodeField({
        node,
        name: "partyRef",
        value: extractWikilinkName(fm.party as string),
      })
    } else if (fm?.partyRelationships) {
      const partyRefs = typeof fm.partyRelationships === 'object' ? Object.keys(fm.partyRelationships) : []
      createNodeField({
        node,
        name: "partyRefs",
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
        entityType: string;
        slug: string;
      }
      internal: {
        contentFilePath: string;
      }
    }>;
  };
}

export const createPages: GatsbyNode["createPages"] = async ({
  graphql,
  actions,
}) => {
  const { createPage, createNodeField } = actions

  const result = await graphql<{
    allMdx: {
      nodes: any[]
    }
  }>(`
    {
      allMdx {
        nodes {
          id
          fields {
            name
            entityType
            worldRef
            partyRef
            locationRef
          }
          frontmatter
        }
      }
    }
  `)

  const nodes = result.data?.allMdx.nodes ?? []

  const nodeByName = new Map(
    nodes.map(n => [n.fields.name, n])
  )

  /*
    Reverse relationship accumulators
  */

  const worldToCampaigns = new Map<string, string[]>()
  const worldToLocations = new Map<string, string[]>()
  const locationToChildren = new Map<string, string[]>()
  const locationToNpcs = new Map<string, string[]>()
  const partyToCampaigns = new Map<string, string[]>()
  const partyToSessions = new Map<string, string[]>()
  const partyToQuestsActive = new Map<string, string[]>()
  const partyToQuestsCompleted = new Map<string, string[]>()

  /*
    WALK ALL NODES
  */

  for (const node of nodes) {
    const name = node.fields.name

    // Campaign → World + Party
    if (node.fields.entityType === "campaign") {
      if (node.fields.worldRef) {
        push(worldToCampaigns, node.fields.worldRef, node.id)
      }

      if (node.fields.partyRef) {
        push(partyToCampaigns, node.fields.partyRef, node.id)
      }
    }

    // Location hierarchy
    if (node.fields.entityType === "locations") {
      if (node.fields.locationRef) {
        push(locationToChildren, node.fields.locationRef, node.id)
      } else {
        // Top level location → likely child of World
        const worldName = findWorldRoot(node, nodeByName)
        if (worldName) {
          push(worldToLocations, worldName, node.id)
        }
      }
    }

    // NPC → Location
    if (node.fields.entityType === "npcs") {
      if (node.fields.locationRef) {
        push(locationToNpcs, node.fields.locationRef, node.id)
      }
    }

    // Sessions → Party
    if (node.fields.entityType === "sessions") {
      if (node.fields.partyRef) {
        push(partyToSessions, node.fields.partyRef, node.id)
      }
    }

    // Quests → Party via object maps
    if (node.fields.entityType === "lore") {
      const active = node.frontmatter?.active ?? {}
      const completed = node.frontmatter?.completed ?? {}

      for (const [party, value] of Object.entries(active)) {
        if (value === true) {
          push(partyToQuestsActive, party, node.id)
        }
      }

      for (const [party, value] of Object.entries(completed)) {
        if (value === true) {
          push(partyToQuestsCompleted, party, node.id)
        }
      }
    }
  }

  /*
    ATTACH REVERSE FIELDS
  */

  for (const node of nodes) {
    const name = node.fields.name

    attachReverse(node, worldToCampaigns, "campaigns", createNodeField)
    attachReverse(node, worldToLocations, "locations", createNodeField)
    attachReverse(node, locationToChildren, "children", createNodeField)
    attachReverse(node, locationToNpcs, "npcs", createNodeField)
    attachReverse(node, partyToCampaigns, "campaigns", createNodeField)
    attachReverse(node, partyToSessions, "sessions", createNodeField)
    attachReverse(node, partyToQuestsActive, "activeQuests", createNodeField)
    attachReverse(node, partyToQuestsCompleted, "completedQuests", createNodeField)
  }
}
