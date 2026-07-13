import React from "react";
import { graphql, PageProps } from "gatsby";
import { Layout } from "../components/layout";
import { Seo } from "../components/seo";
import { HeroSection } from "../components/hero-section";
import { CampaignOverview } from "../components/campaign-overview";
import { HomePreviewSections } from "../components/home-preview-sections";
import { selectActiveQuests, type QuestWithParties } from "../lib/campaign";

export default function IndexPage({ data }: PageProps<Queries.HomePageQuery>) {
  const campaign = data.campaigns.nodes[0];
  const locations = (data.locations?.nodes ?? []) as any[];
  const npcs = (data.npcs?.nodes ?? []) as any[];
  const sessions = (data.sessions?.nodes ?? []) as any[];
  const quests = (data.quests?.nodes ?? []) as any[];

  const latestSession = sessions[0] ?? null;
  const activeQuests = selectActiveQuests(quests as QuestWithParties[]);

  return (
    <Layout title={campaign?.name ?? ""}>
      <HeroSection
        title={campaign?.name ?? ""}
        tagline={campaign?.publicPremise ?? undefined}
        counts={{
          sessions: sessions.length,
          locations: locations.length,
          npcs: npcs.length,
          quests: quests.length,
        }}
      />
      <CampaignOverview latestSession={latestSession} activeQuests={activeQuests} />
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
  query HomePage {
    campaigns: allCampaign {
      nodes {
        name
        slug
        publicPremise
      }
    }
    locations: allLocation {
      nodes {
        name
        slug
        summary
        internal {
          type
        }
      }
    }
    npcs: allNpc {
      nodes {
        name
        slug
        race
        occupation
      }
    }
    sessions: allSession(sort: { sessionDate: DESC }) {
      nodes {
        name
        slug
        summary
        sessionDate
        sessionNumber
      }
    }
    quests: allQuest {
      nodes {
        name
        slug
        description
        playerSummary
        parties {
          active
          completed
        }
      }
    }
  }
`;
