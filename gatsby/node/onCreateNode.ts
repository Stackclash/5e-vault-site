import type { GatsbyNode } from "gatsby";
import { extractWikilinkName, matchesEntity, getFileName } from "../utils"
import { entities } from "../../src/entity-config";

const onCreateNode: GatsbyNode["onCreateNode"] = ({
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

  // Party Relationships (for Quests, Sessions, NPCs, Players, and Campaigns)
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

export default onCreateNode;