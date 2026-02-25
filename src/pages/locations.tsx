import React from "react";
import { graphql, PageProps, Link } from "gatsby";
import { MapPin } from "lucide-react";
import { Layout } from "../components/layout";
import { Seo } from "../components/seo";
import { PageHeader } from "../components/page-header";

function getLocationType(tags: string[]): string {
  if (tags.includes("settlement")) return "Settlement";
  if (tags.includes("region")) return "Region";
  return "Place of Interest";
}

export default function LocationsPage({ data }: PageProps<Queries.LocationsPageQuery>) {
  const locations = data.allMdx.nodes;
  return (
    <Layout>
      <PageHeader
        breadcrumbs={[{ label: "Locations", href: "/locations" }]}
        subtitle="Known Regions"
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
                <Link key={slug} to={`/locations/${slug}`} className="group flex flex-col rounded-lg border border-border/50 bg-card p-6 transition-colors hover:border-primary/30">
                  <p className="mb-1 text-xs tracking-wider uppercase text-muted-foreground">{getLocationType(tags)}</p>
                  <h3 className="mb-2 font-serif text-xl font-bold tracking-wide text-foreground">{name}</h3>
                  <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">{loc.excerpt}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
}

export function Head() {
  return <Seo title="Locations" description="Explore all known regions and landmarks." />;
}

export const query = graphql`
  query LocationsPage {
    allMdx(
      filter: { fields: { entityType: { eq: "locations" } } }
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
