import type { GatsbyNode } from "gatsby";
import { extractWikilinkName, getAllNodes, getCampaignFromParty, getCampaignFromWorld, getParentNode, getWorldFromLocation } from "../utils"

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
      }
    },
    Npc: {
      campaigns: {
        type: "[Campaign]",
        resolve: async (source: any, args: any, context: any) => {
          // FIXME: Not Working
          const allCampaigns = await getAllNodes(context, "Campaign")
          const allWorlds = await getAllNodes(context, "World")
          const allLocations = await getAllNodes(context, "Location")
          const world = await getWorldFromLocation(context, source, [...allWorlds, ...allLocations])
          const foundCampaign = await getCampaignFromWorld(context, world?.name, allCampaigns)
          const partyRefs: string[] = source.partyRefs || []
          if (!world && partyRefs.length === 0) return []
          return allCampaigns.filter((campaign: any) => campaign.name === foundCampaign[0]?.name || partyRefs.some((pr: string) => campaign.party === pr))
        }
      },
      location: {
        type: "Location",
        resolve: async (source: any, args: any, context: any) => {
          const allLocations = await getAllNodes(context, "Location")
          const mdxParent = await getParentNode(context, source)
          return allLocations.find((location: any) => location.name === extractWikilinkName(mdxParent?.frontmatter?.location)) || null
        }
      }
    },
    Location: {
      campaigns: {
        type: "[Campaign]",
        resolve: async (source: any, args: any, context: any) => {
          const allCampaigns = await getAllNodes(context, "Campaign")
          const allWorlds = await getAllNodes(context, "World")
          const allLocations = await getAllNodes(context, "Location")
          const world = await getWorldFromLocation(context, source, [...allWorlds, ...allLocations])
          if (!world) return []
          return await getCampaignFromWorld(context, world.name, allCampaigns)
        }
      },
      parentLocation: {
        type: "Location",
        resolve: async (source: any, args: any, context: any) => {
          const allLocations = await getAllNodes(context, "Location")
          const mdxParent = await getParentNode(context, source)
          return allLocations.find((location: any) => location.name === extractWikilinkName(mdxParent?.frontmatter?.location)) || null
        }
      }
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