import path from "path";
import type { GatsbyNode } from "gatsby";
import { entities } from "./src/entity-config";
import type { EntityConfig } from "./src/entity-config";

function matchesEntity(
  config: EntityConfig,
  tags: string[],
  relativePath: string,
): boolean {
  const tagMatch = config.includeTag.some((t) => tags.includes(t));
  const pathMatch = config.includePath.some((p) => relativePath.startsWith(p));

  if (!tagMatch && !pathMatch) return false;

  if (config.excludeTag?.some((t) => tags.includes(t))) return false;
  if (config.excludePath?.some((p) => relativePath.startsWith(p))) return false;

  return true;
}

export const onCreateNode: GatsbyNode["onCreateNode"] = ({
  node,
  actions,
  getNode,
}) => {
  const { createNodeField } = actions;

  if (node.internal.type !== "MarkdownRemark") return;

  const frontmatter = node.frontmatter as Record<string, unknown> | undefined;
  const rawTags = frontmatter?.tags;
  const tags: string[] = Array.isArray(rawTags)
    ? (rawTags as string[])
    : typeof rawTags === "string"
      ? [rawTags]
      : [];

  const parent = node.parent ? getNode(node.parent) : undefined;
  const relativePath = (parent?.relativePath as string) ?? "";

  for (const [entityType, config] of Object.entries(entities)) {
    if (!matchesEntity(config, tags, relativePath)) continue;
    if (config.filter && !config.filter(frontmatter ?? {})) continue;

    const fileName = (parent?.name as string) ?? "";
    const slug = fileName.toLowerCase().replace(/\s+/g, "-");

    createNodeField({ node, name: "entityType", value: entityType });
    createNodeField({ node, name: "slug", value: slug });
    return;
  }
};

export const createSchemaCustomization: GatsbyNode["createSchemaCustomization"] =
  ({ actions }) => {
    actions.createTypes(`
      type MarkdownRemarkFields {
        entityType: String
        slug: String
      }

      type MarkdownRemark implements Node {
        fields: MarkdownRemarkFields
        frontmatter: MarkdownRemarkFrontmatter
      }

      type MarkdownRemarkFrontmatter {
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

interface MarkdownQueryResult {
  allMarkdownRemark: {
    nodes: Array<{
      id: string;
      fields: {
        entityType: string;
        slug: string;
      };
    }>;
  };
}

export const createPages: GatsbyNode["createPages"] = async ({
  graphql,
  actions,
  reporter,
}) => {
  const { createPage } = actions;

  for (const entityType of Object.keys(entities)) {
    const result = await graphql<MarkdownQueryResult>(`
      {
        allMarkdownRemark(
          filter: { fields: { entityType: { eq: "${entityType}" } } }
        ) {
          nodes {
            id
            fields {
              entityType
              slug
            }
          }
        }
      }
    `);

    if (result.errors) {
      reporter.panicOnBuild(
        `Error querying ${entityType} pages`,
        result.errors as Error,
      );
      return;
    }

    const nodes = result.data?.allMarkdownRemark.nodes ?? [];

    nodes.forEach((node) => {
      createPage({
        path: `/${entityType}/${node.fields.slug}`,
        component: path.resolve(
          `./src/templates/${entityType}-detail.tsx`,
        ),
        context: {
          id: node.id,
        },
      });
    });
  }
};
