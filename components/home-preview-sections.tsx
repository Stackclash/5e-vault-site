import Link from "next/link";
import {
  MapPin,
  Users,
  Scroll,
  Gem,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { locations, npcs, sessions, items, loreEntries } from "@/lib/campaign-data";
import { SectionHeader } from "@/components/section-header";

/* ─── Shared "View All" Link ──────────────────────────────────── */

function ViewAllLink({ href, label }: { href: string; label: string }) {
  return (
    <div className="mt-12 flex justify-center">
      <Link
        href={href}
        className="group flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-8 py-4 font-serif text-sm tracking-widest uppercase text-primary transition-colors hover:bg-primary/10"
      >
        {label}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}

/* ─── Status / Rarity / Disposition Badges ─────────────────────── */

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

/* ─── Locations Preview ────────────────────────────────────────── */

function LocationsPreview() {
  const preview = locations.slice(0, 3);
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          subtitle="Known Regions"
          title="Locations"
          icon={MapPin}
        />
        <div className="grid gap-6 md:grid-cols-3">
          {preview.map((loc) => (
            <Link
              key={loc.slug}
              href={`/locations/${loc.slug}`}
              className="group flex flex-col overflow-hidden rounded-lg border border-border/50 bg-card transition-colors hover:border-primary/30"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={loc.image}
                  alt={`Illustration of ${loc.name}`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <StatusBadge status={loc.status} />
                </div>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="mb-1 text-xs tracking-wider uppercase text-muted-foreground">
                  {loc.type}
                </p>
                <h3 className="mb-2 font-serif text-lg font-bold tracking-wide text-foreground">
                  {loc.name}
                </h3>
                <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                  {loc.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
        <ViewAllLink href="/locations" label="View All Locations" />
      </div>
    </section>
  );
}

/* ─── NPCs Preview ─────────────────────────────────────────────── */

function NpcsPreview() {
  const preview = npcs.slice(0, 4);
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          subtitle="Allies & Contacts"
          title="Notable NPCs"
          icon={Users}
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {preview.map((npc) => (
            <Link
              key={npc.slug}
              href={`/npcs/${npc.slug}`}
              className="group flex flex-col overflow-hidden rounded-lg border border-border/50 bg-card transition-colors hover:border-primary/30"
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={npc.image}
                  alt={`Portrait of ${npc.name}`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <DispositionBadge disposition={npc.disposition} />
                </div>
              </div>
              <div className="p-5">
                <p className="mb-1 text-xs tracking-wider uppercase text-muted-foreground">
                  {npc.race}
                </p>
                <h3 className="mb-1 font-serif text-lg font-bold tracking-wide text-foreground">
                  {npc.name}
                </h3>
                <p className="font-serif text-sm italic text-primary">
                  {npc.title}
                </p>
              </div>
            </Link>
          ))}
        </div>
        <ViewAllLink href="/npcs" label="View All NPCs" />
      </div>
    </section>
  );
}

/* ─── Sessions Preview ─────────────────────────────────────────── */

function SessionsPreview() {
  const preview = sessions.slice(0, 3);
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          subtitle="Adventure Log"
          title="Recent Sessions"
          icon={Scroll}
        />
        <div className="grid gap-6 md:grid-cols-3">
          {preview.map((session) => (
            <Link
              key={session.slug}
              href={`/sessions/${session.slug}`}
              className="group flex flex-col rounded-lg border border-border/50 bg-card p-6 transition-colors hover:border-primary/30"
            >
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1.5 rounded-sm border border-primary/30 bg-primary/10 px-2 py-0.5 font-serif text-xs tracking-wider uppercase text-primary">
                  #{session.number}
                </span>
                <span className="flex items-center gap-1.5 rounded-sm border border-accent/30 bg-accent/10 px-2 py-0.5 font-serif text-xs tracking-wider uppercase text-accent">
                  {session.highlight}
                </span>
              </div>
              <h3 className="mb-2 font-serif text-lg font-bold tracking-wide text-foreground">
                {session.title}
              </h3>
              <p className="mb-3 text-xs text-muted-foreground">
                {session.date}
              </p>
              <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                {session.summary}
              </p>
            </Link>
          ))}
        </div>
        <ViewAllLink href="/sessions" label="View All Sessions" />
      </div>
    </section>
  );
}

/* ─── Items Preview ────────────────────────────────────────────── */

function ItemsPreview() {
  const preview = items.slice(0, 3);
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          subtitle="Party Inventory"
          title="Notable Items"
          icon={Gem}
        />
        <div className="grid gap-6 md:grid-cols-3">
          {preview.map((item) => (
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
                <div className="absolute bottom-3 left-3">
                  <RarityBadge rarity={item.rarity} />
                </div>
              </div>
              <div className="p-5">
                <p className="mb-1 text-xs tracking-wider uppercase text-muted-foreground">
                  {item.type}
                </p>
                <h3 className="mb-2 font-serif text-lg font-bold tracking-wide text-foreground">
                  {item.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Held by: {item.holder}
                </p>
              </div>
            </Link>
          ))}
        </div>
        <ViewAllLink href="/items" label="View All Items" />
      </div>
    </section>
  );
}

/* ─── Lore Preview ─────────────────────────────────────────────── */

function LorePreview() {
  const preview = loreEntries.slice(0, 3);
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          subtitle="World Knowledge"
          title="Lore & History"
          icon={BookOpen}
        />
        <div className="grid gap-6 md:grid-cols-3">
          {preview.map((entry) => (
            <Link
              key={entry.slug}
              href={`/lore/${entry.slug}`}
              className="group flex flex-col rounded-lg border border-border/50 bg-card p-6 transition-colors hover:border-primary/30"
            >
              <span className="mb-3 inline-flex self-start rounded-sm border border-primary/30 bg-primary/10 px-2 py-0.5 font-serif text-xs tracking-wider uppercase text-primary">
                {entry.category}
              </span>
              <h3 className="mb-3 font-serif text-lg font-bold tracking-wide text-foreground">
                {entry.title}
              </h3>
              <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                {entry.content}
              </p>
            </Link>
          ))}
        </div>
        <ViewAllLink href="/lore" label="View All Lore" />
      </div>
    </section>
  );
}

/* ─── Assembled Preview Sections ───────────────────────────────── */

export function HomePreviewSections() {
  return (
    <>
      <LocationsPreview />
      <div className="mx-auto max-w-7xl px-6">
        <div className="h-px bg-border/30" />
      </div>
      <NpcsPreview />
      <div className="mx-auto max-w-7xl px-6">
        <div className="h-px bg-border/30" />
      </div>
      <SessionsPreview />
      <div className="mx-auto max-w-7xl px-6">
        <div className="h-px bg-border/30" />
      </div>
      <ItemsPreview />
      <div className="mx-auto max-w-7xl px-6">
        <div className="h-px bg-border/30" />
      </div>
      <LorePreview />
    </>
  );
}
