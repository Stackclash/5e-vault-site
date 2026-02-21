import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, ArrowLeft, Users, Scroll, AlertTriangle } from "lucide-react";
import { CampaignNav } from "@/components/campaign-nav";
import { CampaignFooter } from "@/components/campaign-footer";
import { PageHeader } from "@/components/page-header";
import {
  locations,
  getLocationBySlug,
  getNpcBySlug,
  getSessionByNumber,
} from "@/lib/campaign-data";

export function generateStaticParams() {
  return locations.map((loc) => ({ slug: loc.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const location = getLocationBySlug(slug);
  if (!location) return {};
  return {
    title: `${location.name} | Locations | Chronicles of the Shattered Realm`,
    description: location.description,
  };
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Explored: "bg-primary/20 text-primary border-primary/30",
    "Current Objective": "bg-accent/20 text-accent border-accent/30",
    "Safe Haven": "bg-chart-4/20 text-chart-4 border-chart-4/30",
  };
  return (
    <span
      className={`inline-flex rounded-sm border px-2 py-0.5 font-serif text-xs tracking-wider uppercase ${colors[status] ?? "bg-muted text-muted-foreground border-border"}`}
    >
      {status}
    </span>
  );
}

export default async function LocationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const location = getLocationBySlug(slug);
  if (!location) notFound();

  const connectedNpcs = location.connectedNpcs
    .map(getNpcBySlug)
    .filter(Boolean);
  const connectedSessions = location.connectedSessions
    .map(getSessionByNumber)
    .filter(Boolean);

  return (
    <>
      <CampaignNav />
      <main>
        <PageHeader
          breadcrumbs={[
            { label: "Locations", href: "/locations" },
            { label: location.name, href: `/locations/${location.slug}` },
          ]}
          subtitle={location.type}
          title={location.name}
          icon={MapPin}
          image={location.image}
          imageAlt={`Illustration of ${location.name}`}
        />

        <section className="py-16">
          <div className="mx-auto max-w-4xl px-6">
            {/* Status and type */}
            <div className="mb-8 flex flex-wrap items-center gap-4">
              <StatusBadge status={location.status} />
              <span className="text-sm tracking-wider uppercase text-muted-foreground">
                {location.type}
              </span>
            </div>

            {/* Description */}
            <div className="mb-12">
              <h2 className="mb-4 font-serif text-xl font-bold tracking-wide text-foreground">
                Description
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                {location.description}
              </p>
            </div>

            {/* Threats */}
            <div className="mb-12 rounded-lg border border-accent/20 bg-accent/5 p-6">
              <div className="mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-accent" />
                <h2 className="font-serif text-sm font-semibold tracking-wider uppercase text-accent">
                  Known Threats
                </h2>
              </div>
              <p className="leading-relaxed text-muted-foreground">
                {location.threats}
              </p>
            </div>

            {/* Connected NPCs */}
            {connectedNpcs.length > 0 && (
              <div className="mb-12">
                <div className="mb-4 flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <h2 className="font-serif text-sm font-semibold tracking-wider uppercase text-primary">
                    Notable Figures Here
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

            {/* Connected Sessions */}
            {connectedSessions.length > 0 && (
              <div className="mb-12">
                <div className="mb-4 flex items-center gap-2">
                  <Scroll className="h-4 w-4 text-primary" />
                  <h2 className="font-serif text-sm font-semibold tracking-wider uppercase text-primary">
                    Related Sessions
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
              href="/locations"
              className="inline-flex items-center gap-2 font-serif text-sm tracking-wider uppercase text-primary transition-colors hover:text-primary/80"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to All Locations
            </Link>
          </div>
        </section>
      </main>
      <CampaignFooter />
    </>
  );
}
