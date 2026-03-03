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

      interface LocationNode @nodeInterface {
        id: ID!
        name: String
        parentLocation: LocationNode
        campaigns: [Campaign]
      }

      type World implements Node & LocationNode {
        name: String
        parentLocation: LocationNode
        campaigns: [Campaign]
      }

      type Shop implements Node & LocationNode {
        name: String
        parentLocation: LocationNode
        campaigns: [Campaign]
      }

      type Settlement implements Node & LocationNode {
        name: String
        parentLocation: LocationNode
        campaigns: [Campaign]
        population: Int
        government: String
      }

      type PointOfInterest implements Node & LocationNode {
        name: String
        parentLocation: LocationNode
        campaigns: [Campaign]
      }

      type Region implements Node & LocationNode {
        name: String
        parentLocation: LocationNode
        campaigns: [Campaign]
        terrain: String
        climate: String
      }

      type PartyRelationship {
        party: String
        relationship: String
      }

      type Npc implements Node {
        name: String
        location: LocationNode
        partyRelationships: [PartyRelationship]
        parties: [Party]
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