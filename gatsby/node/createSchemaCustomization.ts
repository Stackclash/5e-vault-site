import type { GatsbyNode } from "gatsby";

const createSchemaCustomization: GatsbyNode["createSchemaCustomization"] =
  ({ actions }) => {
    actions.createTypes(`
      type Campaign implements Node {
        name: String
        world: World
        party: Party
      }

      type Party implements Node {
        name: String
        campaigns: [Campaign]
      }

      type Session implements Node {
        name: String
        party: String
        sessionDate: Date @dateformat
        locations: [String]
        campaign: Campaign
      }

      type World implements Node {
        name: String
        campaigns: [Campaign]
      }

      type PartyRelationship {
        party: String
        relationship: String
      }

      type Npc implements Node {
        name: String
        location: Location
        partyRelationships: [PartyRelationship]
        parties: [Party]
        campaigns: [Campaign]
      }

      type Location implements Node {
        name: String
        parentLocation: Location
        campaigns: [Campaign]
      }

      type Quest implements Node {
        name: String
        world: String
        activeMap: String
        completedMap: String
        campaigns: [Campaign]
      }
    `);
  };

export default createSchemaCustomization;