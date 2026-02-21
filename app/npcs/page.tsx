import Link from "next/link";
import { Users } from "lucide-react";
import { CampaignNav } from "@/components/campaign-nav";
import { CampaignFooter } from "@/components/campaign-footer";
import { PageHeader } from "@/components/page-header";
import { npcs } from "@/lib/campaign-data";

export const metadata = {
  title: "NPCs | Chronicles of the Shattered Realm",
  description: "Meet the notable non-player characters encountered throughout the campaign.",
};

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

export default function NpcsPage() {
  return (
    <>
      <CampaignNav />
      <main>
        <PageHeader
          breadcrumbs={[{ label: "NPCs", href: "/npcs" }]}
          subtitle="Allies & Contacts"
          title="Notable NPCs"
          icon={Users}
          description="The allies, contacts, and figures of interest the party has encountered on their quest to stop the Dread Sovereign."
        />

        <section className="pb-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {npcs.map((npc) => (
                <Link
                  key={npc.slug}
                  href={`/npcs/${npc.slug}`}
                  className="group flex flex-col overflow-hidden rounded-lg border border-border/50 bg-card transition-colors hover:border-primary/30"
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                      src={npc.image}
                      alt={`Portrait of ${npc.name}`}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <DispositionBadge disposition={npc.disposition} />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="mb-1 text-xs tracking-wider uppercase text-muted-foreground">
                      {npc.race} &middot; {npc.alignment}
                    </p>
                    <h3 className="mb-1 font-serif text-lg font-bold tracking-wide text-foreground">
                      {npc.name}
                    </h3>
                    <p className="mb-2 font-serif text-sm italic text-primary">
                      {npc.title}
                    </p>
                    <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {npc.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <CampaignFooter />
    </>
  );
}
