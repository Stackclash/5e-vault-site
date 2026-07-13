import React from "react";
import { graphql, Link, PageProps } from "gatsby";
import { MapPin, User, Landmark } from "lucide-react";
import { Layout } from "../components/layout";
import { Seo } from "../components/seo";
import { PageHeader } from "../components/page-header";
import { EntityImage } from "../components/entity-image";
import { locationTypeLabel } from "../lib/labels";

function Prose({ heading, text }: { heading: string; text?: string | null }) {
  if (!text) return null;
  return (
    <div className="mb-10">
      <h2 className="mb-4 font-serif text-2xl font-bold tracking-wide text-foreground">{heading}</h2>
      <div className="max-w-3xl whitespace-pre-line leading-relaxed text-muted-foreground">{text}</div>
    </div>
  );
}

export default function LocationDetail({ data }: PageProps<Queries.LocationDetailQuery>) {
  const location = data.location;
  if (!location) return null;

  const typeLabel = locationTypeLabel(location.internal.type);
  const children = (location.childrenLocations ?? []).filter(Boolean);
  const parent = location.parentLocation;
  const npcsHere = (data.npcs?.nodes ?? []).filter(
    (npc) => npc.location?.slug === location.slug,
  );

  const breadcrumbs = [{ label: "Locations", href: "/locations" }];
  if (parent) breadcrumbs.push({ label: parent.name, href: `/locations/${parent.slug}` });

  return (
    <Layout title="Locations">
      <PageHeader
        breadcrumbs={breadcrumbs}
        subtitle={typeLabel}
        title={location.name}
        icon={MapPin}
        description={location.summary ?? undefined}
      />

      <section className="mx-auto max-w-7xl px-6 pb-24">
        {(location.image || location.overview || location.history) && (
          <div className="mb-12 grid gap-10 md:grid-cols-[1fr_minmax(0,360px)]">
            <div>
              <Prose heading="Overview" text={location.overview} />
              <Prose heading="History" text={location.history} />
            </div>
            <div className="order-first h-fit overflow-hidden rounded-lg border border-border/50 md:order-last">
              <div className="aspect-[4/3]">
                <EntityImage image={location.image} alt={location.name} icon={MapPin} />
              </div>
            </div>
          </div>
        )}

        {/* Sub-locations */}
        {children.length > 0 && (
          <div className="mb-16">
            <h2 className="mb-6 font-serif text-2xl font-bold tracking-wide text-foreground">
              Places Within
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {children.map((child) => (
                <Link
                  key={child!.slug}
                  to={`/locations/${child!.slug}`}
                  className="group rounded-lg border border-border/50 bg-card p-5 transition-colors hover:border-primary/30"
                >
                  <p className="mb-1 flex items-center gap-1.5 text-xs tracking-wider uppercase text-muted-foreground">
                    <Landmark className="h-3 w-3" />
                    {locationTypeLabel(child!.internal.type)}
                  </p>
                  <h3 className="font-serif text-lg font-bold tracking-wide text-foreground">
                    {child!.name}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* NPCs at this location */}
        {npcsHere.length > 0 && (
          <div>
            <h2 className="mb-6 font-serif text-2xl font-bold tracking-wide text-foreground">
              Notable Figures
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {npcsHere.map((npc) => (
                <Link
                  key={npc.slug}
                  to={`/npcs/${npc.slug}`}
                  className="group flex items-center gap-2 rounded-lg border border-border/50 bg-card p-5 transition-colors hover:border-primary/30"
                >
                  <User className="h-4 w-4 text-primary/60" />
                  <h3 className="font-serif text-lg font-bold tracking-wide text-foreground">
                    {npc.name}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </Layout>
  );
}

export function Head({ data }: PageProps<Queries.LocationDetailQuery>) {
  return <Seo title={data.location?.name} />;
}

export const query = graphql`
  query LocationDetail($id: String!) {
    location(id: { eq: $id }) {
      name
      slug
      summary
      overview
      history
      internal {
        type
      }
      parentLocation {
        name
        slug
      }
      childrenLocations {
        name
        slug
        internal {
          type
        }
      }
      image {
        childImageSharp {
          gatsbyImageData(width: 720, aspectRatio: 1.333, placeholder: BLURRED)
        }
      }
    }
    npcs: allNpc {
      nodes {
        name
        slug
        location {
          slug
        }
      }
    }
  }
`;
