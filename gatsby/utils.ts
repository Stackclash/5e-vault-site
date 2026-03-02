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

export function getWorldFromLocation(node: any, allNodes: any[]): string | null {
  let current = node
  const nodeByName = new Map(allNodes.map((n: any) => [n.name, n]))

  // Walk up the location hierarchy via location or parentLocation
  do {
    const parentRef = current.location || current.parentLocation
    const parent = nodeByName.get(parentRef)
    if (!parent) break
    current = parent
  } while (current.location || current.parentLocation)

  // Check if the final node is a world
  if (current?.entityType === "world") {
    return current.name
  }

  return null
}

export function getCampaignFromParty(party: string, allCampaigns: any[]): any[] {
  return allCampaigns.filter((campaign: any) =>
    campaign.party === party
  )
}

export function getCampaignFromWorld(world: string, allCampaigns: any[]): any[] {
  return allCampaigns.filter((campaign: any) =>
    campaign.world === world
  )
}

export async function getAllNodes(context: any, type: string): Promise<any[]> {
  const { entries } = await context.nodeModel.findAll({
    type: type,
  })
  return Array.from(entries)
}