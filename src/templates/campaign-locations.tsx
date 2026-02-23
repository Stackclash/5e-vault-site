import React from "react";
import { graphql, PageProps, Link } from "gatsby";
import { MapPin } from "lucide-react";
import { Layout } from "../components/layout";
import { Seo } from "../components/seo";
import { PageHeader } from "../components/page-header";

interface CampaignLocationsContext {
  campaignSlug: string;
  partyName: string;
  worldName: string | null;
  ids: string[];
}

function getLocationType(tags: string[]): string {
  if (tags.includes("settlement")) return "Settlement";
  if (tags.includes("region")) return "Region";
  return "Place of Interest";
}

export default function CampaignLocationsPage({
  data,
  pageContext,
}: PageProps<Queries.CampaignLocationsPageQuery, CampaignLocationsContext>) {
  const { campaignSlug, worldName } = pageContext;
  const locations = data.allMarkdownRemark.nodes;

  return (
    <Layout campaignSlug={campaignSlug}>
      <PageHeader
        breadcrumbs={[
          { label: "Campaign", href: `/${campaignSlug}/` },
          { label: "Locations", href: `/${campaignSlug}/locations` },
        ]}
        subtitle={worldName ? `World of ${worldName}` : "Known Regions"}
        title="Locations"
        icon={MapPin}
        description="All known regions, towns, and landmarks discovered throughout the campaign."
      />
      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {locations.map((loc: any) => {
              const name = loc.parent?.name ?? "Unknown";
              const slug = loc.fields?.slug ?? "";
              const tags = loc.frontmatter?.tags ?? [];
              return (
                <Link
                  key={slug}
                  to={`/${campaignSlug}/locations/${slug}`}
                  className="group flex flex-col rounded-lg border border-border/50 bg-card p-6 transition-colors hover:border-primary/30"
                >
                  <p className="mb-1 text-xs tracking-wider uppercase text-muted-foreground">
                    {getLocationType(tags)}
                  </p>
                  <h3 className="mb-2 font-serif text-xl font-bold tracking-wide text-foreground">
                    {name}
                  </h3>
                  <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {loc.excerpt}
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

export function Head(_: PageProps<Queries.CampaignLocationsPageQuery, CampaignLocationsContext>) {
  return <Seo title="Locations" description="Explore all known regions and landmarks." />;
}

export const query = graphql`
  query CampaignLocationsPage($ids: [String!]) {
    allMarkdownRemark(
      filter: { id: { in: $ids } }
      sort: { frontmatter: { tags: ASC } }
    ) {
      nodes {
        fields { slug }
        frontmatter { tags }
        parent { ... on File { name } }
        excerpt(pruneLength: 200)
      }
    }
  }
`;
