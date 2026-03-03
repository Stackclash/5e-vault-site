import path from "path"
import type { EntityConfig } from "../src/entity-config"

export function extractWikilinkName(
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

export function matchesEntity(
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

export function getFileName(node: any): string {
  const filePath = node.internal.contentFilePath
  return path.basename(filePath, path.extname(filePath))
}

export function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-")
}

export async function asyncFilter(arr: any[], predicate: (item: any) => Promise<boolean>): Promise<any[]> {
  // 1. Run all async predicates in parallel and get an array of boolean Promises.
  const results = await Promise.all(arr.map(predicate));

  // 2. Synchronously filter the original array based on the results.
  return arr.filter((_v, index) => results[index]);
}

export async function getWorldFromLocation(context: any, node: any, allNodes: any[]): Promise<any | null> {
  let current = node
  const nodeByName = new Map(allNodes.map((n: any) => [n.name, n]))

  // Walk up the location hierarchy via location or parentLocation
  do {
    const mdxParent = await getParentNode(context, current)
    const parentRef = extractWikilinkName(mdxParent?.frontmatter?.location) || extractWikilinkName(mdxParent?.frontmatter?.parentLocation)
    const parent = nodeByName.get(parentRef)
    if (!parent) break
    current = parent
  } while (current.location || current.parentLocation)

  // Check if the final node is a world
  if (current?.internal?.type === "World") {
    return current
  }

  return null
}

export async function getCampaignFromParty(context: any, party: string | null, allCampaigns: any[]): Promise<any[]> {
  if (!party) return []
  return await asyncFilter(allCampaigns, async (campaign: any) => {
    const campaignMdxParent = await getParentNode(context, campaign)
    return extractWikilinkName(campaignMdxParent?.frontmatter?.party) === party
  })
}

export async function getCampaignFromWorld(context: any, world: string | null, allCampaigns: any[]): Promise<any[]> {
  if (!world) return []
  return await asyncFilter(allCampaigns, async (campaign: any) => {
    const campaignMdxParent = await getParentNode(context, campaign)
    return extractWikilinkName(campaignMdxParent?.frontmatter?.world) === world
  })
}

export async function getAllNodes(context: any, nodeType: string): Promise<any[]> {
  const { entries } = await context.nodeModel.findAll({
    type: nodeType,
  })
  return Array.from(entries)
}

export async function getParentNode(context: any, node: any): Promise<any | null> {
  if (!node.parent) return null
  const parentNode = await context.nodeModel.getNodeById({ id: node.parent })
  if (parentNode && parentNode.internal && parentNode.internal.type === "Mdx") {
    return parentNode
  }
  return null
}