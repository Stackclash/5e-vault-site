import { notFound } from "next/navigation";
import Link from "next/link";
import { BookOpen, ArrowLeft } from "lucide-react";
import { CampaignNav } from "@/components/campaign-nav";
import { CampaignFooter } from "@/components/campaign-footer";
import { PageHeader } from "@/components/page-header";
import { loreEntries, getLoreBySlug } from "@/lib/campaign-data";

export function generateStaticParams() {
  return loreEntries.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = getLoreBySlug(slug);
  if (!entry) return {};
  return {
    title: `${entry.title} | Lore | Chronicles of the Shattered Realm`,
    description: entry.content.slice(0, 160),
  };
}

export default async function LoreDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getLoreBySlug(slug);
  if (!entry) notFound();

  const relatedEntries = entry.relatedEntries
    .map(getLoreBySlug)
    .filter(Boolean);

  return (
    <>
      <CampaignNav />
      <main>
        <PageHeader
          breadcrumbs={[
            { label: "Lore", href: "/lore" },
            { label: entry.title, href: `/lore/${entry.slug}` },
          ]}
          subtitle={entry.category}
          title={entry.title}
          icon={BookOpen}
        />

        <section className="py-16">
          <div className="mx-auto max-w-3xl px-6">
            {/* Category badge */}
            <div className="mb-8">
              <span className="inline-flex rounded-sm border border-primary/30 bg-primary/10 px-3 py-1 font-serif text-xs tracking-wider uppercase text-primary">
                {entry.category}
              </span>
            </div>

            {/* Full content */}
            <div className="mb-12">
              <p className="text-lg leading-relaxed text-muted-foreground">
                {entry.content}
              </p>
            </div>

            {/* Related Entries */}
            {relatedEntries.length > 0 && (
              <div className="mb-12">
                <div className="mb-4 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <h2 className="font-serif text-sm font-semibold tracking-wider uppercase text-primary">
                    Related Lore
                  </h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {relatedEntries.map((related) =>
                    related ? (
                      <Link
                        key={related.slug}
                        href={`/lore/${related.slug}`}
                        className="group rounded-lg border border-border/50 bg-card p-5 transition-colors hover:border-primary/30"
                      >
                        <span className="mb-2 inline-flex rounded-sm border border-primary/30 bg-primary/10 px-2 py-0.5 font-serif text-xs tracking-wider uppercase text-primary">
                          {related.category}
                        </span>
                        <h3 className="mb-2 font-serif text-base font-bold tracking-wide text-foreground">
                          {related.title}
                        </h3>
                        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                          {related.content}
                        </p>
                      </Link>
                    ) : null
                  )}
                </div>
              </div>
            )}

            {/* Back link */}
            <Link
              href="/lore"
              className="inline-flex items-center gap-2 font-serif text-sm tracking-wider uppercase text-primary transition-colors hover:text-primary/80"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to All Lore
            </Link>
          </div>
        </section>
      </main>
      <CampaignFooter />
    </>
  );
}
