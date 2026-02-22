import React from "react";
import { graphql, PageProps, Link } from "gatsby";
import { BookOpen, ArrowLeft } from "lucide-react";
import { Layout } from "../components/layout";
import { Seo } from "../components/seo";
import { PageHeader } from "../components/page-header";

export default function LoreDetail({ data }: PageProps<Queries.LoreDetailQuery>) {
  const node = data.markdownRemark;
  if (!node) return null;
  const name = (node.parent as any)?.name ?? "Unknown";
  const fm = node.frontmatter as any;
  const description = fm?.description ?? "";
  const steps = fm?.steps ?? [];
  const npcs = fm?.npcs ?? [];
  const active = fm?.active;
  const completed = fm?.completed;

  return (
    <Layout>
      <PageHeader
        breadcrumbs={[
          { label: "Lore & Quests", href: "/lore" },
          { label: name, href: `/lore/${node.fields?.slug}` },
        ]}
        subtitle="Quest"
        title={name}
        icon={BookOpen}
      />
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6">
          {/* Status & Description */}
          <div className="mb-8 flex flex-wrap items-center gap-3">
            {active !== undefined && (
              <span className={`rounded-sm px-3 py-1 font-serif text-xs tracking-wider uppercase ${active ? "border border-green-500/30 bg-green-500/10 text-green-400" : "border border-border/50 bg-card text-muted-foreground"}`}>
                {active ? "Active" : "Inactive"}
              </span>
            )}
            {completed !== undefined && (
              <span className={`rounded-sm px-3 py-1 font-serif text-xs tracking-wider uppercase ${completed ? "border border-primary/30 bg-primary/10 text-primary" : "border border-border/50 bg-card text-muted-foreground"}`}>
                {completed ? "Completed" : "In Progress"}
              </span>
            )}
          </div>

          {description && (
            <div className="mb-8 rounded-lg border border-primary/20 bg-primary/5 p-6">
              <h2 className="mb-2 font-serif text-sm font-semibold tracking-wider uppercase text-primary">Description</h2>
              <p className="text-sm leading-relaxed text-foreground">{description}</p>
            </div>
          )}

          {/* Steps */}
          {Array.isArray(steps) && steps.length > 0 && (
            <div className="mb-8 rounded-lg border border-border/50 bg-card p-6">
              <h2 className="mb-4 font-serif text-lg font-bold tracking-wide text-foreground">Quest Steps</h2>
              <ol className="list-inside list-decimal space-y-2">
                {steps.map((step: string, i: number) => (
                  <li key={i} className="text-sm leading-relaxed text-foreground">{step}</li>
                ))}
              </ol>
            </div>
          )}

          {/* Related NPCs */}
          {Array.isArray(npcs) && npcs.length > 0 && (
            <div className="mb-8 rounded-lg border border-border/50 bg-card p-6">
              <h2 className="mb-4 font-serif text-lg font-bold tracking-wide text-foreground">Related NPCs</h2>
              <div className="flex flex-wrap gap-2">
                {npcs.map((npc: string) => (
                  <span key={npc} className="rounded-sm border border-border/50 bg-background px-3 py-1 text-sm text-foreground">{npc}</span>
                ))}
              </div>
            </div>
          )}

          {/* Content */}
          <div className="prose prose-invert max-w-none mb-12" dangerouslySetInnerHTML={{ __html: node.html ?? "" }} />

          <Link to="/lore" className="inline-flex items-center gap-2 font-serif text-sm tracking-wider uppercase text-primary transition-colors hover:text-primary/80">
            <ArrowLeft className="h-4 w-4" />
            Back to All Lore
          </Link>
        </div>
      </section>
    </Layout>
  );
}

export function Head({ data }: PageProps<Queries.LoreDetailQuery>) {
  const name = (data.markdownRemark?.parent as any)?.name ?? "";
  return <Seo title={`${name} | Lore & Quests`} />;
}

export const query = graphql`
  query LoreDetail($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      fields { slug }
      frontmatter { description steps npcs active completed campaign tags }
      parent { ... on File { name } }
    }
  }
`;
