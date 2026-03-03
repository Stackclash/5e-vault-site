import type { GatsbyNode } from "gatsby";
import { asyncFilter, extractWikilinkName, getAllDescendantLocations, getAllNodes, getCampaignFromParty, getCampaignFromWorld, getParentNode, getWorldFromLocation } from "../utils"
import { resolve } from "node:dns";

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
          const mdxParent = await getParentNode(context, source);
          return await asyncFilter(allSessions, async (session: any) => {
            const sessionMdxParent = await getParentNode(context, session)
            return extractWikilinkName(sessionMdxParent?.frontmatter?.party) === extractWikilinkName(mdxParent?.frontmatter?.party)
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
            return npcWorld?.name === worldName || (partyName && npcMdxParent?.frontmatter?.partyRelationships[partyName])
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
          const allParties = await getAllNodes(context, "Party");
          const mdxParent = await getParentNode(context, source);
          return allParties.find((party: any) => party.name === extractWikilinkName(mdxParent?.frontmatter?.party)) || null;
        }
      },
      campaign: {
        type: "Campaign",
        resolve: async (source: any, args: any, context: any) => {
          const allCampaigns = await getAllNodes(context, "Campaign")
          const mdxParent = await getParentNode(context, source)
          return (await getCampaignFromParty(context, extractWikilinkName(mdxParent?.frontmatter?.party), allCampaigns))[0] || null
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
      childrenLocations: createChildrenLocationsResolver()
    },
    Npc: {
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
      childrenLocations: createChildrenLocationsResolver()
    },
    Settlement: {
      campaigns: createLocationCampaignsResolver(),
      parentLocation: createParentLocationResolver(),
      childrenLocations: createChildrenLocationsResolver()
    },
    PointOfInterest: {
      campaigns: createLocationCampaignsResolver(),
      parentLocation: createParentLocationResolver(),
      childrenLocations: createChildrenLocationsResolver()
    },
    Region: {
      campaigns: createLocationCampaignsResolver(),
      parentLocation: createParentLocationResolver(),
      childrenLocations: createChildrenLocationsResolver()
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
    }
  })
}

export default createResolvers;