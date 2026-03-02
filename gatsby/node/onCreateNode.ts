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

    const fm = node.frontmatter as Record<string, unknown> | undefined

    if (entityType === "campaign") {
      // Handle campaign-specific logic

      createNodeField({
        node,
        name: "world",
        value: extractWikilinkName(fm?.world),
      })

      createNodeField({
        node,
        name: "party",
        value: extractWikilinkName(fm?.party),
      })
    } else if (entityType === "party") {
      // Handle party-specific logic
    } else if (entityType === "session") {
      // Handle session-specific logic

      createNodeField({
        node,
        name: "party",
        value: extractWikilinkName(fm?.party),
      })

      createNodeField({
        node,
        name: "sessionDate",
        value: fm?.date || null,
      })

      createNodeField({
        node,
        name: "locations",
        value: Array.isArray(fm?.locations) ? fm.locations.map(extractWikilinkName) : [extractWikilinkName(fm?.location)]
      })
    } else if (entityType === "world") {
      // Handle world-specific logic
    } else if (entityType === "npc") {
      // Handle npc-specific logic

      createNodeField({
        node,
        name: "location",
        value: extractWikilinkName(fm?.location),
      })

      const partyRefs = typeof fm?.partyRelationships === 'object' ? Object.keys(fm.partyRelationships ?? {}) : []
      createNodeField({
        node,
        name: "partyRelationships",
        value: fm?.partyRelationships ? partyRefs : null,
      })

      createNodeField({
        node,
        name: "partyRefs",
        value: partyRefs
      })
    } else if (entityType === "location") {
      // Handle location-specific logic

      createNodeField({
        node,
        name: "parentLocation",
        value: extractWikilinkName(fm?.location),
      })
    } else if (entityType === "quest") {
      // Handle quest-specific logic

      createNodeField({
        node,
        name: "world",
        value: extractWikilinkName(fm?.world),
      })

      createNodeField({
        node,
        name: "activeMap",
        value: extractWikilinkName(fm?.active),
      })

      createNodeField({
        node,
        name: "completedMap",
        value: extractWikilinkName(fm?.completed),
      })
    }
  }
};

export default onCreateNode;