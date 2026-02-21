import Link from "next/link";
import { MapPin } from "lucide-react";
import { CampaignNav } from "@/components/campaign-nav";
import { CampaignFooter } from "@/components/campaign-footer";
import { PageHeader } from "@/components/page-header";
import { locations } from "@/lib/campaign-data";

export const metadata = {
  title: "Locations | Chronicles of the Shattered Realm",
  description: "Explore all known regions and landmarks in the campaign world of Vaeltharis.",
};

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

export default function LocationsPage() {
  return (
    <>
      <CampaignNav />
      <main>
        <PageHeader
          breadcrumbs={[{ label: "Locations", href: "/locations" }]}
          subtitle="Known Regions"
          title="Locations"
          icon={MapPin}
          description="All known regions, towns, and landmarks the party has discovered throughout their journey across Vaeltharis."
        />

        <section className="pb-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex flex-col gap-8">
              {locations.map((loc, index) => (
                <Link
                  key={loc.slug}
                  href={`/locations/${loc.slug}`}
                  className={`group flex flex-col overflow-hidden rounded-lg border border-border/50 bg-card transition-colors hover:border-primary/30 lg:flex-row ${index % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
                >
                  {/* Image */}
                  <div className="relative aspect-video w-full overflow-hidden lg:aspect-auto lg:w-2/5">
                    <img
                      src={loc.image}
                      alt={`Illustration of ${loc.name}`}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/30 lg:bg-gradient-to-l" />
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col justify-center p-8 lg:p-12">
                    <div className="mb-4 flex flex-wrap items-center gap-3">
                      <StatusBadge status={loc.status} />
                      <span className="text-xs tracking-wider uppercase text-muted-foreground">
                        {loc.type}
                      </span>
                    </div>
                    <h3 className="mb-3 font-serif text-2xl font-bold tracking-wide text-foreground md:text-3xl">
                      {loc.name}
                    </h3>
                    <p className="mb-6 leading-relaxed text-muted-foreground">
                      {loc.description}
                    </p>
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="font-serif font-semibold tracking-wide text-accent">
                        Known Threats:
                      </span>
                      <span>{loc.threats}</span>
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
