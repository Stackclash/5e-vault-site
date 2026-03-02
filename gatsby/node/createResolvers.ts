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
          const allCampaigns = getAllNodes(context, "Campaign")

          return getCampaignFromParty(source.fields?.name, allCampaigns)
        },
      }
    },
    Session: {
      campaign: {
        type: "Campaign",
        resolve: async (source: any, args: any, context: any) => {
          const allCampaigns = getAllNodes(context, "Campaign")
          return getCampaignFromParty(source.fields?.party, allCampaigns)[0] || null
        }
      }
    },
    World: {
      campaigns: {
        type: "[Campaign]",
        resolve: async (source: any, args: any, context: any) => {
          const allCampaigns = getAllNodes(context, "Campaign")
          return allCampaigns.filter((campaign: any) => campaign.fields?.world === source.fields?.name)
        }
      }
    },
    NPC: {
      campaigns: {
        type: "[Campaign]",
        resolve: async (source: any, args: any, context: any) => {
          const allCampaigns = getAllNodes(context, "Campaign")
          const allWorlds = getAllNodes(context, "World")
          const allLocations = getAllNodes(context, "Location")
          const world = getWorldFromLocation(source, [...allWorlds, ...allLocations])
          const partyRefs = source.fields?.partyRefs || []
          if (!world && partyRefs.length === 0) return []
          return allCampaigns.filter((campaign: any) => campaign.fields?.world === world || partyRefs.some((pr: string) => campaign.fields?.party === pr))
        }
      }
    },
    Location: {
      campaigns: {
        type: "[Campaign]",
        resolve: async (source: any, args: any, context: any) => {
          const allCampaigns = getAllNodes(context, "Campaign")
          const allWorlds = getAllNodes(context, "World")
          const allLocations = getAllNodes(context, "Location")
          const world = getWorldFromLocation(source, [...allWorlds, ...allLocations])
          if (!world) return []
          return allCampaigns.filter((campaign: any) => campaign.fields?.world === world)
        }
      }
    },
    Quest: {
      campaigns: {
        type: "[Campaign]",
        resolve: async (source: any, args: any, context: any) => {
          const allCampaigns = getAllNodes(context, "Campaign")
          return allCampaigns.filter((campaign: any) => campaign.fields?.world === source.fields?.world)
        }
      }
    }
  })
}

export default createResolvers;