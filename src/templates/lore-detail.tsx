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
      frontmatter { campaign tags }
      parent { ... on File { name } }
    }
  }
`;
