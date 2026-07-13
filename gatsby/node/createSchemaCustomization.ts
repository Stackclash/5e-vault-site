import type { GatsbyNode } from "gatsby";

const createSchemaCustomization: GatsbyNode["createSchemaCustomization"] =
  ({ actions }) => {
    actions.createTypes(`
      type Campaign implements Node {
        name: String!
        slug: String!
        world: World
        party: Party
        sessions: [Session!]
        locations: [Location!]
        publicPremise: String
      }

      type Party implements Node {
        name: String!
        slug: String!
        campaigns: [Campaign]
      }

      type Session implements Node {
        name: String!
        slug: String!
        summary: String
        party: Party
        sessionDate: Date @dateformat
        sessionNumber: Int
        locations: [Location]
        campaign: Campaign
        partyPresent: [String]
        npcs: [Npc]
        quests: [Quest]
        items: [String]
      }

      interface Location implements Node {
        id: ID!
        name: String!
        slug: String!
        parentLocation: Location
        childrenLocations: [Location]
        campaigns: [Campaign]
        summary: String
        overview: String
        history: String
        images: [String]
        image: File
      }

      type World implements Node & Location {
        name: String!
        slug: String!
        parentLocation: Location
        childrenLocations: [Location]
        campaigns: [Campaign]
        summary: String
        overview: String
        history: String
        images: [String]
        image: File
      }

      type Shop implements Node & Location {
        name: String!
        slug: String!
        parentLocation: Location
        childrenLocations: [Location]
        campaigns: [Campaign]
        summary: String
        overview: String
        history: String
        images: [String]
        image: File
      }

      type Settlement implements Node & Location {
        name: String!
        slug: String!
        parentLocation: Location
        childrenLocations: [Location]
        campaigns: [Campaign]
        summary: String
        overview: String
        history: String
        images: [String]
        image: File
        population: Int
        government: String
      }

      type PointOfInterest implements Node & Location {
        name: String!
        slug: String!
        parentLocation: Location
        childrenLocations: [Location]
        campaigns: [Campaign]
        summary: String
        overview: String
        history: String
        images: [String]
        image: File
      }

      type Region implements Node & Location {
        name: String!
        slug: String!
        parentLocation: Location
        childrenLocations: [Location]
        campaigns: [Campaign]
        summary: String
        overview: String
        history: String
        images: [String]
        image: File
        terrain: String
        climate: String
      }

      type PartyRelationship {
        party: Party
        relationship: String
      }

      type Npc implements Node {
        name: String!
        slug: String!
        location: Location
        partyRelationships: [PartyRelationship]
        campaigns: [Campaign]
        race: String
        gender: String
        age: Int
        alignment: String
        condition: String
        occupation: [String]
        personality: String
        ideal: String
        bond: String
        flaw: String
        goals: String
        likes: String
        dislikes: String
        aliases: [String]
        images: [String]
        image: File
        playerImpression: String
      }

      type QuestParties {
        party: Party
        active: Boolean
        completed: Boolean
      }

      type QuestStepCompletion {
        party: Party
        completed: Boolean
      }

      type QuestStep {
        text: String
        completed: [QuestStepCompletion]
      }

      type QuestNpc {
        name: String
        description: String
      }

      type Quest implements Node {
        name: String!
        slug: String!
        world: World
        description: String
        playerSummary: String
        campaigns: [Campaign]
        parties: [QuestParties]
        steps: [QuestStep]
        questNpcs: [QuestNpc]
      }
    `);
  };

export default createSchemaCustomization;