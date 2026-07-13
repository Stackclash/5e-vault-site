import React from "react";
import { graphql, Link, PageProps } from "gatsby";
import { Scroll, MapPin, ArrowLeft, ArrowRight, Calendar, Users, User, Swords, Package } from "lucide-react";
import { Layout } from "../components/layout";
import { Seo } from "../components/seo";
import { PageHeader } from "../components/page-header";

interface SessionNav {
  slug: string;
  name: string;
  sessionNumber: number | null;
}

interface SessionPageContext {
  id: string;
  prev: SessionNav | null;
  next: SessionNav | null;
}

export default function SessionDetail({
  data,
  pageContext,
}: PageProps<Queries.SessionDetailQuery, SessionPageContext>) {
  const session = data.session;
  if (!session) return null;

  const { prev, next } = pageContext;
  const date = session.sessionDate
    ? new Date(session.sessionDate).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;
  const locations = (session.locations ?? []).filter(Boolean);
  const partyPresent = (session.partyPresent ?? []).filter(Boolean);
  const npcsMet = (session.npcs ?? []).filter(Boolean);
  const questsTouched = (session.quests ?? []).filter(Boolean);
  const itemsFound = (session.items ?? []).filter(Boolean);
  const hasSessionLinks =
    partyPresent.length > 0 || npcsMet.length > 0 || questsTouched.length > 0 || itemsFound.length > 0;

  return (
    <Layout title="Sessions">
      <PageHeader
        breadcrumbs={[{ label: "Sessions", href: "/sessions" }]}
        subtitle={session.sessionNumber != null ? `Session ${session.sessionNumber}` : "Session Recap"}
        title={session.name}
        icon={Scroll}
      />

      <section className="mx-auto max-w-3xl px-6 pb-24">
        <div className="mb-8 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {date && (
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {date}
            </span>
          )}
          {locations.length > 0 && (
            <span className="flex flex-wrap items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {locations.map((loc, i) => (
                <React.Fragment key={loc!.slug}>
                  {i > 0 && <span className="text-muted-foreground/40">·</span>}
                  <Link to={`/locations/${loc!.slug}`} className="transition-colors hover:text-primary">
                    {loc!.name}
                  </Link>
                </React.Fragment>
              ))}
            </span>
          )}
        </div>

        {session.summary ? (
          <div className="whitespace-pre-line text-lg leading-relaxed text-muted-foreground">
            {session.summary}
          </div>
        ) : (
          <p className="italic text-muted-foreground">No recap has been recorded for this session yet.</p>
        )}

        {/* Session Links */}
        {hasSessionLinks && (
          <div className="mt-12 grid gap-6 border-t border-border/50 pt-8 sm:grid-cols-2">
            {partyPresent.length > 0 && (
              <div>
                <h3 className="mb-3 flex items-center gap-1.5 text-xs tracking-wider uppercase text-muted-foreground">
                  <Users className="h-3.5 w-3.5" /> Party Present
                </h3>
                <div className="flex flex-wrap gap-2">
                  {partyPresent.map((name) => (
                    <span
                      key={name}
                      className="rounded-sm border border-border/50 bg-card px-2.5 py-1 text-sm text-foreground"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {npcsMet.length > 0 && (
              <div>
                <h3 className="mb-3 flex items-center gap-1.5 text-xs tracking-wider uppercase text-muted-foreground">
                  <User className="h-3.5 w-3.5" /> NPCs Met
                </h3>
                <div className="flex flex-wrap gap-2">
                  {npcsMet.map((npc) => (
                    <Link
                      key={npc!.slug}
                      to={`/npcs/${npc!.slug}`}
                      className="rounded-sm border border-border/50 bg-card px-2.5 py-1 text-sm text-foreground transition-colors hover:border-primary/30 hover:text-primary"
                    >
                      {npc!.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {questsTouched.length > 0 && (
              <div>
                <h3 className="mb-3 flex items-center gap-1.5 text-xs tracking-wider uppercase text-muted-foreground">
                  <Swords className="h-3.5 w-3.5" /> Quests Touched
                </h3>
                <div className="flex flex-wrap gap-2">
                  {questsTouched.map((quest) => (
                    <Link
                      key={quest!.slug}
                      to={`/quests/${quest!.slug}`}
                      className="rounded-sm border border-border/50 bg-card px-2.5 py-1 text-sm text-foreground transition-colors hover:border-primary/30 hover:text-primary"
                    >
                      {quest!.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {itemsFound.length > 0 && (
              <div>
                <h3 className="mb-3 flex items-center gap-1.5 text-xs tracking-wider uppercase text-muted-foreground">
                  <Package className="h-3.5 w-3.5" /> Items Found
                </h3>
                <div className="flex flex-wrap gap-2">
                  {itemsFound.map((item) => (
                    <span
                      key={item}
                      className="rounded-sm border border-border/50 bg-card px-2.5 py-1 text-sm text-foreground"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Prev / next nav */}
        <div className="mt-16 grid gap-4 border-t border-border/50 pt-8 sm:grid-cols-2">
          {prev ? (
            <Link
              to={`/sessions/${prev.slug}`}
              className="group flex flex-col gap-1 rounded-lg border border-border/50 bg-card p-4 transition-colors hover:border-primary/30"
            >
              <span className="flex items-center gap-1.5 text-xs tracking-wider uppercase text-muted-foreground">
                <ArrowLeft className="h-3.5 w-3.5" /> Previous
              </span>
              <span className="font-serif text-foreground">
                {prev.sessionNumber != null && `S${prev.sessionNumber}: `}
                {prev.name}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              to={`/sessions/${next.slug}`}
              className="group flex flex-col gap-1 rounded-lg border border-border/50 bg-card p-4 text-right transition-colors hover:border-primary/30 sm:col-start-2"
            >
              <span className="flex items-center justify-end gap-1.5 text-xs tracking-wider uppercase text-muted-foreground">
                Next <ArrowRight className="h-3.5 w-3.5" />
              </span>
              <span className="font-serif text-foreground">
                {next.sessionNumber != null && `S${next.sessionNumber}: `}
                {next.name}
              </span>
            </Link>
          )}
        </div>
      </section>
    </Layout>
  );
}

export function Head({ data }: PageProps<Queries.SessionDetailQuery>) {
  return <Seo title={data.session?.name} />;
}

export const query = graphql`
  query SessionDetail($id: String!) {
    session(id: { eq: $id }) {
      name
      summary
      sessionDate
      sessionNumber
      locations {
        name
        slug
      }
      partyPresent
      npcs {
        name
        slug
      }
      quests {
        name
        slug
      }
      items
    }
  }
`;
