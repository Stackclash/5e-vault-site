import React from "react";
import { graphql, PageProps, Link } from "gatsby";
import { MapPin, ArrowLeft } from "lucide-react";
import { Layout } from "../components/layout";
import { Seo } from "../components/seo";
import { PageHeader } from "../components/page-header";

export default function LocationDetail({ data }: PageProps<Queries.LocationDetailQuery>) {
  const node = data.markdownRemark;
  if (!node) return null;
  const name = (node.parent as any)?.name ?? "Unknown";
  const fm = node.frontmatter as any;
  const tags = fm?.tags ?? [];
  const locType = tags.includes("settlement") ? "Settlement" : tags.includes("region") ? "Region" : "Place of Interest";

  return (
    <Layout>
      <PageHeader
        breadcrumbs={[
          { label: "Locations", href: "/locations" },
          { label: name, href: `/locations/${node.fields?.slug}` },
        ]}
        subtitle={locType}
        title={name}
        icon={MapPin}
      />
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6">
          {/* Metadata */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {fm?.terrain && (
              <div className="rounded-lg border border-border/50 bg-card p-4">
                <span className="font-serif text-xs font-semibold tracking-wider uppercase text-muted-foreground">Terrain</span>
                <p className="mt-1 text-foreground">{fm.terrain}</p>
              </div>
            )}
            {fm?.government && (
              <div className="rounded-lg border border-border/50 bg-card p-4">
                <span className="font-serif text-xs font-semibold tracking-wider uppercase text-muted-foreground">Government</span>
                <p className="mt-1 text-foreground">{fm.government}</p>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="prose prose-invert max-w-none mb-12" dangerouslySetInnerHTML={{ __html: node.html ?? "" }} />

          <Link to="/locations" className="inline-flex items-center gap-2 font-serif text-sm tracking-wider uppercase text-primary transition-colors hover:text-primary/80">
            <ArrowLeft className="h-4 w-4" />
            Back to All Locations
          </Link>
        </div>
      </section>
    </Layout>
  );
}

export function Head({ data }: PageProps<Queries.LocationDetailQuery>) {
  const name = (data.markdownRemark?.parent as any)?.name ?? "";
  return <Seo title={`${name} | Locations`} />;
}

export const query = graphql`
  query LocationDetail($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      fields { slug }
      frontmatter { tags terrain government pronounced location }
      parent { ... on File { name } }
    }
  }
`;
