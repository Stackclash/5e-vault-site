import type { GatsbyNode } from "gatsby";

const createSchemaCustomization: GatsbyNode["createSchemaCustomization"] =
  ({ actions }) => {
    actions.createTypes(`
      type CampaignFields {
        name: String
        entityType: String
        world: String
        party: String
      }

      type PartyFields {
        name: String
        entityType: String
      }

      type SessionFields {
        name: String
        entityType: String
        party: String
        sessionDate: Date @dateformat
        locations: [String]
      }

      type WorldFields {
        name: String
        entityType: String
      }

      type NPCFields {
        name: String
        entityType: String
        location: String
        partyRelationships: [String]
        partyRefs: [String]
      }

      type LocationFields {
        name: String
        entityType: String
        parentLocation: String
      }

      type QuestFields {
        name: String
        entityType: String
        world: String
        activeMap: String
        completedMap: String
      }

      type Campaign implements Node {
        fields: CampaignFields
      }

      type Party implements Node {
        fields: PartyFields
        campaigns: [Campaign]
      }

      type Session implements Node {
        fields: SessionFields
        campaign: Campaign
      }

      type World implements Node {
        fields: WorldFields
        campaigns: [Campaign]
      }

      type NPC implements Node {
        fields: NPCFields
        campaigns: [Campaign]
      }

      type Location implements Node {
        fields: LocationFields
        campaigns: [Campaign]
      }

      type Quest implements Node {
        fields: QuestFields
        campaigns: [Campaign]
      }
    `);
  };

export default createSchemaCustomization;