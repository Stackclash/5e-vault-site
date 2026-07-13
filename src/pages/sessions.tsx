import React from "react";
import { graphql, Link, PageProps } from "gatsby";
import { Scroll } from "lucide-react";
import { Layout } from "../components/layout";
import { Seo } from "../components/seo";
import { PageHeader } from "../components/page-header";

export default function SessionsPage({ data }: PageProps<Queries.SessionsListQuery>) {
  const sessions = data.sessions.nodes;

  return (
    <Layout title="Sessions">
      <PageHeader
        breadcrumbs={[{ label: "Sessions", href: "/sessions" }]}
        subtitle="Adventure Log"
        title="Session Recaps"
        icon={Scroll}
        description="Every session the party has played, most recent first."
      />

      <section className="mx-auto max-w-4xl px-6 pb-24">
        {sessions.length === 0 ? (
          <p className="text-muted-foreground">No sessions recorded yet.</p>
        ) : (
          <div className="flex flex-col gap-6">
            {sessions.map((session) => {
              const date = session.sessionDate
                ? new Date(session.sessionDate).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : null;
              return (
                <Link
                  key={session.slug}
                  to={`/sessions/${session.slug}`}
                  className="group flex flex-col rounded-lg border border-border/50 bg-card p-6 transition-colors hover:border-primary/30"
                >
                  <div className="mb-2 flex flex-wrap items-center gap-3">
                    {session.sessionNumber != null && (
                      <span className="rounded-sm border border-primary/30 bg-primary/10 px-2 py-0.5 font-serif text-xs tracking-wider uppercase text-primary">
                        Session {session.sessionNumber}
                      </span>
                    )}
                    {date && <span className="text-xs text-muted-foreground">{date}</span>}
                  </div>
                  <h3 className="mb-2 font-serif text-xl font-bold tracking-wide text-foreground">
                    {session.name}
                  </h3>
                  {session.summary && (
                    <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                      {session.summary}
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </Layout>
  );
}

export function Head() {
  return <Seo title="Sessions" />;
}

export const query = graphql`
  query SessionsList {
    sessions: allSession(sort: { sessionNumber: DESC }) {
      nodes {
        name
        slug
        summary
        sessionDate
        sessionNumber
      }
    }
  }
`;
