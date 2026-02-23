import React from "react";
import { graphql, PageProps, Link } from "gatsby";
import { BookOpen } from "lucide-react";
import { Layout } from "../components/layout";
import { Seo } from "../components/seo";
import { PageHeader } from "../components/page-header";

interface CampaignLoreContext {
  campaignSlug: string;
  partyName: string;
  worldName: string | null;
  ids: string[];
}

export default function CampaignLorePage({
  data,
  pageContext,
}: PageProps<Queries.CampaignLorePageQuery, CampaignLoreContext>) {
  const { campaignSlug, worldName } = pageContext;
  const entries = data.allMarkdownRemark.nodes;

  return (
    <Layout campaignSlug={campaignSlug}>
      <PageHeader
        breadcrumbs={[
          { label: "Campaign", href: `/${campaignSlug}/` },
          { label: "Lore & Quests", href: `/${campaignSlug}/lore` },
        ]}
        subtitle={worldName ? `World of ${worldName}` : "World Knowledge"}
        title="Lore & Quests"
        icon={BookOpen}
        description="Quests, world lore, and other campaign knowledge discovered by the party."
      />
      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {entries.map((entry: any) => {
              const name = entry.parent?.name ?? "Unknown";
              const slug = entry.fields?.slug ?? "";
              const description = entry.excerpt;
              return (
                <Link
                  key={slug}
                  to={`/${campaignSlug}/lore/${slug}`}
                  className="group flex flex-col rounded-lg border border-border/50 bg-card p-6 transition-colors hover:border-primary/30"
                >
                  <span className="mb-3 inline-flex self-start rounded-sm border border-primary/30 bg-primary/10 px-2 py-0.5 font-serif text-xs tracking-wider uppercase text-primary">
                    Quest
                  </span>
                  <h3 className="mb-3 font-serif text-xl font-bold tracking-wide text-foreground">
                    {name}
                  </h3>
                  <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {typeof description === "string" ? description : ""}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
}

export function Head(_: PageProps<Queries.CampaignLorePageQuery, CampaignLoreContext>) {
  return <Seo title="Lore & Quests" description="Quests and world lore discovered by the party." />;
}

export const query = graphql`
  query CampaignLorePage($ids: [String!]) {
    allMarkdownRemark(filter: { id: { in: $ids } }) {
      nodes {
        fields { slug }
        frontmatter { tags }
        parent { ... on File { name } }
        excerpt(pruneLength: 200)
      }
    }
  }
`;
