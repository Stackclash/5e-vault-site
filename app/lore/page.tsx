import Link from "next/link";
import { BookOpen } from "lucide-react";
import { CampaignNav } from "@/components/campaign-nav";
import { CampaignFooter } from "@/components/campaign-footer";
import { PageHeader } from "@/components/page-header";
import { loreEntries } from "@/lib/campaign-data";

export const metadata = {
  title: "Lore & History | Chronicles of the Shattered Realm",
  description: "Discover the rich history, factions, and magical knowledge of Vaeltharis.",
};

export default function LorePage() {
  // Group by category
  const categories = Array.from(new Set(loreEntries.map((e) => e.category)));

  return (
    <>
      <CampaignNav />
      <main>
        <PageHeader
          breadcrumbs={[{ label: "Lore", href: "/lore" }]}
          subtitle="World Knowledge"
          title="Lore & History"
          icon={BookOpen}
          description="Everything the party has learned about the world of Vaeltharis, its factions, artifacts, and ancient history."
        />

        <section className="pb-24">
          <div className="mx-auto max-w-5xl px-6">
            {categories.map((category) => (
              <div key={category} className="mb-16 last:mb-0">
                <h2 className="mb-6 font-serif text-sm tracking-[0.2em] uppercase text-primary">
                  {category}
                </h2>
                <div className="grid gap-6 md:grid-cols-2">
                  {loreEntries
                    .filter((e) => e.category === category)
                    .map((entry) => (
                      <Link
                        key={entry.slug}
                        href={`/lore/${entry.slug}`}
                        className="group rounded-lg border border-border/50 bg-card p-8 transition-colors hover:border-primary/30"
                      >
                        <span className="mb-3 inline-flex rounded-sm border border-primary/30 bg-primary/10 px-2 py-0.5 font-serif text-xs tracking-wider uppercase text-primary">
                          {entry.category}
                        </span>
                        <h3 className="mb-3 font-serif text-lg font-bold tracking-wide text-foreground">
                          {entry.title}
                        </h3>
                        <p className="line-clamp-4 text-sm leading-relaxed text-muted-foreground">
                          {entry.content}
                        </p>
                      </Link>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <CampaignFooter />
    </>
  );
}
