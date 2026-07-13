import React from "react";
import { graphql, Link, PageProps } from "gatsby";
import { Swords } from "lucide-react";
import { Layout } from "../components/layout";
import { Seo } from "../components/seo";
import { PageHeader } from "../components/page-header";
import { isQuestActive, isQuestCompleted, type QuestWithParties } from "../lib/campaign";

type QuestNode = Queries.QuestsListQuery["quests"]["nodes"][number];

export default function QuestsPage({ data }: PageProps<Queries.QuestsListQuery>) {
  const quests = data.quests.nodes;

  const active = quests.filter((q) => isQuestActive(q as QuestWithParties));
  const completed = quests.filter((q) => isQuestCompleted(q as QuestWithParties));
  const other = quests.filter(
    (q) => !isQuestActive(q as QuestWithParties) && !isQuestCompleted(q as QuestWithParties),
  );

  return (
    <Layout title="Quests">
      <PageHeader
        breadcrumbs={[{ label: "Quests", href: "/quests" }]}
        subtitle="Party Objectives"
        title="Quests"
        icon={Swords}
        description="What the party is chasing, and what they have already resolved."
      />

      <section className="mx-auto max-w-4xl px-6 pb-24">
        {quests.length === 0 ? (
          <p className="text-muted-foreground">No quests recorded yet.</p>
        ) : (
          <>
            <QuestGroup title="Active" nodes={active} />
            <QuestGroup title="Completed" nodes={completed} />
            <QuestGroup title="Other" nodes={other} />
          </>
        )}
      </section>
    </Layout>
  );
}

function QuestGroup({ title, nodes }: { title: string; nodes: QuestNode[] }) {
  if (nodes.length === 0) return null;
  return (
    <div className="mb-16 last:mb-0">
      <h2 className="mb-6 font-serif text-2xl font-bold tracking-wide text-foreground">{title}</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {nodes.map((quest) => (
          <Link
            key={quest.slug}
            to={`/quests/${quest.slug}`}
            className="group flex flex-col rounded-lg border border-border/50 bg-card p-6 transition-colors hover:border-primary/30"
          >
            <h3 className="mb-3 font-serif text-lg font-bold tracking-wide text-foreground">{quest.name}</h3>
            {(quest.playerSummary || quest.description) && (
              <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                {quest.playerSummary || quest.description}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function Head() {
  return <Seo title="Quests" />;
}

export const query = graphql`
  query QuestsList {
    quests: allQuest(sort: { name: ASC }) {
      nodes {
        name
        slug
        description
        playerSummary
        parties {
          active
          completed
        }
      }
    }
  }
`;
