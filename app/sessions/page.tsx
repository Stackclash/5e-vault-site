import Link from "next/link";
import { Scroll, Skull, Star, AlertTriangle } from "lucide-react";
import { CampaignNav } from "@/components/campaign-nav";
import { CampaignFooter } from "@/components/campaign-footer";
import { PageHeader } from "@/components/page-header";
import { sessions } from "@/lib/campaign-data";

export const metadata = {
  title: "Sessions | Chronicles of the Shattered Realm",
  description: "Read through the full adventure log of every session played in the campaign.",
};

function HighlightIcon({ highlight }: { highlight: string }) {
  const icons: Record<string, React.ReactNode> = {
    "Boss Fight": <Skull className="h-3.5 w-3.5" />,
    "Key Discovery": <Star className="h-3.5 w-3.5" />,
    "New Ally": <Star className="h-3.5 w-3.5" />,
    Exploration: <Star className="h-3.5 w-3.5" />,
    "Roleplay Heavy": <AlertTriangle className="h-3.5 w-3.5" />,
  };
  return <>{icons[highlight] ?? <Star className="h-3.5 w-3.5" />}</>;
}

export default function SessionsPage() {
  return (
    <>
      <CampaignNav />
      <main>
        <PageHeader
          breadcrumbs={[{ label: "Sessions", href: "/sessions" }]}
          subtitle="Adventure Log"
          title="Session Summaries"
          icon={Scroll}
          description="A complete chronicle of every session played, including key events, discoveries, and loot."
        />

        <section className="pb-24">
          <div className="mx-auto max-w-4xl px-6">
            {sessions.map((session) => (
              <Link
                key={session.slug}
                href={`/sessions/${session.slug}`}
                className="group relative flex gap-6"
              >
                {/* Timeline dot and line */}
                <div className="hidden flex-col items-center sm:flex">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-card font-serif text-sm font-bold text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    {session.number}
                  </div>
                  <div className="w-px flex-1 bg-border/50" />
                </div>

                {/* Card */}
                <div className="mb-8 flex-1 rounded-lg border border-border/50 bg-card p-6 transition-colors group-hover:border-primary/30 lg:p-8">
                  <div className="mb-3 flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-1.5 rounded-sm border border-primary/30 bg-primary/10 px-2 py-0.5 font-serif text-xs tracking-wider uppercase text-primary sm:hidden">
                      #{session.number}
                    </span>
                    <span className="flex items-center gap-1.5 rounded-sm border border-accent/30 bg-accent/10 px-2 py-0.5 font-serif text-xs tracking-wider uppercase text-accent">
                      <HighlightIcon highlight={session.highlight} />
                      {session.highlight}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {session.date}
                    </span>
                  </div>

                  <h3 className="mb-3 font-serif text-xl font-bold tracking-wide text-foreground">
                    {session.title}
                  </h3>
                  <p className="leading-relaxed text-muted-foreground">
                    {session.summary}
                  </p>

                  <div className="mt-4 grid gap-4 border-t border-border/50 pt-4 md:grid-cols-2">
                    <div>
                      <h4 className="mb-2 font-serif text-xs font-semibold tracking-wider uppercase text-accent">
                        Key Events
                      </h4>
                      <ul className="flex flex-col gap-1.5">
                        {session.keyEvents.slice(0, 2).map((e) => (
                          <li
                            key={e}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                            {e}
                          </li>
                        ))}
                        {session.keyEvents.length > 2 && (
                          <li className="text-xs italic text-primary">
                            +{session.keyEvents.length - 2} more events...
                          </li>
                        )}
                      </ul>
                    </div>
                    <div>
                      <h4 className="mb-2 font-serif text-xs font-semibold tracking-wider uppercase text-accent">
                        Loot Found
                      </h4>
                      <ul className="flex flex-col gap-1.5">
                        {session.lootFound.slice(0, 2).map((l) => (
                          <li
                            key={l}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                            {l}
                          </li>
                        ))}
                        {session.lootFound.length > 2 && (
                          <li className="text-xs italic text-primary">
                            +{session.lootFound.length - 2} more items...
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <CampaignFooter />
    </>
  );
}
