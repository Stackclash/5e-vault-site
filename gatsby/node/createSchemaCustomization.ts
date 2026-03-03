import type { GatsbyNode } from "gatsby";

const createSchemaCustomization: GatsbyNode["createSchemaCustomization"] =
  ({ actions }) => {
    actions.createTypes(`
      type Campaign implements Node {
        name: String!
        slug: String!
        world: World!
        party: Party!
        sessions: [Session!]
        locations: [Location!]
      }

      type Party implements Node {
        name: String!
        slug: String!
        campaigns: [Campaign]
      }

      type Session implements Node {
        name: String!
        slug: String!
        party: String
        sessionDate: Date @dateformat
        locations: [String]
        campaign: Campaign
      }

      interface Location implements Node {
        id: ID!
        name: String!
        slug: String!
        parentLocation: Location
        campaigns: [Campaign]
      }

      type World implements Node & Location {
        name: String!
        slug: String!
        parentLocation: Location
        campaigns: [Campaign]
      }

      type Shop implements Node & Location {
        name: String!
        slug: String!
        parentLocation: Location
        campaigns: [Campaign]
      }

      type Settlement implements Node & Location {
        name: String!
        slug: String!
        parentLocation: Location
        campaigns: [Campaign]
        population: Int
        government: String
      }

      type PointOfInterest implements Node & Location {
        name: String!
        slug: String!
        parentLocation: Location
        campaigns: [Campaign]
      }

      type Region implements Node & Location {
        name: String!
        slug: String!
        parentLocation: Location
        campaigns: [Campaign]
        terrain: String
        climate: String
      }

      type PartyRelationship {
        party: String
        relationship: String
      }

      type Npc implements Node {
        name: String!
        slug: String!
        location: Location
        partyRelationships: [PartyRelationship]
        parties: [Party]
        campaigns: [Campaign]
      }

      type Quest implements Node {
        name: String!
        slug: String!
        world: String
        activeMap: String
        completedMap: String
        campaigns: [Campaign]
      }
    `);
  };

export default createSchemaCustomization;