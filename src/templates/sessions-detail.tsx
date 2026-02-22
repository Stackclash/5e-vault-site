import React from "react";
import { graphql, PageProps, Link } from "gatsby";
import { Scroll, ArrowLeft } from "lucide-react";
import { Layout } from "../components/layout";
import { Seo } from "../components/seo";
import { PageHeader } from "../components/page-header";

export default function SessionDetail({ data }: PageProps<Queries.SessionDetailQuery>) {
  const node = data.markdownRemark;
  if (!node) return null;
  const name = (node.parent as any)?.name ?? "Unknown";
  const fm = node.frontmatter as any;
  const date = fm?.date ? new Date(fm.date).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) : "";
  const summary = fm?.summary ?? "";
  const party = fm?.party ?? [];

  return (
    <Layout>
      <PageHeader
        breadcrumbs={[
          { label: "Sessions", href: "/sessions" },
          { label: name, href: `/sessions/${node.fields?.slug}` },
        ]}
        subtitle="Session Journal"
        title={name}
        icon={Scroll}
      />
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6">
          {/* Session Info */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {date && (
              <div className="rounded-lg border border-border/50 bg-card p-4">
                <span className="font-serif text-xs font-semibold tracking-wider uppercase text-muted-foreground">Date</span>
                <p className="mt-1 text-foreground">{date}</p>
              </div>
            )}
            {Array.isArray(party) && party.length > 0 && (
              <div className="rounded-lg border border-border/50 bg-card p-4 sm:col-span-2">
                <span className="font-serif text-xs font-semibold tracking-wider uppercase text-muted-foreground">Party</span>
                <p className="mt-1 text-foreground">{party.join(", ")}</p>
              </div>
            )}
          </div>

          {/* Summary */}
          {summary && (
            <div className="mb-8 rounded-lg border border-primary/20 bg-primary/5 p-6">
              <h2 className="mb-2 font-serif text-sm font-semibold tracking-wider uppercase text-primary">Summary</h2>
              <p className="text-sm leading-relaxed text-foreground">{summary}</p>
            </div>
          )}

          {/* Content */}
          <div className="prose prose-invert max-w-none mb-12" dangerouslySetInnerHTML={{ __html: node.html ?? "" }} />

          <Link to="/sessions" className="inline-flex items-center gap-2 font-serif text-sm tracking-wider uppercase text-primary transition-colors hover:text-primary/80">
            <ArrowLeft className="h-4 w-4" />
            Back to All Sessions
          </Link>
        </div>
      </section>
    </Layout>
  );
}

export function Head({ data }: PageProps<Queries.SessionDetailQuery>) {
  const name = (data.markdownRemark?.parent as any)?.name ?? "";
  return <Seo title={`${name} | Sessions`} />;
}

export const query = graphql`
  query SessionDetail($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      fields { slug }
      frontmatter { date summary party tags }
      parent { ... on File { name } }
    }
  }
`;
