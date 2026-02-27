import type { GatsbyNode } from "gatsby";

const createSchemaCustomization: GatsbyNode["createSchemaCustomization"] =
  ({ actions }) => {
    actions.createTypes(`
      type MdxFields {
        entityType: String
        slug: String
        worldRef: String
        partyRef: [String]
        locationRef: String
      }

      type Entity implements Node {
        fields: MdxFields
        frontmatter: MdxFrontmatter
      }

      type MdxFrontmatter {
        tags: [String]
        aliases: [String]
        cssclasses: [String]
        date: Date @dateformat
        summary: String
        party: String
        race: String
        gender: String
        alignment: String
        condition: String
        personality: String
        ideal: String
        bond: String
        flaw: String
        likes: String
        dislikes: String
        location: String
        pronounced: String
        terrain: String
        government: String
        campaign: String
      }
    `);
  };

export default createSchemaCustomization;