import { notFound } from "next/navigation";
import Link from "next/link";
import { Users, ArrowLeft, MapPin, Scroll, Gem, Shield } from "lucide-react";
import { CampaignNav } from "@/components/campaign-nav";
import { CampaignFooter } from "@/components/campaign-footer";
import { PageHeader } from "@/components/page-header";
import {
  npcs,
  getNpcBySlug,
  getLocationBySlug,
  getSessionByNumber,
  getItemBySlug,
} from "@/lib/campaign-data";

export function generateStaticParams() {
  return npcs.map((npc) => ({ slug: npc.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const npc = getNpcBySlug(slug);
  if (!npc) return {};
  return {
    title: `${npc.name} | NPCs | Chronicles of the Shattered Realm`,
    description: npc.description,
  };
}

function DispositionBadge({ disposition }: { disposition: string }) {
  const colors: Record<string, string> = {
    Friendly: "bg-chart-4/20 text-chart-4 border-chart-4/30",
    Neutral: "bg-primary/20 text-primary border-primary/30",
    Hostile: "bg-chart-5/20 text-chart-5 border-chart-5/30",
  };
  return (
    <span
      className={`inline-flex rounded-sm border px-2 py-0.5 font-serif text-xs tracking-wider uppercase ${colors[disposition] ?? "bg-muted text-muted-foreground border-border"}`}
    >
      {disposition}
    </span>
  );
}

export default async function NpcDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const npc = getNpcBySlug(slug);
  if (!npc) notFound();

  const location = getLocationBySlug(npc.locationSlug);
  const connectedSessions = npc.connectedSessions
    .map(getSessionByNumber)
    .filter(Boolean);
  const connectedItems = npc.connectedItems.map(getItemBySlug).filter(Boolean);

  return (
    <>
      <CampaignNav />
      <main>
        <PageHeader
          breadcrumbs={[
            { label: "NPCs", href: "/npcs" },
            { label: npc.name, href: `/npcs/${npc.slug}` },
          ]}
          subtitle={npc.title}
          title={npc.name}
          icon={Users}
        />

        <section className="py-16">
          <div className="mx-auto max-w-5xl px-6">
            <div className="flex flex-col gap-12 lg:flex-row">
              {/* Portrait */}
              <div className="shrink-0 lg:w-80">
                <div className="overflow-hidden rounded-lg border border-border/50">
                  <img
                    src={npc.image}
                    alt={`Portrait of ${npc.name}`}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Quick stats */}
                <div className="mt-6 flex flex-col gap-3 rounded-lg border border-border/50 bg-card p-6">
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                      Race
                    </span>
                    <span className="text-sm text-foreground">{npc.race}</span>
                  </div>
                  <div className="h-px bg-border/30" />
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                      Alignment
                    </span>
                    <span className="text-sm text-foreground">
                      {npc.alignment}
                    </span>
                  </div>
                  <div className="h-px bg-border/30" />
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                      Disposition
                    </span>
                    <DispositionBadge disposition={npc.disposition} />
                  </div>
                  <div className="h-px bg-border/30" />
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                      Location
                    </span>
                    {location ? (
                      <Link
                        href={`/locations/${location.slug}`}
                        className="text-sm text-primary transition-colors hover:text-primary/80"
                      >
                        {npc.location}
                      </Link>
                    ) : (
                      <span className="text-sm text-foreground">
                        {npc.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                {/* Description */}
                <div className="mb-10">
                  <h2 className="mb-4 font-serif text-xl font-bold tracking-wide text-foreground">
                    Background
                  </h2>
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    {npc.description}
                  </p>
                </div>

                {/* Known Info */}
                <div className="mb-10 rounded-lg border border-primary/20 bg-primary/5 p-6">
                  <div className="mb-3 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    <h2 className="font-serif text-sm font-semibold tracking-wider uppercase text-primary">
                      Known Information
                    </h2>
                  </div>
                  <p className="leading-relaxed text-muted-foreground">
                    {npc.knownInfo}
                  </p>
                </div>

                {/* Connected Items */}
                {connectedItems.length > 0 && (
                  <div className="mb-10">
                    <div className="mb-4 flex items-center gap-2">
                      <Gem className="h-4 w-4 text-primary" />
                      <h2 className="font-serif text-sm font-semibold tracking-wider uppercase text-primary">
                        Related Items
                      </h2>
                    </div>
                    <div className="flex flex-col gap-3">
                      {connectedItems.map((item) =>
                        item ? (
                          <Link
                            key={item.slug}
                            href={`/items/${item.slug}`}
                            className="group flex items-center gap-4 rounded-lg border border-border/50 bg-card p-4 transition-colors hover:border-primary/30"
                          >
                            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div>
                              <h3 className="font-serif text-base font-bold text-foreground">
                                {item.name}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {item.rarity} &middot; {item.type}
                              </p>
                            </div>
                          </Link>
                        ) : null
                      )}
                    </div>
                  </div>
                )}

                {/* Connected Sessions */}
                {connectedSessions.length > 0 && (
                  <div className="mb-10">
                    <div className="mb-4 flex items-center gap-2">
                      <Scroll className="h-4 w-4 text-primary" />
                      <h2 className="font-serif text-sm font-semibold tracking-wider uppercase text-primary">
                        Appeared In
                      </h2>
                    </div>
                    <div className="flex flex-col gap-3">
                      {connectedSessions.map((session) =>
                        session ? (
                          <Link
                            key={session.slug}
                            href={`/sessions/${session.slug}`}
                            className="group flex items-center gap-4 rounded-lg border border-border/50 bg-card p-4 transition-colors hover:border-primary/30"
                          >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 font-serif text-sm font-bold text-primary">
                              {session.number}
                            </div>
                            <div>
                              <h3 className="font-serif text-base font-bold text-foreground">
                                {session.title}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {session.date}
                              </p>
                            </div>
                          </Link>
                        ) : null
                      )}
                    </div>
                  </div>
                )}

                {/* Back link */}
                <Link
                  href="/npcs"
                  className="inline-flex items-center gap-2 font-serif text-sm tracking-wider uppercase text-primary transition-colors hover:text-primary/80"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to All NPCs
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <CampaignFooter />
    </>
  );
}
