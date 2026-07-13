import React from "react";
import { graphql, PageProps } from "gatsby";
import { Swords, CheckCircle2, Circle, User } from "lucide-react";
import { Layout } from "../components/layout";
import { Seo } from "../components/seo";
import { PageHeader } from "../components/page-header";
import { isQuestActive, isQuestCompleted, type QuestWithParties } from "../lib/campaign";

function StatusBadge({ quest }: { quest: QuestWithParties }) {
  if (isQuestCompleted(quest)) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-sm border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 font-serif text-xs tracking-widest uppercase text-emerald-400">
        <CheckCircle2 className="h-3.5 w-3.5" /> Completed
      </span>
    );
  }
  if (isQuestActive(quest)) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-sm border border-primary/40 bg-primary/10 px-3 py-1 font-serif text-xs tracking-widest uppercase text-primary">
        <Circle className="h-3.5 w-3.5" /> Active
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-sm border border-border/60 bg-muted/40 px-3 py-1 font-serif text-xs tracking-widest uppercase text-muted-foreground">
      Inactive
    </span>
  );
}

export default function QuestDetail({ data }: PageProps<Queries.QuestDetailQuery>) {
  const quest = data.quest;
  if (!quest) return null;

  const steps = (quest.steps ?? []).filter(Boolean);
  const questNpcs = (quest.questNpcs ?? []).filter((n) => n?.name);

  return (
    <Layout title="Quests">
      <PageHeader
        breadcrumbs={[{ label: "Quests", href: "/quests" }]}
        subtitle="Quest"
        title={quest.name}
        icon={Swords}
        description={quest.playerSummary ?? undefined}
      />

      <section className="mx-auto max-w-3xl px-6 pb-24">
        <div className="mb-8">
          <StatusBadge quest={quest as QuestWithParties} />
        </div>

        {quest.description && (
          <p className="mb-12 whitespace-pre-line text-lg leading-relaxed text-muted-foreground">
            {quest.description}
          </p>
        )}

        {/* Steps checklist */}
        {steps.length > 0 && (
          <div className="mb-12">
            <h2 className="mb-6 font-serif text-2xl font-bold tracking-wide text-foreground">Objectives</h2>
            <ul className="flex flex-col gap-3">
              {steps.map((step, i) => {
                const done = (step!.completed ?? []).some((c) => c?.completed);
                return (
                  <li key={i} className="flex items-start gap-3 rounded-lg border border-border/50 bg-card p-4">
                    {done ? (
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                    ) : (
                      <Circle className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground/50" />
                    )}
                    <span className={done ? "text-muted-foreground line-through" : "text-foreground"}>
                      {step!.text}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Related NPCs */}
        {questNpcs.length > 0 && (
          <div>
            <h2 className="mb-6 font-serif text-2xl font-bold tracking-wide text-foreground">Related NPCs</h2>
            <div className="flex flex-col gap-4">
              {questNpcs.map((npc, i) => (
                <div key={i} className="rounded-lg border border-border/50 bg-card p-5">
                  <h3 className="mb-1 flex items-center gap-2 font-serif text-lg font-bold tracking-wide text-foreground">
                    <User className="h-4 w-4 text-primary/60" />
                    {npc!.name}
                  </h3>
                  {npc!.description && (
                    <p className="leading-relaxed text-muted-foreground">{npc!.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </Layout>
  );
}

export function Head({ data }: PageProps<Queries.QuestDetailQuery>) {
  return <Seo title={data.quest?.name} />;
}

export const query = graphql`
  query QuestDetail($id: String!) {
    quest(id: { eq: $id }) {
      name
      description
      playerSummary
      parties {
        active
        completed
      }
      steps {
        text
        completed {
          completed
        }
      }
      questNpcs {
        name
        description
      }
    }
  }
`;
