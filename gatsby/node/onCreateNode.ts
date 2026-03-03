import type { GatsbyNode } from "gatsby";
import { extractWikilinkName, matchesEntity, getFileName } from "../utils"
import { entities } from "../../src/entity-config";

const onCreateNode: GatsbyNode["onCreateNode"] = ({
  node,
  actions,
  createNodeId,
  createContentDigest,
}) => {
  const { createNode, createParentChildLink } = actions;

  if (node.internal.type !== "Mdx") return;

  const fileName = getFileName(node)

  for (const [entityType, config] of Object.entries(entities)) {
    if (!matchesEntity(node, config)) continue;

    const fm = node.frontmatter as Record<string, unknown> | undefined
    const typeName = entityType[0].toUpperCase() + entityType.slice(1)

    const entityData: Record<string, unknown> = {
      name: fileName,
    };

    if (entityType === "session") {
      entityData.party = typeof fm?.party === "string" ? extractWikilinkName(fm?.party) : null
      entityData.sessionDate = fm?.date || null
      entityData.locations = Array.isArray(fm?.locations)
        ? fm.locations.map((loc) => typeof loc === "string" ? extractWikilinkName(loc) : null)
        : [typeof fm?.location === "string" ? extractWikilinkName(fm?.location) : null]
    } else if (entityType === "npc") {
      entityData.location = typeof fm?.location === "string" ? extractWikilinkName(fm?.location) : null
      const partyRefs = typeof fm?.partyRelationships === 'object' ? Object.keys(fm.partyRelationships ?? {}) : []
      entityData.partyRelationships = fm?.partyRelationships ? partyRefs : null
      entityData.partyRefs = partyRefs
    } else if (entityType === "location") {
      entityData.parentLocation = typeof fm?.location === "string" ? extractWikilinkName(fm?.location) : null
    } else if (entityType === "quest") {
      entityData.world = typeof fm?.world === "string" ? extractWikilinkName(fm?.world) : null
      entityData.activeMap = typeof fm?.active === "string" ? extractWikilinkName(fm?.active) : null
      entityData.completedMap = typeof fm?.completed === "string" ? extractWikilinkName(fm?.completed) : null
    }

    const newNode = {
      ...entityData,
      id: createNodeId(`${entityType}-${fileName}`),
      parent: node.id,
      children: [],
      internal: {
        type: typeName,
        contentDigest: createContentDigest(entityData),
      },
    };

    createNode(newNode);
    createParentChildLink({ parent: node, child: newNode as any });
    break;
  }
};

export default onCreateNode;