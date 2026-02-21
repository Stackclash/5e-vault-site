import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Scroll,
  ArrowLeft,
  MapPin,
  Users,
  Skull,
  Star,
  AlertTriangle,
} from "lucide-react";
import { CampaignNav } from "@/components/campaign-nav";
import { CampaignFooter } from "@/components/campaign-footer";
import { PageHeader } from "@/components/page-header";
import {
  sessions,
  getSessionBySlug,
  getLocationBySlug,
  getNpcBySlug,
} from "@/lib/campaign-data";

export function generateStaticParams() {
  return sessions.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = getSessionBySlug(slug);
  if (!session) return {};
  return {
    title: `Session ${session.number}: ${session.title} | Chronicles of the Shattered Realm`,
    description: session.summary,
  };
}

function HighlightBadge({ highlight }: { highlight: string }) {
  const icons: Record<string, React.ReactNode> = {
    "Boss Fight": <Skull className="h-3.5 w-3.5" />,
    "Key Discovery": <Star className="h-3.5 w-3.5" />,
    "New Ally": <Star className="h-3.5 w-3.5" />,
    Exploration: <Star className="h-3.5 w-3.5" />,
    "Roleplay Heavy": <AlertTriangle className="h-3.5 w-3.5" />,
  };
  return (
    <span className="flex items-center gap-1.5 rounded-sm border border-accent/30 bg-accent/10 px-3 py-1 font-serif text-xs tracking-wider uppercase text-accent">
      {icons[highlight] ?? <Star className="h-3.5 w-3.5" />}
      {highlight}
    </span>
  );
}

export default async function SessionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = getSessionBySlug(slug);
  if (!session) notFound();

  const connectedLocations = session.connectedLocations
    .map(getLocationBySlug)
    .filter(Boolean);
  const connectedNpcs = session.connectedNpcs.map(getNpcBySlug).filter(Boolean);

  // Find previous and next sessions
  const currentIndex = sessions.findIndex((s) => s.slug === session.slug);
  const prevSession = currentIndex < sessions.length - 1 ? sessions[currentIndex + 1] : null;
  const nextSession = currentIndex > 0 ? sessions[currentIndex - 1] : null;

  return (
    <>
      <CampaignNav />
      <main>
        <PageHeader
          breadcrumbs={[
            { label: "Sessions", href: "/sessions" },
            {
              label: `Session ${session.number}`,
              href: `/sessions/${session.slug}`,
            },
          ]}
          subtitle={`Session ${session.number} - ${session.date}`}
          title={session.title}
          icon={Scroll}
        />

        <section className="py-16">
          <div className="mx-auto max-w-4xl px-6">
            {/* Highlight and date badges */}
            <div className="mb-8 flex flex-wrap items-center gap-3">
              <HighlightBadge highlight={session.highlight} />
              <span className="text-sm text-muted-foreground">
                {session.date}
              </span>
            </div>

            {/* Full summary */}
            <div className="mb-12">
              <h2 className="mb-4 font-serif text-xl font-bold tracking-wide text-foreground">
                Session Summary
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                {session.summary}
              </p>
            </div>

            {/* Key Events & Loot */}
            <div className="mb-12 grid gap-8 md:grid-cols-2">
              <div className="rounded-lg border border-border/50 bg-card p-6">
                <h3 className="mb-4 font-serif text-sm font-semibold tracking-wider uppercase text-accent">
                  Key Events
                </h3>
                <ul className="flex flex-col gap-3">
                  {session.keyEvents.map((event) => (
                    <li
                      key={event}
                      className="flex items-start gap-3 text-muted-foreground"
                    >
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                      <span className="leading-relaxed">{event}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg border border-border/50 bg-card p-6">
                <h3 className="mb-4 font-serif text-sm font-semibold tracking-wider uppercase text-accent">
                  Loot Found
                </h3>
                <ul className="flex flex-col gap-3">
                  {session.lootFound.map((loot) => (
                    <li
                      key={loot}
                      className="flex items-start gap-3 text-muted-foreground"
                    >
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent" />
                      <span className="leading-relaxed">{loot}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Connected Locations */}
            {connectedLocations.length > 0 && (
              <div className="mb-10">
                <div className="mb-4 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <h2 className="font-serif text-sm font-semibold tracking-wider uppercase text-primary">
                    Locations Visited
                  </h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {connectedLocations.map((loc) =>
                    loc ? (
                      <Link
                        key={loc.slug}
                        href={`/locations/${loc.slug}`}
                        className="group flex items-center gap-4 rounded-lg border border-border/50 bg-card p-4 transition-colors hover:border-primary/30"
                      >
                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md">
                          <img
                            src={loc.image}
                            alt={loc.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-serif text-base font-bold text-foreground">
                            {loc.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {loc.type}
                          </p>
                        </div>
                      </Link>
                    ) : null
                  )}
                </div>
              </div>
            )}

            {/* Connected NPCs */}
            {connectedNpcs.length > 0 && (
              <div className="mb-10">
                <div className="mb-4 flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <h2 className="font-serif text-sm font-semibold tracking-wider uppercase text-primary">
                    NPCs Encountered
                  </h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {connectedNpcs.map((npc) =>
                    npc ? (
                      <Link
                        key={npc.slug}
                        href={`/npcs/${npc.slug}`}
                        className="group flex items-center gap-4 rounded-lg border border-border/50 bg-card p-4 transition-colors hover:border-primary/30"
                      >
                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full">
                          <img
                            src={npc.image}
                            alt={`Portrait of ${npc.name}`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-serif text-base font-bold text-foreground">
                            {npc.name}
                          </h3>
                          <p className="text-sm italic text-primary">
                            {npc.title}
                          </p>
                        </div>
                      </Link>
                    ) : null
                  )}
                </div>
              </div>
            )}

            {/* Session navigation */}
            <div className="mb-10 flex flex-col gap-4 border-t border-border/30 pt-8 sm:flex-row sm:justify-between">
              {prevSession ? (
                <Link
                  href={`/sessions/${prevSession.slug}`}
                  className="group flex items-center gap-2 font-serif text-sm tracking-wider uppercase text-muted-foreground transition-colors hover:text-primary"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>
                    Session {prevSession.number}: {prevSession.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}
              {nextSession && (
                <Link
                  href={`/sessions/${nextSession.slug}`}
                  className="group flex items-center gap-2 font-serif text-sm tracking-wider uppercase text-muted-foreground transition-colors hover:text-primary sm:text-right"
                >
                  <span>
                    Session {nextSession.number}: {nextSession.title}
                  </span>
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                </Link>
              )}
            </div>

            {/* Back link */}
            <Link
              href="/sessions"
              className="inline-flex items-center gap-2 font-serif text-sm tracking-wider uppercase text-primary transition-colors hover:text-primary/80"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to All Sessions
            </Link>
          </div>
        </section>
      </main>
      <CampaignFooter />
    </>
  );
}
