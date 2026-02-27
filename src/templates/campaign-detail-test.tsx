import React from "react";
import { graphql, PageProps, Link } from "gatsby";
import { Shield, MapPin, Users, Scroll, BookOpen } from "lucide-react";
import { Layout } from "../components/layout";
import { Seo } from "../components/seo";
import { PageHeader } from "../components/page-header";

interface CampaignDetailContext {
  id: string;
  campaignSlug: string;
  partyName: string;
  worldName: string | null;
  locationCount: number;
  sessionCount: number;
  npcCount: number;
  questCount: number;
}

export default function CampaignDetail({
  data,
  pageContext,
  children,
}: PageProps<Queries.CampaignDetailQuery, CampaignDetailContext>) {
  const node = data.mdx;
  const { campaignSlug, partyName, worldName, locationCount, sessionCount, npcCount, questCount } =
    pageContext;
  const name = (node?.parent as any)?.name ?? campaignSlug;

  const sections = [
    {
      label: "Locations",
      href: `/${campaignSlug}/locations`,
      icon: MapPin,
      count: locationCount,
      description: "Explore all known regions and landmarks in this world.",
    },
    {
      label: "NPCs",
      href: `/${campaignSlug}/npcs`,
      icon: Users,
      count: npcCount,
      description: "Notable characters encountered by the party.",
    },
    {
      label: "Sessions",
      href: `/${campaignSlug}/sessions`,
      icon: Scroll,
      count: sessionCount,
      description: "A chronological record of every session played.",
    },
    {
      label: "Lore & Quests",
      href: `/${campaignSlug}/lore`,
      icon: BookOpen,
      count: questCount,
      description: "Quests and world lore discovered by the party.",
    },
  ];

  return (
    <Layout campaignSlug={campaignSlug}>
      <PageHeader
        breadcrumbs={[{ label: name, href: `/${campaignSlug}/` }]}
        subtitle="Campaign Compendium"
        title={name}
        icon={Shield}
        description={
          [partyName && `Party: ${partyName}`, worldName && `World: ${worldName}`]
            .filter(Boolean)
            .join(" · ") || undefined
        }
      />
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div
              className="prose prose-invert mx-auto mb-16 max-w-3xl"
          >{children}</div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {sections.map(({ label, href, icon: Icon, count, description }) => (
              <Link
                key={href}
                to={href}
                className="group flex flex-col rounded-lg border border-border/50 bg-card p-6 transition-colors hover:border-primary/30"
              >
                <Icon className="mb-4 h-6 w-6 text-accent" />
                <h3 className="mb-1 font-serif text-xl font-bold tracking-wide text-foreground">
                  {label}
                </h3>
                <p className="mb-3 text-xs text-muted-foreground">{count} entries</p>
                <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}

export function Head({ data, pageContext }: PageProps<Queries.CampaignDetailQuery, CampaignDetailContext>) {
  const name = (data.mdx?.parent as any)?.name ?? pageContext.campaignSlug;
  return <Seo title={name} description={`Campaign compendium for ${name}.`} />;
}

export const query = graphql`
  query CampaignDetail($id: String!) {
    mdx(id: { eq: $id }) {
      parent { ... on File { name } }
    }
  }
`;