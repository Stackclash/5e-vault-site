import type { GatsbyNode } from "gatsby";
import { asyncFilter, extractWikilinkName, getAllDescendantLocations, getAllNodes, getCampaignFromParty, getCampaignFromWorld, getParentNode, getWorldFromLocation } from "../utils"

const locationNodeTypes = ["Shop", "Settlement", "PointOfInterest", "Region", "World"];

async function getAllLocationNodes(context: any): Promise<any[]> {
  const results = await Promise.all(
    locationNodeTypes.map(type => getAllNodes(context, type))
  );
  return results.flat();
}

function createLocationCampaignsResolver() {
  return {
    type: "[Campaign]",
    resolve: async (source: any, args: any, context: any) => {
      const allCampaigns = await getAllNodes(context, "Campaign")
      const allLocationNodes = await getAllLocationNodes(context)
      const world = await getWorldFromLocation(context, source, allLocationNodes)
      if (!world) return []
      return await getCampaignFromWorld(context, world.name, allCampaigns)
    }
  };
}

function createParentLocationResolver() {
  return {
    type: "Location",
    resolve: async (source: any, args: any, context: any) => {
      const allLocationNodes = await getAllLocationNodes(context)
      const mdxParent = await getParentNode(context, source)
      return allLocationNodes.find((loc: any) => loc.name === extractWikilinkName(mdxParent?.frontmatter?.location)) || null
    }
  };
}

function createChildrenLocationsResolver() {
  return {
    type: "[Location]",
    resolve: async (source: any, args: any, context: any) => {
      const allLocationNodes = await getAllLocationNodes(context)
      return await getAllDescendantLocations(context, source.name, allLocationNodes)
    }
  }
}

// Normalized images[] entries are vault-root-relative (e.g.
// "z_Assets/Locations/Maps/thornmere.png"); each prefix here maps to the
// gatsby-source-filesystem instance rooted at that vault folder, so the
// remainder is the File node's relativePath within that source. NPC
// portraits live under "4. World Almanac/NPCs/img/", which the existing
// "npc" source (rooted one level up, at .../NPCs) already covers - there's
// no separate source for the img/ subfolder.
const ASSET_SOURCE_PREFIXES: Array<{ prefix: string; sourceInstanceName: string }> = [
  { prefix: "z_Assets/", sourceInstanceName: "assets" },
  { prefix: "4. World Almanac/NPCs/", sourceInstanceName: "npc" },
]

async function resolveImageFileNode(context: any, imagePath: string): Promise<any | null> {
  for (const { prefix, sourceInstanceName } of ASSET_SOURCE_PREFIXES) {
    if (!imagePath.startsWith(prefix)) continue
    const relativePath = imagePath.slice(prefix.length)
    const { entries } = await context.nodeModel.findAll({
      type: "File",
      query: {
        filter: {
          sourceInstanceName: { eq: sourceInstanceName },
          relativePath: { eq: relativePath },
        },
      },
    })
    const [file] = Array.from(entries) as any[]
    if (file) return file
  }
  return null
}

function createImageResolver() {
  return {
    type: "File",
    resolve: async (source: any, args: any, context: any) => {
      const images: string[] = Array.isArray(source.images) ? source.images : []
      const [firstImage] = images
      if (!firstImage) return null
      return await resolveImageFileNode(context, firstImage)
    }
  }
}

const createResolvers: GatsbyNode["createResolvers"] = ({
  createResolvers,
}) => {
  createResolvers({
    Campaign: {
      party: {
        type: "Party",
        resolve: async (source: any, args: any, context: any) => {
          const allParties = await getAllNodes(context, "Party");
          const mdxParent = await getParentNode(context, source);
          return allParties.find((party: any) => party.name === extractWikilinkName(mdxParent?.frontmatter?.party)) || null;
        }
      },
      world: {
        type: "World",
        resolve: async (source: any, args: any, context: any) => {
          const allWorlds = await getAllNodes(context, "World");
          const mdxParent = await getParentNode(context, source);
          return allWorlds.find((world: any) => world.name === extractWikilinkName(mdxParent?.frontmatter?.world)) || null;
        }
      },
      sessions: {
        type: "[Session]",
        resolve: async (source: any, args: any, context: any) => {
          const allSessions = await getAllNodes(context, "Session")
          allSessions.sort((a: any, b: any) => new Date(a.sessionDate).getTime() - new Date(b.sessionDate).getTime())
          return await asyncFilter(allSessions, async (session: any) => {
            const sessionMdxParent = await getParentNode(context, session)
            return extractWikilinkName(sessionMdxParent?.frontmatter?.campaign) === source.name
          })
        }
      },
      locations: {
        type: "[Location]",
        resolve: async (source: any, args: any, context: any) => {
          const allLocationNodes = await getAllLocationNodes(context)
          const mdxParent = await getParentNode(context, source);
          const worldName = extractWikilinkName(mdxParent?.frontmatter?.world)
          if (!worldName) return []
          return await getAllDescendantLocations(context, worldName, allLocationNodes)
        }
      },
      npcs: {
        type: "[Npc]",
        resolve: async (source: any, args: any, context: any) => {
          const allNpcs = await getAllNodes(context, "Npc")
          const allLocationNodes = await getAllLocationNodes(context)
          const mdxParent = await getParentNode(context, source);
          const worldName = extractWikilinkName(mdxParent?.frontmatter?.world)
          const partyName = extractWikilinkName(mdxParent?.frontmatter?.party)
          if (!worldName && !partyName) return []
          return await asyncFilter(allNpcs, async (npc: any) => {
            const npcMdxParent = await getParentNode(context, npc)
            const npcWorld = await getWorldFromLocation(context, npc, allLocationNodes)
            return npcWorld?.name === worldName || (partyName && npcMdxParent?.frontmatter?.partyRelationships?.[partyName])
          })
        }
      },
      quests: {
        type: "[Quest]",
        resolve: async (source: any, args: any, context: any) => {
          const allQuests = await getAllNodes(context, "Quest")
          const mdxParent = await getParentNode(context, source);
          const worldName = extractWikilinkName(mdxParent?.frontmatter?.world)
          if (!worldName) return []
          return await asyncFilter(allQuests, async (quest: any) => {
            const questMdxParent = await getParentNode(context, quest)
            return extractWikilinkName(questMdxParent?.frontmatter?.world) === worldName
          })
        }
      }
    },
    Party: {
      campaigns: {
        type: "[Campaign]",
        resolve: async (source: any, args: any, context: any) => {
          const allCampaigns = await getAllNodes(context, "Campaign")

          return getCampaignFromParty(context, source.name, allCampaigns)
        },
      }
    },
    Session: {
      party: {
        type: "Party",
        resolve: async (source: any, args: any, context: any) => {
          const allCampaigns = await getAllNodes(context, "Campaign")
          const allParties = await getAllNodes(context, "Party")
          const mdxParent = await getParentNode(context, source)
          const campaignName = extractWikilinkName(mdxParent?.frontmatter?.campaign)
          const campaign = allCampaigns.find((c: any) => c.name === campaignName)
          if (!campaign) return null
          const campaignMdxParent = await getParentNode(context, campaign)
          const partyName = extractWikilinkName(campaignMdxParent?.frontmatter?.party)
          return allParties.find((party: any) => party.name === partyName) || null
        }
      },
      campaign: {
        type: "Campaign",
        resolve: async (source: any, args: any, context: any) => {
          const allCampaigns = await getAllNodes(context, "Campaign")
          const mdxParent = await getParentNode(context, source)
          const campaignName = extractWikilinkName(mdxParent?.frontmatter?.campaign)
          return allCampaigns.find((campaign: any) => campaign.name === campaignName) || null
        }
      },
      locations: {
        type: "[Location]",
        resolve: async (source: any, args: any, context: any) => {
          const allLocationNodes = await getAllLocationNodes(context)
          const mdxParent = await getParentNode(context, source)
          const locationRefs: string[] = Array.isArray(mdxParent?.frontmatter?.locations)
            ? mdxParent.frontmatter.locations.map((loc: any) => extractWikilinkName(loc))
            : mdxParent?.frontmatter?.location ? [extractWikilinkName(mdxParent.frontmatter.location)] : []
          return allLocationNodes.filter((loc: any) => locationRefs.includes(loc.name))
        }
      },
      npcs: {
        type: "[Npc]",
        resolve: async (source: any, args: any, context: any) => {
          const allNpcs = await getAllNodes(context, "Npc")
          const mdxParent = await getParentNode(context, source)
          const npcRefs: string[] = Array.isArray(mdxParent?.frontmatter?.npcs)
            ? mdxParent.frontmatter.npcs.map((npc: any) => extractWikilinkName(npc))
            : []
          return allNpcs.filter((npc: any) => npcRefs.includes(npc.name))
        }
      },
      quests: {
        type: "[Quest]",
        resolve: async (source: any, args: any, context: any) => {
          const allQuests = await getAllNodes(context, "Quest")
          const mdxParent = await getParentNode(context, source)
          const questRefs: string[] = Array.isArray(mdxParent?.frontmatter?.quests)
            ? mdxParent.frontmatter.quests.map((quest: any) => extractWikilinkName(quest))
            : []
          return allQuests.filter((quest: any) => questRefs.includes(quest.name))
        }
      }
    },
    World: {
      campaigns: {
        type: "[Campaign]",
        resolve: async (source: any, args: any, context: any) => {
          const allCampaigns = await getAllNodes(context, "Campaign")
          return await getCampaignFromWorld(context, source.name, allCampaigns)
        }
      },
      parentLocation: createParentLocationResolver(),
      childrenLocations: createChildrenLocationsResolver(),
      image: createImageResolver()
    },
    Npc: {
      image: createImageResolver(),
      campaigns: {
        type: "[Campaign]",
        resolve: async (source: any, args: any, context: any) => {
          const allCampaigns = await getAllNodes(context, "Campaign")
          const allLocationNodes = await getAllLocationNodes(context)
          const world = await getWorldFromLocation(context, source, allLocationNodes)
          const foundCampaign = await getCampaignFromWorld(context, world?.name, allCampaigns)
          const partyRefs: string[] = source.partyRefs || []
          if (!world && partyRefs.length === 0) return []
          return allCampaigns.filter((campaign: any) => campaign.name === foundCampaign[0]?.name || partyRefs.some((pr: string) => campaign.party === pr))
        }
      },
      location: {
        type: "Location",
        resolve: async (source: any, args: any, context: any) => {
          const allLocationNodes = await getAllLocationNodes(context)
          const mdxParent = await getParentNode(context, source)
          return allLocationNodes.find((loc: any) => loc.name === extractWikilinkName(mdxParent?.frontmatter?.location)) || null
        }
      },
      partyRelationships: {
        type: "[PartyRelationship]",
        resolve: async (source: any, args: any, context: any) => {
          const allParties = await getAllNodes(context, "Party")
          const mdxParent = await getParentNode(context, source)
          const relationships = mdxParent?.frontmatter?.partyRelationships || {}
          return Object.entries(relationships).map(([partyName, relationship]) => ({
            party: allParties.find((p: any) => p.name === partyName) || null,
            relationship: relationship as string
          })).filter((pr: any) => pr.party !== null)
        }
      }
    },
    Shop: {
      campaigns: createLocationCampaignsResolver(),
      parentLocation: createParentLocationResolver(),
      childrenLocations: createChildrenLocationsResolver(),
      image: createImageResolver()
    },
    Settlement: {
      campaigns: createLocationCampaignsResolver(),
      parentLocation: createParentLocationResolver(),
      childrenLocations: createChildrenLocationsResolver(),
      image: createImageResolver()
    },
    PointOfInterest: {
      campaigns: createLocationCampaignsResolver(),
      parentLocation: createParentLocationResolver(),
      childrenLocations: createChildrenLocationsResolver(),
      image: createImageResolver()
    },
    Region: {
      campaigns: createLocationCampaignsResolver(),
      parentLocation: createParentLocationResolver(),
      childrenLocations: createChildrenLocationsResolver(),
      image: createImageResolver()
    },
    Quest: {
      campaigns: {
        type: "[Campaign]",
        resolve: async (source: any, args: any, context: any) => {
          const allCampaigns = await getAllNodes(context, "Campaign")
          const mdxParent = await getParentNode(context, source)
          return await getCampaignFromWorld(context, extractWikilinkName(mdxParent?.frontmatter?.world), allCampaigns)
        }
      },
      world: {
        type: "World",
        resolve: async (source: any, args: any, context: any) => {
          const allWorlds = await getAllNodes(context, "World");
          const mdxParent = await getParentNode(context, source);
          return allWorlds.find((world: any) => world.name === extractWikilinkName(mdxParent?.frontmatter?.world)) || null;
        }
      },
      parties: {
        type: "[QuestParties]",
        resolve: async (source: any, args: any, context: any) => {
          const allParties = await getAllNodes(context, "Party");
          const mdxParent = await getParentNode(context, source);
          const finalMap: Record<string, { active: boolean, completed: boolean }> = {}
          const activeMap: Record<string, boolean> = mdxParent?.frontmatter?.active || {}
          const completedMap: Record<string, boolean> = mdxParent?.frontmatter?.completed || {}
          Object.keys(activeMap).forEach(partyName => {
            finalMap[partyName] = { active: activeMap[partyName], completed: completedMap[partyName] || false }
          })
          return Object.entries(finalMap).map(([partyName, status]) => ({
            party: allParties.find((p: any) => p.name === partyName) || null,
            active: status.active,
            completed: status.completed
          })).filter((pp: any) => pp.party !== null)
        }
      }
    },
    QuestStep: {
      completed: {
        type: "[QuestStepCompletion]",
        resolve: async (source: any, args: any, context: any) => {
          const allParties = await getAllNodes(context, "Party")
          const completedMap: Record<string, boolean> = source.completed || {}
          return Object.entries(completedMap).map(([partyName, completed]) => ({
            party: allParties.find((p: any) => p.name === partyName) || null,
            completed: !!completed
          })).filter((c: any) => c.party !== null)
        }
      }
    }
  })
}

export default createResolvers;