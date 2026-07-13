import type { GatsbyNode } from "gatsby";
import { matchesEntity, getFileName, slugify } from "../utils"
import { reduceWikilinks, extractSection, extractCallout, cleanProse, normalizeImagePath, parseSessionFilename } from "../extract"
import { entities } from "../../src/entity-config";

const locationTypes = new Set(["shop", "settlement", "pointOfInterest", "region", "world"]);

function toStringOrNull(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value : null
}

function toStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : []
}

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
      entityData.summary = reduceWikilinks(toStringOrNull(fm?.summary))
      const parsedSession = parseSessionFilename(fileName)
      if (parsedSession) {
        entityData.sessionNumber = parsedSession.sessionNumber
        entityData.name = parsedSession.title
      }
      const explicitSessionNumber = typeof fm?.session_number === "number" ? fm.session_number : null
      if (explicitSessionNumber != null) {
        entityData.sessionNumber = explicitSessionNumber
      }
      entityData.partyPresent = toStringArray(fm?.party_present)
        .map((v) => reduceWikilinks(v))
        .filter((v): v is string => v !== null)
      entityData.items = toStringArray(fm?.items)
        .map((v) => reduceWikilinks(v))
        .filter((v): v is string => v !== null)
    } else if (locationTypes.has(entityType)) {
      const body = typeof (node as any).body === "string" ? (node as any).body as string : ""
      entityData.summary = reduceWikilinks(toStringOrNull(fm?.summary))
      entityData.overview = cleanProse(extractCallout(body, "Overview"))
      entityData.history = cleanProse(extractSection(body, "History"))
      entityData.images = toStringArray(fm?.images)
        .map(normalizeImagePath)
        .filter((img): img is string => img !== null)

      if (entityType === "settlement") {
        entityData.population = typeof fm?.population === "number" ? fm.population : null
        entityData.government = toStringOrNull(fm?.government)
      } else if (entityType === "region") {
        entityData.terrain = toStringOrNull(fm?.terrain)
        entityData.climate = toStringOrNull(fm?.climate)
      }
    } else if (entityType === "npc") {
      entityData.race = reduceWikilinks(toStringOrNull(fm?.race))
      entityData.gender = toStringOrNull(fm?.gender)
      entityData.age = typeof fm?.age === "number" ? fm.age : null
      entityData.alignment = toStringOrNull(fm?.alignment)
      entityData.condition = toStringOrNull(fm?.condition)
      entityData.occupation = toStringArray(fm?.occupation)
      entityData.personality = toStringOrNull(fm?.personality)
      entityData.ideal = toStringOrNull(fm?.ideal)
      entityData.bond = toStringOrNull(fm?.bond)
      entityData.flaw = toStringOrNull(fm?.flaw)
      entityData.goals = Array.isArray(fm?.goals)
        ? toStringOrNull(toStringArray(fm.goals).join("; "))
        : toStringOrNull(fm?.goals)
      entityData.likes = toStringOrNull(fm?.likes)
      entityData.dislikes = toStringOrNull(fm?.dislikes)
      entityData.aliases = toStringArray(fm?.aliases)
      entityData.images = toStringArray(fm?.images)
        .map(normalizeImagePath)
        .filter((img): img is string => img !== null)
      entityData.playerImpression = reduceWikilinks(toStringOrNull(fm?.player_impression))
    } else if (entityType === "quest") {
      entityData.description = reduceWikilinks(toStringOrNull(fm?.description))
      entityData.playerSummary = reduceWikilinks(toStringOrNull(fm?.player_summary))

      const rawSteps = Array.isArray(fm?.steps) ? fm.steps : []
      entityData.steps = rawSteps.map((step: any) => ({
        text: reduceWikilinks(toStringOrNull(step?.text)),
        completed: step?.completed && typeof step.completed === "object" ? step.completed : {},
      }))

      const rawNpcs = Array.isArray(fm?.npcs) ? fm.npcs : []
      entityData.questNpcs = rawNpcs.map((questNpc: any) => ({
        name: reduceWikilinks(toStringOrNull(questNpc?.name)),
        description: reduceWikilinks(toStringOrNull(questNpc?.description)),
      }))
    } else if (entityType === "campaign") {
      entityData.publicPremise = cleanProse(reduceWikilinks(toStringOrNull(fm?.public_premise)))
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