import React from "react";
import { graphql, PageProps } from "gatsby";
import { Layout } from "../components/layout";
import { Seo } from "../components/seo";
import { HeroSection } from "../components/hero-section";
import { CampaignOverview } from "../components/campaign-overview";
import { HomePreviewSections } from "../components/home-preview-sections";

export default function IndexPage({ data }: PageProps<Queries.CampaignDetailQuery>) {
  const locations = (data.locations?.nodes ?? []) as any[];
  const npcs = (data.npcs?.nodes ?? []) as any[];
  const sessions = (data.sessions?.nodes ?? []) as any[];
  const quests = (data.quests?.nodes ?? []) as any[];

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
        quests={quests}
      />
    </Layout>
  );
}

export function Head() {
  return <Seo />;
}

export const query = graphql`
  query CampaignDetail($id: String!) {
    locations: allMdx(
      filter: {
        fields: {
          entityType: { eq: "location" }
          campaigns: { in: [$id] }
        }
      }
      limit: 3
    ) {
      nodes {
        fields { slug entityType }
        campaigns
        frontmatter { tags }
        parent { ... on File { name } }
        excerpt(pruneLength: 160)
      }
    }
    npcs: allMdx(
      filter: {
        fields: {
          entityType: { eq: "npc" }
          campaigns: { in: [$id] }
        }
      }
      limit: 4
    ) {
      nodes {
        fields { slug entityType }
        campaigns
        frontmatter { tags race alignment }
        parent { ... on File { name } }
        excerpt(pruneLength: 160)
      }
    }
    sessions: allMdx(
      filter: {
        fields: {
          entityType: { eq: "session" }
          campaigns: { in: [$id] }
        }
      }
      limit: 3
      sort: { frontmatter: { date: DESC } }
    ) {
      nodes {
        fields { slug entityType }
        campaigns
        frontmatter { tags date summary }
        parent { ... on File { name } }
        excerpt(pruneLength: 200)
      }
    }
    quests: allMdx(
      filter: {
        fields: {
          entityType: { eq: "quest" }
          campaigns: { in: [$id] }
        }
      }
      limit: 3
    ) {
      nodes {
        fields { slug entityType }
        campaigns
        frontmatter { tags }
        parent { ... on File { name } }
        excerpt(pruneLength: 200)
      }
    }
  }
`;
