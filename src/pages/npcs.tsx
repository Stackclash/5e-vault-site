import React from "react";
import { graphql, Link, PageProps } from "gatsby";
import { Users, User } from "lucide-react";
import { Layout } from "../components/layout";
import { Seo } from "../components/seo";
import { PageHeader } from "../components/page-header";
import { EntityImage } from "../components/entity-image";

export default function NpcsPage({ data }: PageProps<Queries.NpcsListQuery>) {
  const npcs = data.npcs.nodes;

  return (
    <Layout title="NPCs">
      <PageHeader
        breadcrumbs={[{ label: "NPCs", href: "/npcs" }]}
        subtitle="Allies & Contacts"
        title="Non-Player Characters"
        icon={Users}
        description="Everyone the party has met on their travels."
      />

      <section className="mx-auto max-w-7xl px-6 pb-24">
        {npcs.length === 0 ? (
          <p className="text-muted-foreground">No NPCs recorded yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {npcs.map((npc) => {
              const occupation = (npc.occupation ?? []).filter(Boolean).join(", ");
              const meta = [npc.race, occupation].filter(Boolean).join(" · ");
              return (
                <Link
                  key={npc.slug}
                  to={`/npcs/${npc.slug}`}
                  className="group flex flex-col overflow-hidden rounded-lg border border-border/50 bg-card transition-colors hover:border-primary/30"
                >
                  <div className="aspect-[3/4] overflow-hidden">
                    <EntityImage image={npc.image} alt={npc.name} icon={User} />
                  </div>
                  <div className="p-5">
                    {meta && (
                      <p className="mb-1 text-xs tracking-wider uppercase text-muted-foreground">{meta}</p>
                    )}
                    <h3 className="font-serif text-lg font-bold tracking-wide text-foreground">{npc.name}</h3>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </Layout>
  );
}

export function Head() {
  return <Seo title="NPCs" />;
}

export const query = graphql`
  query NpcsList {
    npcs: allNpc(sort: { name: ASC }) {
      nodes {
        name
        slug
        race
        occupation
        image {
          childImageSharp {
            gatsbyImageData(width: 400, aspectRatio: 0.75, placeholder: BLURRED, transformOptions: { cropFocus: NORTH })
          }
        }
      }
    }
  }
`;
