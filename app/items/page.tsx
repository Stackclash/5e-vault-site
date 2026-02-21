import Link from "next/link";
import { Gem } from "lucide-react";
import { CampaignNav } from "@/components/campaign-nav";
import { CampaignFooter } from "@/components/campaign-footer";
import { PageHeader } from "@/components/page-header";
import { items } from "@/lib/campaign-data";

export const metadata = {
  title: "Items | Chronicles of the Shattered Realm",
  description: "Browse the notable magical items and artifacts collected by the party.",
};

function RarityBadge({ rarity }: { rarity: string }) {
  const colors: Record<string, string> = {
    Legendary: "bg-primary/20 text-primary border-primary/30",
    "Very Rare": "bg-accent/20 text-accent border-accent/30",
    Rare: "bg-chart-3/20 text-chart-3 border-chart-3/30",
    Uncommon: "bg-chart-4/20 text-chart-4 border-chart-4/30",
  };
  return (
    <span
      className={`inline-flex rounded-sm border px-2 py-0.5 font-serif text-xs tracking-wider uppercase ${colors[rarity] ?? "bg-muted text-muted-foreground border-border"}`}
    >
      {rarity}
    </span>
  );
}

export default function ItemsPage() {
  return (
    <>
      <CampaignNav />
      <main>
        <PageHeader
          breadcrumbs={[{ label: "Items", href: "/items" }]}
          subtitle="Party Inventory"
          title="Notable Items"
          icon={Gem}
          description="The magical weapons, artifacts, and wondrous items the party has acquired during their adventures."
        />

        <section className="pb-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <Link
                  key={item.slug}
                  href={`/items/${item.slug}`}
                  className="group flex flex-col overflow-hidden rounded-lg border border-border/50 bg-card transition-colors hover:border-primary/30"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={item.image}
                      alt={`Illustration of ${item.name}`}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <RarityBadge rarity={item.rarity} />
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <p className="mb-1 text-xs tracking-wider uppercase text-muted-foreground">
                      {item.type}
                    </p>
                    <h3 className="mb-2 font-serif text-xl font-bold tracking-wide text-foreground">
                      {item.name}
                    </h3>
                    <p className="mb-4 flex-1 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>

                    <div className="mb-4">
                      <h4 className="mb-2 font-serif text-xs font-semibold tracking-wider uppercase text-accent">
                        Properties
                      </h4>
                      <ul className="flex flex-col gap-1.5">
                        {item.properties.slice(0, 3).map((prop) => (
                          <li
                            key={prop}
                            className="flex items-start gap-2 text-xs text-muted-foreground"
                          >
                            <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-primary" />
                            {prop}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-col gap-1 border-t border-border/50 pt-4 text-xs text-muted-foreground">
                      <span>
                        <span className="font-serif font-semibold text-foreground">
                          Held by:
                        </span>{" "}
                        {item.holder}
                      </span>
                    </div>
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
