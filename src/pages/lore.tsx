import React from "react";
import { graphql, PageProps, Link } from "gatsby";
import { BookOpen } from "lucide-react";
import { Layout } from "../components/layout";
import { Seo } from "../components/seo";
import { PageHeader } from "../components/page-header";

export default function LorePage({ data }: PageProps<Queries.LorePageQuery>) {
  const entries = data.allMarkdownRemark.nodes;
  return (
    <Layout>
      <PageHeader
        breadcrumbs={[{ label: "Lore & Quests", href: "/lore" }]}
        subtitle="World Knowledge"
        title="Lore & Quests"
        icon={BookOpen}
        description="Quests, world lore, and other campaign knowledge discovered by the party."
      />
      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {entries.map((entry: any) => {
              const name = entry.parent?.name ?? "Unknown";
              const slug = entry.fields?.slug ?? "";
              const description = entry.excerpt;
              return (
                <Link key={slug} to={`/lore/${slug}`} className="group flex flex-col rounded-lg border border-border/50 bg-card p-6 transition-colors hover:border-primary/30">
                  <span className="mb-3 inline-flex self-start rounded-sm border border-primary/30 bg-primary/10 px-2 py-0.5 font-serif text-xs tracking-wider uppercase text-primary">Quest</span>
                  <h3 className="mb-3 font-serif text-xl font-bold tracking-wide text-foreground">{name}</h3>
                  <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">{typeof description === "string" ? description : ""}</p>
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
  return <Seo title="Lore & Quests" description="Quests and world lore discovered by the party." />;
}

export const query = graphql`
  query LorePage {
    allMarkdownRemark(
      filter: { fields: { entityType: { eq: "lore" } } }
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
