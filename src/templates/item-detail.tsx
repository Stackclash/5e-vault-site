import React from "react";
import { graphql, PageProps, Link } from "gatsby";
import { Gem, ArrowLeft } from "lucide-react";
import { Layout } from "../components/layout";
import { Seo } from "../components/seo";
import { PageHeader } from "../components/page-header";

export default function ItemDetail({ data, children }: PageProps<Queries.ItemDetailQuery>) {
  const node = data.mdx;
  if (!node) return null;
  const fileName = (node.parent as any)?.name ?? "Unknown";
  const fm = node.frontmatter as any;
  const aliases = fm?.aliases ?? [];
  const displayName = Array.isArray(aliases) && aliases.length > 0 ? aliases[0] : fileName;
  const tags = fm?.tags ?? [];

  return (
    <Layout>
      <PageHeader
        breadcrumbs={[
          { label: "Items", href: "/items" },
          { label: displayName, href: `/items/${node.fields?.slug}` },
        ]}
        subtitle="Item"
        title={displayName}
        icon={Gem}
      />
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6">
          {/* Tags */}
          {Array.isArray(tags) && tags.length > 0 && (
            <div className="mb-8 flex flex-wrap gap-2">
              {tags.map((tag: string) => (
                <span key={tag} className="rounded-sm border border-border/50 bg-card px-3 py-1 text-xs tracking-wider uppercase text-muted-foreground">{tag}</span>
              ))}
            </div>
          )}

          {/* Content */}
          <div className="prose prose-invert max-w-none mb-12">{children}</div>

          <Link to="/items" className="inline-flex items-center gap-2 font-serif text-sm tracking-wider uppercase text-primary transition-colors hover:text-primary/80">
            <ArrowLeft className="h-4 w-4" />
            Back to All Items
          </Link>
        </div>
      </section>
    </Layout>
  );
}

export function Head({ data }: PageProps<Queries.ItemDetailQuery>) {
  const fm = data.mdx?.frontmatter as any;
  const fileName = (data.mdx?.parent as any)?.name ?? "";
  const aliases = fm?.aliases ?? [];
  const displayName = Array.isArray(aliases) && aliases.length > 0 ? aliases[0] : fileName;
  return <Seo title={`${displayName} | Items`} />;
}

export const query = graphql`
  query ItemDetail($id: String!) {
    mdx(id: { eq: $id }) {
      fields { slug }
      frontmatter { cssclasses tags aliases }
      parent { ... on File { name } }
    }
  }
`;
