import React from "react";
import { graphql, PageProps } from "gatsby";
import { Layout } from "../components/layout";
import { Seo } from "../components/seo";
import { HeroSection } from "../components/hero-section";
import { CampaignOverview } from "../components/campaign-overview";
import { HomePreviewSections } from "../components/home-preview-sections";

export default function IndexPage({ data }: PageProps<Queries.CampaignDetailQuery>) {
  const campaign = data.campaign;
  const locations = (data.locations?.nodes ?? []) as any[];
  const npcs = (data.npcs?.nodes ?? []) as any[];
  const sessions = (data.sessions?.nodes ?? []) as any[];
  const quests = (data.quests?.nodes ?? []) as any[];

  return (
    <Layout title={campaign?.name ?? ""} baseSlug={campaign?.slug ?? ""}>
      <HeroSection
        title={campaign?.name ?? ""}
        counts={{
          sessions: sessions.length,
          locations: locations.length,
          npcs: npcs.length,
          quests: quests.length,
        }}
      />
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
  campaign: campaign(id: {eq: $id}) {
    name
    slug
  }
  locations: allLocation(filter: {campaigns: {elemMatch: {id: {eq: $id}}}}) {
    nodes {
      name
      internal {
        type
      }
    }
  }
  npcs: allNpc(filter: {campaigns: {elemMatch: {id: {eq: $id}}}}) {
    nodes {
      name
    }
  }
  sessions: allSession(filter: {campaign: {id: {eq: $id}}} sort: {sessionDate: DESC}) {
    nodes {
      name
      summary
      sessionDate
      sessionNumber
    }
  }
  quests: allQuest(filter: {campaigns: {elemMatch: {id: {eq: $id}}}}) {
    nodes {
      name
      description
    }
  }
}
`;