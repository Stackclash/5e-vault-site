import type { GatsbyNode } from "gatsby";
import { getAllNodes, getCampaignFromParty, getWorldFromLocation } from "../utils"

const createResolvers: GatsbyNode["createResolvers"] = ({
  createResolvers,
}) => {
  createResolvers({
    Party: {
      campaigns: {
        type: "[Campaign]",
        resolve: async (source: any, args: any, context: any) => {
          const allCampaigns = await getAllNodes(context, "Campaign")

          return getCampaignFromParty(source.name, allCampaigns)
        },
      }
    },
    Session: {
      campaign: {
        type: "Campaign",
        resolve: async (source: any, args: any, context: any) => {
          const allCampaigns = await getAllNodes(context, "Campaign")
          return getCampaignFromParty(source.party, allCampaigns)[0] || null
        }
      }
    },
    World: {
      campaigns: {
        type: "[Campaign]",
        resolve: async (source: any, args: any, context: any) => {
          const allCampaigns = await getAllNodes(context, "Campaign")
          return allCampaigns.filter((campaign: any) => campaign.world === source.name)
        }
      }
    },
    NPC: {
      campaigns: {
        type: "[Campaign]",
        resolve: async (source: any, args: any, context: any) => {
          const allCampaigns = await getAllNodes(context, "Campaign")
          const allWorlds = await getAllNodes(context, "World")
          const allLocations = await getAllNodes(context, "Location")
          const world = getWorldFromLocation(source, [...allWorlds, ...allLocations])
          const partyRefs = source.partyRefs || []
          if (!world && partyRefs.length === 0) return []
          return allCampaigns.filter((campaign: any) => campaign.world === world || partyRefs.some((pr: string) => campaign.party === pr))
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
          const world = getWorldFromLocation(source, [...allWorlds, ...allLocations])
          if (!world) return []
          return allCampaigns.filter((campaign: any) => campaign.world === world)
        }
      }
    },
    Quest: {
      campaigns: {
        type: "[Campaign]",
        resolve: async (source: any, args: any, context: any) => {
          const allCampaigns = await getAllNodes(context, "Campaign")
          return allCampaigns.filter((campaign: any) => campaign.world === source.world)
        }
      }
    }
  })
}

export default createResolvers;