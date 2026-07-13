import React from "react";
import { graphql, Link, PageProps } from "gatsby";
import { User, MapPin } from "lucide-react";
import { Layout } from "../components/layout";
import { Seo } from "../components/seo";
import { PageHeader } from "../components/page-header";
import { EntityImage } from "../components/entity-image";

function Attribute({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-0.5 border-b border-border/40 py-2">
      <span className="text-xs tracking-wider uppercase text-muted-foreground">{label}</span>
      <span className="text-foreground">{value}</span>
    </div>
  );
}

function TraitCard({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="rounded-lg border border-border/50 bg-card p-6">
      <h3 className="mb-2 font-serif text-sm tracking-widest uppercase text-primary">{label}</h3>
      <p className="leading-relaxed text-muted-foreground whitespace-pre-line">{value}</p>
    </div>
  );
}

export default function NpcDetail({ data }: PageProps<Queries.NpcDetailQuery>) {
  const npc = data.npc;
  if (!npc) return null;

  const occupation = (npc.occupation ?? []).filter(Boolean).join(", ");
  const aliases = (npc.aliases ?? []).filter(Boolean).join(", ");
  const relationship = npc.partyRelationships?.find((r) => r?.relationship)?.relationship;
  const location = npc.location;

  return (
    <Layout title="NPCs">
      <PageHeader
        breadcrumbs={[{ label: "NPCs", href: "/npcs" }]}
        subtitle={occupation || "Non-Player Character"}
        title={npc.name}
        icon={User}
      />

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid gap-10 md:grid-cols-[minmax(0,320px)_1fr]">
          {/* Portrait + quick facts */}
          <div className="flex flex-col gap-6">
            <div className="aspect-[3/4] overflow-hidden rounded-lg border border-border/50">
              <EntityImage image={npc.image} alt={npc.name} icon={User} />
            </div>

            {relationship && (
              <div className="rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-center">
                <p className="text-xs tracking-widest uppercase text-primary/80">Party Relationship</p>
                <p className="font-serif text-lg text-primary">{relationship}</p>
              </div>
            )}

            <div className="rounded-lg border border-border/50 bg-card p-5">
              <Attribute label="Race" value={npc.race} />
              <Attribute label="Gender" value={npc.gender} />
              <Attribute label="Age" value={npc.age != null ? String(npc.age) : null} />
              <Attribute label="Alignment" value={npc.alignment} />
              <Attribute label="Condition" value={npc.condition} />
              <Attribute label="Occupation" value={occupation} />
              <Attribute label="Also Known As" value={aliases} />
            </div>

            {location && (
              <Link
                to={`/locations/${location.slug}`}
                className="flex items-center gap-2 rounded-lg border border-border/50 bg-card px-4 py-3 text-sm text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
              >
                <MapPin className="h-4 w-4" />
                {location.name}
              </Link>
            )}
          </div>

          {/* Character traits */}
          <div className="flex flex-col gap-6">
            <TraitCard label="What the Party Knows" value={npc.playerImpression} />
            <TraitCard label="Personality" value={npc.personality} />
            <TraitCard label="Ideal" value={npc.ideal} />
            <TraitCard label="Bond" value={npc.bond} />
            <TraitCard label="Flaw" value={npc.flaw} />
            <TraitCard label="Goals" value={npc.goals} />
            <div className="grid gap-6 sm:grid-cols-2">
              <TraitCard label="Likes" value={npc.likes} />
              <TraitCard label="Dislikes" value={npc.dislikes} />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export function Head({ data }: PageProps<Queries.NpcDetailQuery>) {
  return <Seo title={data.npc?.name} />;
}

export const query = graphql`
  query NpcDetail($id: String!) {
    npc(id: { eq: $id }) {
      name
      race
      gender
      age
      alignment
      condition
      occupation
      personality
      ideal
      bond
      flaw
      goals
      likes
      dislikes
      aliases
      playerImpression
      partyRelationships {
        relationship
      }
      location {
        name
        slug
      }
      image {
        childImageSharp {
          gatsbyImageData(width: 640, aspectRatio: 0.75, placeholder: BLURRED, transformOptions: { cropFocus: NORTH })
        }
      }
    }
  }
`;
