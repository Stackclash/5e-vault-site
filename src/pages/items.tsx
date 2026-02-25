import React from "react";
import { graphql, PageProps, Link } from "gatsby";
import { Gem } from "lucide-react";
import { Layout } from "../components/layout";
import { Seo } from "../components/seo";
import { PageHeader } from "../components/page-header";

export default function ItemsPage({ data }: PageProps<Queries.ItemsPageQuery>) {
  const items = data.allMdx.nodes;
  return (
    <Layout>
      <PageHeader
        breadcrumbs={[{ label: "Items", href: "/items" }]}
        subtitle="Party Inventory"
        title="Notable Items"
        icon={Gem}
        description="Weapons, armor, potions, and other notable items collected throughout the campaign."
      />
      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item: any) => {
              const name = item.parent?.name ?? "Unknown";
              const slug = item.fields?.slug ?? "";
              const aliases = item.frontmatter?.aliases;
              const displayName = Array.isArray(aliases) && aliases.length > 0 ? aliases[0] : name;
              return (
                <Link key={slug} to={`/items/${slug}`} className="group flex flex-col overflow-hidden rounded-lg border border-border/50 bg-card transition-colors hover:border-primary/30">
                  <div className="p-5">
                    <p className="mb-1 text-xs tracking-wider uppercase text-muted-foreground">Item</p>
                    <h3 className="mb-2 font-serif text-lg font-bold tracking-wide text-foreground">{displayName}</h3>
                    <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{item.excerpt}</p>
                  </div>
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
  return <Seo title="Items" description="Notable items collected throughout the campaign." />;
}

export const query = graphql`
  query ItemsPage {
    allMdx(
      filter: { fields: { entityType: { eq: "items" } } }
    ) {
      nodes {
        fields { slug }
        frontmatter { aliases tags }
        parent { ... on File { name } }
        excerpt(pruneLength: 160)
      }
    }
  }
`;
