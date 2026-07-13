import React from "react";
import { graphql, Link, PageProps } from "gatsby";
import { MapPin } from "lucide-react";
import { Layout } from "../components/layout";
import { Seo } from "../components/seo";
import { PageHeader } from "../components/page-header";
import { EntityImage } from "../components/entity-image";
import { locationTypeLabel } from "../lib/labels";

// Display order for the type groupings, broad → specific.
const TYPE_ORDER = ["World", "Region", "Settlement", "PointOfInterest", "Shop"];

type LocationNode = Queries.LocationsListQuery["locations"]["nodes"][number];

export default function LocationsPage({ data }: PageProps<Queries.LocationsListQuery>) {
  const locations = data.locations.nodes;

  const groups = TYPE_ORDER.map((type) => ({
    type,
    label: locationTypeLabel(type),
    nodes: locations.filter((loc) => loc.internal.type === type),
  })).filter((g) => g.nodes.length > 0);

  return (
    <Layout title="Locations">
      <PageHeader
        breadcrumbs={[{ label: "Locations", href: "/locations" }]}
        subtitle="The Known World"
        title="Locations"
        icon={MapPin}
        description="Regions, settlements, and places of interest the party has explored."
      />

      <section className="mx-auto max-w-7xl px-6 pb-24">
        {groups.length === 0 ? (
          <p className="text-muted-foreground">No locations recorded yet.</p>
        ) : (
          groups.map((group) => (
            <div key={group.type} className="mb-16 last:mb-0">
              <h2 className="mb-6 font-serif text-2xl font-bold tracking-wide text-foreground">
                {group.label}
                <span className="ml-2 text-sm font-normal text-muted-foreground">({group.nodes.length})</span>
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {group.nodes.map((loc) => (
                  <LocationCard key={loc.slug} loc={loc} />
                ))}
              </div>
            </div>
          ))
        )}
      </section>
    </Layout>
  );
}

function LocationCard({ loc }: { loc: LocationNode }) {
  return (
    <Link
      to={`/locations/${loc.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border/50 bg-card transition-colors hover:border-primary/30"
    >
      <div className="aspect-[16/9] overflow-hidden">
        <EntityImage image={loc.image} alt={loc.name} icon={MapPin} />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="mb-1 text-xs tracking-wider uppercase text-muted-foreground">
          {locationTypeLabel(loc.internal.type)}
        </p>
        <h3 className="mb-2 font-serif text-lg font-bold tracking-wide text-foreground">{loc.name}</h3>
        {(loc.summary || loc.overview) && (
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{loc.summary || loc.overview}</p>
        )}
      </div>
    </Link>
  );
}

export function Head() {
  return <Seo title="Locations" />;
}

export const query = graphql`
  query LocationsList {
    locations: allLocation(sort: { name: ASC }) {
      nodes {
        name
        slug
        summary
        overview
        internal {
          type
        }
        image {
          childImageSharp {
            gatsbyImageData(width: 480, aspectRatio: 1.777, placeholder: BLURRED)
          }
        }
      }
    }
  }
`;
