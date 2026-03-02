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
      }

      type Session implements Node {
        fields: SessionFields
      }

      type World implements Node {
        fields: WorldFields
      }

      type NPC implements Node {
        fields: NPCFields
      }

      type Location implements Node {
        fields: LocationFields
      }

      type Quest implements Node {
        fields: QuestFields
      }
    `);
  };

export default createSchemaCustomization;