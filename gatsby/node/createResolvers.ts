import type { GatsbyNode } from "gatsby";
import { asyncFilter, extractWikilinkName, getAllNodes, getCampaignFromParty, getCampaignFromWorld, getParentNode, getWorldFromLocation } from "../utils"

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

const createResolvers: GatsbyNode["createResolvers"] = ({
  createResolvers,
}) => {
  createResolvers({
    // TODO: Needs: NPCs, Quests, and specific location types (Shop, Settlement, PointOfInterest, Region)
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
          return await asyncFilter(allLocationNodes, async (loc: any) => {
            const locWorld = await getWorldFromLocation(context, loc, allLocationNodes)
            return locWorld?.name === worldName
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
      campaign: {
        type: "Campaign",
        resolve: async (source: any, args: any, context: any) => {
          const allCampaigns = await getAllNodes(context, "Campaign")
          const mdxParent = await getParentNode(context, source)
          return (await getCampaignFromParty(context, extractWikilinkName(mdxParent?.frontmatter?.party), allCampaigns))[0] || null
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
      parentLocation: createParentLocationResolver()
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
      }
    },
    Shop: {
      campaigns: createLocationCampaignsResolver(),
      parentLocation: createParentLocationResolver()
    },
    Settlement: {
      campaigns: createLocationCampaignsResolver(),
      parentLocation: createParentLocationResolver()
    },
    PointOfInterest: {
      campaigns: createLocationCampaignsResolver(),
      parentLocation: createParentLocationResolver()
    },
    Region: {
      campaigns: createLocationCampaignsResolver(),
      parentLocation: createParentLocationResolver()
    },
    Quest: {
      campaigns: {
        type: "[Campaign]",
        resolve: async (source: any, args: any, context: any) => {
          const allCampaigns = await getAllNodes(context, "Campaign")
          const mdxParent = await getParentNode(context, source)
          return await getCampaignFromWorld(context, extractWikilinkName(mdxParent?.frontmatter?.world), allCampaigns)
        }
      }
    }
  })
}

export default createResolvers;