import type { GatsbyNode } from "gatsby";
import { findWorldRootFromNode } from "../utils"

const createResolvers: GatsbyNode["createResolvers"] = ({
  createResolvers,
}) => {
  createResolvers({
    Mdx: {
      // Reverse: World → Campaigns that reference this world
      campaigns: {
        type: "[Campaign]",
        resolve: async (source: any, args: any, context: any) => {
          const { entries: campaignEntries } = await context.nodeModel.findAll({
            type: "Campaign",
            query: {
              filter: {
                fields: { entityType: { eq: "campaign" } },
              },
            },
          })
          const allCampaigns = Array.from(campaignEntries)
          let relatedCampaigns = []

          if (source.fields?.entityType === "location") {
            const { entries: locationEntries } = await context.nodeModel.findAll({
              type: "Location",
              query: {
                filter: {
                  fields: {
                    entityType: { eq: "location" },
                  },
                },
              },
            })
            const allLocations = Array.from(locationEntries)

            const { entries: worldEntries } = await context.nodeModel.findAll({
              type: "World",
              query: {
                filter: {
                  fields: { entityType: { eq: "world" } },
                },
              },
            })
            const allWorlds = Array.from(worldEntries)

            const parentWorldName = findWorldRootFromNode(source, [...allLocations, ...allWorlds])
            if (!parentWorldName) return null
            relatedCampaigns = allCampaigns.filter((campaign: any) =>
              campaign.fields?.world === parentWorldName
            )
          } else {
            relatedCampaigns = allCampaigns.filter((campaign: any) => {
              if (source.fields?.party) {
                return campaign.fields?.party?.some((party: string) =>
                  source.fields?.party?.includes(party)
                )
              }
              if (source.fields?.world) {
                return campaign.fields?.world === source.fields?.world
              }
              if (campaign.fields?.world === source.fields?.name || campaign.fields?.party?.includes(source.fields?.name)) {
                return true
              }
              return false
            })
          }

          return relatedCampaigns
        },
      },
      // Reverse: World → Top-level locations
      locations: {
        type: "[Location]",
        resolve: async (source: any, _args: any, context: any) => {
          if (source.fields?.entityType !== "world") return null
          
          // Fetch all locations
          const { entries: locationEntries } = await context.nodeModel.findAll({
            type: "Location",
            query: {
              filter: {
                fields: { entityType: { eq: "location" } },
              },
            },
          })
          const allLocations = Array.from(locationEntries)
          
          // Fetch all worlds to include in the lookup map
          const { entries: worldEntries } = await context.nodeModel.findAll({
            type: "World",
            query: {
              filter: {
                fields: { entityType: { eq: "world" } },
              },
            },
          })
          const allWorlds = Array.from(worldEntries)
          
          // Combine locations and worlds for parent lookup
          const allNodes = [...allLocations, ...allWorlds]
          
          // Find locations that belong to this world
          return allLocations.filter((loc: any) => {
            return findWorldRootFromNode(loc, allNodes) === source.fields?.name
          })
        },
      },
      // Reverse: Location → Child locations
      children: {
        type: "[Location]",
        resolve: async (source: any, _args: any, context: any) => {
          if (source.fields?.entityType !== "location") return null
          const { entries } = await context.nodeModel.findAll({
            type: "Location",
            query: {
              filter: {
                fields: {
                  entityType: { eq: "location" },
                  locationRef: { eq: source.fields?.name },
                },
              },
            },
          })
          return Array.from(entries)
        },
      },
      // Reverse: Location → NPCs at this location
      npcs: {
        type: "[NPC]",
        resolve: async (source: any, _args: any, context: any) => {
          if (source.fields?.entityType !== "location") return null
          const { entries } = await context.nodeModel.findAll({
            type: "NPC",
            query: {
              filter: {
                fields: {
                  entityType: { eq: "npc" },
                  locationRef: { eq: source.fields?.name },
                },
              },
            },
          })
          return Array.from(entries)
        },
      },
      // Reverse: Party → Sessions
      sessions: {
        type: "[Session]",
        resolve: async (source: any, _args: any, context: any) => {
          if (source.fields?.entityType !== "party") return null
          const { entries } = await context.nodeModel.findAll({
            type: "Session",
            query: {
              filter: {
                fields: { entityType: { eq: "session" } },
              },
            },
          })
          const allSessions = Array.from(entries)
          return allSessions.filter((session: any) =>
            session.fields?.partyRef?.includes(source.fields?.name)
          )
        },
      },
    },
  })
}

export default createResolvers;