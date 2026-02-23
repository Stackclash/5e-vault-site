import React from "react";
import { graphql, PageProps, Link } from "gatsby";
import { Scroll } from "lucide-react";
import { Layout } from "../components/layout";
import { Seo } from "../components/seo";
import { PageHeader } from "../components/page-header";

interface CampaignSessionsContext {
  campaignSlug: string;
  partyName: string;
  worldName: string | null;
  ids: string[];
}

export default function CampaignSessionsPage({
  data,
  pageContext,
}: PageProps<Queries.CampaignSessionsPageQuery, CampaignSessionsContext>) {
  const { campaignSlug, partyName } = pageContext;
  const sessions = data.allMarkdownRemark.nodes;

  return (
    <Layout campaignSlug={campaignSlug}>
      <PageHeader
        breadcrumbs={[
          { label: "Campaign", href: `/${campaignSlug}/` },
          { label: "Sessions", href: `/${campaignSlug}/sessions` },
        ]}
        subtitle={partyName ? `Party: ${partyName}` : "Adventure Log"}
        title="Session Journals"
        icon={Scroll}
        description="A chronological record of every session played throughout the campaign."
      />
      <section className="pb-24">
        <div className="mx-auto max-w-4xl px-6">
          <div className="relative border-l border-border/50 pl-8">
            {sessions.map((session: any, i: number) => {
              const name = session.parent?.name ?? "Unknown";
              const slug = session.fields?.slug ?? "";
              const date = session.frontmatter?.date
                ? new Date(session.frontmatter.date).toLocaleDateString()
                : "";
              const summary = session.frontmatter?.summary ?? session.excerpt;
              return (
                <div key={slug} className={i < sessions.length - 1 ? "mb-10" : ""}>
                  <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border-2 border-primary bg-background" />
                  <Link
                    to={`/${campaignSlug}/sessions/${slug}`}
                    className="group block rounded-lg border border-border/50 bg-card p-6 transition-colors hover:border-primary/30"
                  >
                    <div className="mb-2 flex flex-wrap items-center gap-3">
                      <span className="rounded-sm border border-primary/30 bg-primary/10 px-2 py-0.5 font-serif text-xs tracking-wider uppercase text-primary">
                        Session
                      </span>
                      {date && (
                        <span className="text-xs text-muted-foreground">{date}</span>
                      )}
                    </div>
                    <h3 className="mb-2 font-serif text-xl font-bold tracking-wide text-foreground">
                      {name}
                    </h3>
                    <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                      {summary}
                    </p>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
}

export function Head(_: PageProps<Queries.CampaignSessionsPageQuery, CampaignSessionsContext>) {
  return <Seo title="Sessions" description="A chronological record of every session played." />;
}

export const query = graphql`
  query CampaignSessionsPage($ids: [String!]) {
    allMarkdownRemark(
      filter: { id: { in: $ids } }
      sort: { frontmatter: { date: DESC } }
    ) {
      nodes {
        fields { slug }
        frontmatter { date summary tags }
        parent { ... on File { name } }
        excerpt(pruneLength: 200)
      }
    }
  }
`;
