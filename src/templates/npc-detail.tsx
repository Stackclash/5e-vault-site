import React from "react";
import { graphql, PageProps, Link } from "gatsby";
import { Users, ArrowLeft } from "lucide-react";
import { Layout } from "../components/layout";
import { Seo } from "../components/seo";
import { PageHeader } from "../components/page-header";

export default function NpcDetail({ data, children }: PageProps<Queries.NpcDetailQuery>) {
  const node = data.mdx;
  if (!node) return null;
  const name = (node.parent as any)?.name ?? "Unknown";
  const fm = node.frontmatter as any;
  const race = fm?.race ?? "";
  const alignment = fm?.alignment ?? "";
  const displayRace = typeof race === "string" && race.includes("|") ? race.split("|")[0].replace(/\[\[.*?\//, "").trim() : race;
  const metaFields = [
    { label: "Race", value: displayRace },
    { label: "Gender", value: fm?.gender },
    { label: "Alignment", value: alignment },
    { label: "Condition", value: fm?.condition },
  ].filter((f) => f.value);

  const traitFields = [
    { label: "Personality", value: fm?.personality },
    { label: "Ideal", value: fm?.ideal },
    { label: "Bond", value: fm?.bond },
    { label: "Flaw", value: fm?.flaw },
  ].filter((f) => f.value);

  return (
    <Layout>
      <PageHeader
        breadcrumbs={[
          { label: "NPCs", href: "/npcs" },
          { label: name, href: `/npcs/${node.fields?.slug}` },
        ]}
        subtitle={displayRace ? `${displayRace}${alignment ? ` · ${alignment}` : ""}` : "NPC"}
        title={name}
        icon={Users}
      />
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6">
          {/* Metadata */}
          {metaFields.length > 0 && (
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {metaFields.map((f) => (
                <div key={f.label} className="rounded-lg border border-border/50 bg-card p-4">
                  <span className="font-serif text-xs font-semibold tracking-wider uppercase text-muted-foreground">{f.label}</span>
                  <p className="mt-1 text-foreground">{f.value}</p>
                </div>
              ))}
            </div>
          )}

          {/* Traits */}
          {traitFields.length > 0 && (
            <div className="mb-8 rounded-lg border border-border/50 bg-card p-6">
              <h2 className="mb-4 font-serif text-lg font-bold tracking-wide text-foreground">Character Traits</h2>
              <dl className="grid gap-4 sm:grid-cols-2">
                {traitFields.map((f) => (
                  <div key={f.label}>
                    <dt className="font-serif text-xs font-semibold tracking-wider uppercase text-muted-foreground">{f.label}</dt>
                    <dd className="mt-1 text-sm leading-relaxed text-foreground">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* Likes, Dislikes */}
          {(fm?.likes || fm?.dislikes) && (
            <div className="mb-8 grid gap-4 sm:grid-cols-2">
              {fm?.likes && (
                <div className="rounded-lg border border-border/50 bg-card p-4">
                  <span className="font-serif text-xs font-semibold tracking-wider uppercase text-muted-foreground">Likes</span>
                  <p className="mt-1 text-sm text-foreground">{Array.isArray(fm.likes) ? fm.likes.join(", ") : fm.likes}</p>
                </div>
              )}
              {fm?.dislikes && (
                <div className="rounded-lg border border-border/50 bg-card p-4">
                  <span className="font-serif text-xs font-semibold tracking-wider uppercase text-muted-foreground">Dislikes</span>
                  <p className="mt-1 text-sm text-foreground">{Array.isArray(fm.dislikes) ? fm.dislikes.join(", ") : fm.dislikes}</p>
                </div>
              )}
            </div>
          )}

          {/* Content */}
          <div className="prose prose-invert max-w-none mb-12">{children}</div>

          <Link to="/npcs" className="inline-flex items-center gap-2 font-serif text-sm tracking-wider uppercase text-primary transition-colors hover:text-primary/80">
            <ArrowLeft className="h-4 w-4" />
            Back to All NPCs
          </Link>
        </div>
      </section>
    </Layout>
  );
}

export function Head({ data }: PageProps<Queries.NpcDetailQuery>) {
  const name = (data.mdx?.parent as any)?.name ?? "";
  return <Seo title={`${name} | NPCs`} />;
}

export const query = graphql`
  query NpcDetail($id: String!) {
    mdx(id: { eq: $id }) {
      fields { slug }
      frontmatter {
        race gender alignment condition
        personality ideal bond flaw
        likes dislikes location
        pronounced
      }
      parent { ... on File { name } }
    }
  }
`;
