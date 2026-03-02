import type { GatsbyNode } from "gatsby";

const createSchemaCustomization: GatsbyNode["createSchemaCustomization"] =
  ({ actions }) => {
    actions.createTypes(`
      type Campaign implements Node {
        name: String
        entityType: String
        world: String
        party: String
      }

      type Party implements Node {
        name: String
        entityType: String
        campaigns: [Campaign]
      }

      type Session implements Node {
        name: String
        entityType: String
        party: String
        sessionDate: Date @dateformat
        locations: [String]
        campaign: Campaign
      }

      type World implements Node {
        name: String
        entityType: String
        campaigns: [Campaign]
      }

      type NPC implements Node {
        name: String
        entityType: String
        location: String
        partyRelationships: [String]
        partyRefs: [String]
        campaigns: [Campaign]
      }

      type Location implements Node {
        name: String
        entityType: String
        parentLocation: String
        campaigns: [Campaign]
      }

      type Quest implements Node {
        name: String
        entityType: String
        world: String
        activeMap: String
        completedMap: String
        campaigns: [Campaign]
      }
    `);
  };

export default createSchemaCustomization;