import type { GatsbyNode } from "gatsby";
import { extractWikilinkName, matchesEntity, getFileName, slugify } from "../utils"
import { entities } from "../../src/entity-config";

const locationTypes = new Set(["shop", "settlement", "pointOfInterest", "region", "world"]);

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
      entityData.sessionDate = fm?.date || null
      entityData.summary = typeof fm?.summary === "string" ? fm.summary : null
      const match = /S(\d+) ([\w\s]+)/.exec(fileName)
      if (match) {
        entityData.sessionNumber = parseInt(match[1], 10)
        entityData.name = match[2]
      }
    } else if (locationTypes.has(entityType)) {
      if (entityType === "settlement") {
        entityData.population = typeof fm?.population === "number" ? fm.population : null
        entityData.government = typeof fm?.government === "string" ? fm.government : null
      } else if (entityType === "region") {
        entityData.terrain = typeof fm?.terrain === "string" ? fm.terrain : null
        entityData.climate = typeof fm?.climate === "string" ? fm.climate : null
      }
    } else if (entityType === "quest") {
      entityData.description = typeof fm?.description === "string" ? fm.description : null
    }

    const newNode = {
      ...entityData,
      id: createNodeId(`${entityType}-${fileName}`),
      parent: node.id,
      slug: slugify(fileName),
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