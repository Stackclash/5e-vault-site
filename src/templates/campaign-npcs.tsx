import React from "react";
import { graphql, PageProps, Link } from "gatsby";
import { Users } from "lucide-react";
import { Layout } from "../components/layout";
import { Seo } from "../components/seo";
import { PageHeader } from "../components/page-header";

interface CampaignNpcsContext {
  campaignSlug: string;
  partyName: string;
  worldName: string | null;
  ids: string[];
}

export default function CampaignNpcsPage({
  data,
  pageContext,
}: PageProps<Queries.CampaignNpcsPageQuery, CampaignNpcsContext>) {
  const { campaignSlug, partyName } = pageContext;
  const npcs = data.allMarkdownRemark.nodes;

  return (
    <Layout campaignSlug={campaignSlug}>
      <PageHeader
        breadcrumbs={[
          { label: "Campaign", href: `/${campaignSlug}/` },
          { label: "NPCs", href: `/${campaignSlug}/npcs` },
        ]}
        subtitle="Allies & Contacts"
        title="Notable NPCs"
        icon={Users}
        description={
          partyName
            ? `Characters encountered by ${partyName}.`
            : "All notable characters encountered throughout the campaign."
        }
      />
      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {npcs.map((npc: any) => {
              const name = npc.parent?.name ?? "Unknown";
              const slug = npc.fields?.slug ?? "";
              const race = npc.frontmatter?.race ?? "";
              const alignment = npc.frontmatter?.alignment ?? "";
              const displayRace =
                typeof race === "string" && race.includes("|")
                  ? race.split("|")[0].replace(/\[\[.*?\//, "").trim()
                  : race;
              return (
                <Link
                  key={slug}
                  to={`/${campaignSlug}/npcs/${slug}`}
                  className="group flex flex-col overflow-hidden rounded-lg border border-border/50 bg-card transition-colors hover:border-primary/30"
                >
                  <div className="p-5">
                    <p className="mb-1 text-xs tracking-wider uppercase text-muted-foreground">
                      {displayRace}
                      {alignment ? ` · ${alignment}` : ""}
                    </p>
                    <h3 className="mb-1 font-serif text-lg font-bold tracking-wide text-foreground">
                      {name}
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
}

export function Head(_: PageProps<Queries.CampaignNpcsPageQuery, CampaignNpcsContext>) {
  return <Seo title="NPCs" description="All notable characters encountered throughout the campaign." />;
}

export const query = graphql`
  query CampaignNpcsPage($ids: [String!]) {
    allMarkdownRemark(filter: { id: { in: $ids } }) {
      nodes {
        fields { slug }
        frontmatter { race alignment }
        parent { ... on File { name } }
      }
    }
  }
`;
