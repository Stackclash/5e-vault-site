import React from "react";
import { graphql, PageProps } from "gatsby";
import { Layout } from "../components/layout";
import { Seo } from "../components/seo";
import { HeroSection } from "../components/hero-section";
import { CampaignOverview } from "../components/campaign-overview";
import { HomePreviewSections } from "../components/home-preview-sections";

export default function IndexPage({ data }: PageProps<Queries.IndexPageQuery>) {
  const locations = (data.locations?.nodes ?? []) as any[];
  const npcs = (data.npcs?.nodes ?? []) as any[];
  const sessions = (data.sessions?.nodes ?? []) as any[];
  const items = (data.items?.nodes ?? []) as any[];
  const lore = (data.lore?.nodes ?? []) as any[];

  return (
    <Layout>
      <HeroSection />
      <CampaignOverview />
      <div className="mx-auto max-w-7xl px-6">
        <div className="h-px bg-border/30" />
      </div>
      <HomePreviewSections
        locations={locations}
        npcs={npcs}
        sessions={sessions}
        items={items}
        lore={lore}
      />
    </Layout>
  );
}

export function Head() {
  return <Seo />;
}

export const query = graphql`
  query IndexPage {
    locations: allMarkdownRemark(
      filter: { fields: { entityType: { eq: "locations" } } }
      limit: 3
    ) {
      nodes {
        fields { slug entityType }
        frontmatter { tags }
        parent { ... on File { name } }
        excerpt(pruneLength: 160)
      }
    }
    npcs: allMarkdownRemark(
      filter: { fields: { entityType: { eq: "npcs" } } }
      limit: 4
    ) {
      nodes {
        fields { slug entityType }
        frontmatter { tags race alignment occupation aliases }
        parent { ... on File { name } }
        excerpt(pruneLength: 160)
      }
    }
    sessions: allMarkdownRemark(
      filter: { fields: { entityType: { eq: "sessions" } } }
      limit: 3
      sort: { frontmatter: { date: DESC } }
    ) {
      nodes {
        fields { slug entityType }
        frontmatter { tags date summary }
        parent { ... on File { name } }
        excerpt(pruneLength: 200)
      }
    }
    items: allMarkdownRemark(
      filter: { fields: { entityType: { eq: "items" } } }
      limit: 3
    ) {
      nodes {
        fields { slug entityType }
        frontmatter { tags aliases }
        parent { ... on File { name } }
        excerpt(pruneLength: 160)
      }
    }
    lore: allMarkdownRemark(
      filter: { fields: { entityType: { eq: "lore" } } }
      limit: 3
    ) {
      nodes {
        fields { slug entityType }
        frontmatter { tags description }
        parent { ... on File { name } }
        excerpt(pruneLength: 200)
      }
    }
  }
`;
