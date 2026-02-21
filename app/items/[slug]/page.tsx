import { notFound } from "next/navigation";
import Link from "next/link";
import { Gem, ArrowLeft, Scroll, Sparkles } from "lucide-react";
import { CampaignNav } from "@/components/campaign-nav";
import { CampaignFooter } from "@/components/campaign-footer";
import { PageHeader } from "@/components/page-header";
import {
  items,
  getItemBySlug,
  getSessionByNumber,
} from "@/lib/campaign-data";

export function generateStaticParams() {
  return items.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getItemBySlug(slug);
  if (!item) return {};
  return {
    title: `${item.name} | Items | Chronicles of the Shattered Realm`,
    description: item.description,
  };
}

function RarityBadge({ rarity }: { rarity: string }) {
  const colors: Record<string, string> = {
    Legendary: "bg-primary/20 text-primary border-primary/30",
    "Very Rare": "bg-accent/20 text-accent border-accent/30",
    Rare: "bg-chart-3/20 text-chart-3 border-chart-3/30",
    Uncommon: "bg-chart-4/20 text-chart-4 border-chart-4/30",
  };
  return (
    <span
      className={`inline-flex rounded-sm border px-3 py-1 font-serif text-xs tracking-wider uppercase ${colors[rarity] ?? "bg-muted text-muted-foreground border-border"}`}
    >
      {rarity}
    </span>
  );
}

export default async function ItemDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getItemBySlug(slug);
  if (!item) notFound();

  const foundInSession = item.foundInSession
    ? getSessionByNumber(item.foundInSession)
    : null;

  return (
    <>
      <CampaignNav />
      <main>
        <PageHeader
          breadcrumbs={[
            { label: "Items", href: "/items" },
            { label: item.name, href: `/items/${item.slug}` },
          ]}
          subtitle={item.type}
          title={item.name}
          icon={Gem}
        />

        <section className="py-16">
          <div className="mx-auto max-w-5xl px-6">
            <div className="flex flex-col gap-12 lg:flex-row">
              {/* Image */}
              <div className="shrink-0 lg:w-96">
                <div className="overflow-hidden rounded-lg border border-border/50">
                  <img
                    src={item.image}
                    alt={`Illustration of ${item.name}`}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Quick stats */}
                <div className="mt-6 flex flex-col gap-3 rounded-lg border border-border/50 bg-card p-6">
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                      Rarity
                    </span>
                    <RarityBadge rarity={item.rarity} />
                  </div>
                  <div className="h-px bg-border/30" />
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                      Type
                    </span>
                    <span className="text-sm text-foreground">{item.type}</span>
                  </div>
                  <div className="h-px bg-border/30" />
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                      Held By
                    </span>
                    <span className="text-sm text-foreground">
                      {item.holder}
                    </span>
                  </div>
                  <div className="h-px bg-border/30" />
                  <div className="flex flex-col gap-1">
                    <span className="font-serif text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                      Attunement
                    </span>
                    <span className="text-sm italic text-muted-foreground">
                      {item.attunement}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                {/* Description */}
                <div className="mb-10">
                  <h2 className="mb-4 font-serif text-xl font-bold tracking-wide text-foreground">
                    Description
                  </h2>
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>

                {/* Properties */}
                <div className="mb-10 rounded-lg border border-primary/20 bg-primary/5 p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <h2 className="font-serif text-sm font-semibold tracking-wider uppercase text-primary">
                      Properties
                    </h2>
                  </div>
                  <ul className="flex flex-col gap-3">
                    {item.properties.map((prop) => (
                      <li
                        key={prop}
                        className="flex items-start gap-3 text-muted-foreground"
                      >
                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                        <span className="leading-relaxed">{prop}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Found in session */}
                {foundInSession && (
                  <div className="mb-10">
                    <div className="mb-4 flex items-center gap-2">
                      <Scroll className="h-4 w-4 text-primary" />
                      <h2 className="font-serif text-sm font-semibold tracking-wider uppercase text-primary">
                        Found In
                      </h2>
                    </div>
                    <Link
                      href={`/sessions/${foundInSession.slug}`}
                      className="group flex items-center gap-4 rounded-lg border border-border/50 bg-card p-4 transition-colors hover:border-primary/30"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 font-serif text-sm font-bold text-primary">
                        {foundInSession.number}
                      </div>
                      <div>
                        <h3 className="font-serif text-base font-bold text-foreground">
                          {foundInSession.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {foundInSession.date}
                        </p>
                      </div>
                    </Link>
                  </div>
                )}

                {/* Back link */}
                <Link
                  href="/items"
                  className="inline-flex items-center gap-2 font-serif text-sm tracking-wider uppercase text-primary transition-colors hover:text-primary/80"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to All Items
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
