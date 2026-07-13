import React from "react";
import { Link } from "gatsby";
import { BookOpen, Scroll, Target } from "lucide-react";

interface LatestSession {
  name: string;
  slug: string;
  summary: string | null;
  sessionDate: string | null;
  sessionNumber: number | null;
}

interface ActiveQuest {
  name: string;
  slug: string;
}

interface CampaignOverviewProps {
  latestSession?: LatestSession | null;
  activeQuests?: ActiveQuest[];
}

export function CampaignOverview({ latestSession, activeQuests = [] }: CampaignOverviewProps) {
  if (!latestSession && activeQuests.length === 0) return null;

  const date = latestSession?.sessionDate
    ? new Date(latestSession.sessionDate).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <section id="overview" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="mb-16 text-center">
          <p className="mb-3 font-serif text-sm tracking-[0.3em] uppercase text-primary">
            Campaign Overview
          </p>
          <h2 className="mb-4 font-serif text-3xl font-bold tracking-wide text-foreground md:text-5xl">
            The Story So Far
          </h2>
          <div className="mx-auto mt-4 flex items-center justify-center gap-3">
            <div className="h-px w-12 bg-primary/40" />
            <BookOpen className="h-4 w-4 text-primary" />
            <div className="h-px w-12 bg-primary/40" />
          </div>
        </div>

        {/* Latest recap */}
        {latestSession?.summary && (
          <div className="mx-auto mb-16 max-w-3xl">
            <p className="whitespace-pre-line text-lg leading-relaxed text-muted-foreground">
              {latestSession.summary}
            </p>
          </div>
        )}

        {/* Info cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {latestSession && (
            <Link
              to={`/sessions/${latestSession.slug}`}
              className="group rounded-lg border border-border/50 bg-card p-8 transition-colors hover:border-primary/30"
            >
              <Scroll className="mb-4 h-6 w-6 text-accent" />
              <h3 className="mb-2 font-serif text-lg font-semibold tracking-wide text-foreground">
                Latest Session
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {latestSession.sessionNumber != null && `Session ${latestSession.sessionNumber}: `}
                {latestSession.name}
                {date && ` — ${date}`}
              </p>
            </Link>
          )}

          {activeQuests.length > 0 && (
            <div className="rounded-lg border border-border/50 bg-card p-8">
              <Target className="mb-4 h-6 w-6 text-accent" />
              <h3 className="mb-3 font-serif text-lg font-semibold tracking-wide text-foreground">
                Active Quests
              </h3>
              <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                {activeQuests.map((quest) => (
                  <li key={quest.slug} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <Link
                      to={`/quests/${quest.slug}`}
                      className="transition-colors hover:text-primary"
                    >
                      {quest.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
