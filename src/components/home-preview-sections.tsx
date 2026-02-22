import React from "react";
import { Link } from "gatsby";
import { MapPin, Users, Scroll, Gem, BookOpen, ArrowRight } from "lucide-react";
import { SectionHeader } from "./section-header";

// Helper function to extract display name from file node
function getDisplayName(node: any): string {
  return node?.parent?.name ?? "Unknown";
}

function getLocationType(tags: string[]): string {
  if (tags.includes("settlement")) return "Settlement";
  if (tags.includes("region")) return "Region";
  return "Place of Interest";
}

function ViewAllLink({ href, label }: { href: string; label: string }) {
  return (
    <div className="mt-12 flex justify-center">
      <Link to={href} className="group flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-8 py-4 font-serif text-sm tracking-widest uppercase text-primary transition-colors hover:bg-primary/10">
        {label}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}

interface PreviewNode {
  fields: { slug: string; entityType: string };
  frontmatter: Record<string, any>;
  parent: { name: string } | null;
  excerpt: string;
}

interface HomePreviewSectionsProps {
  locations: PreviewNode[];
  npcs: PreviewNode[];
  sessions: PreviewNode[];
  items: PreviewNode[];
  lore: PreviewNode[];
}

function LocationsPreview({ data }: { data: PreviewNode[] }) {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader subtitle="Known Regions" title="Locations" icon={MapPin} />
        <div className="grid gap-6 md:grid-cols-3">
          {data.slice(0, 3).map((loc) => {
            const name = getDisplayName(loc);
            const tags = loc.frontmatter?.tags ?? [];
            return (
              <Link key={loc.fields.slug} to={`/locations/${loc.fields.slug}`} className="group flex flex-col overflow-hidden rounded-lg border border-border/50 bg-card transition-colors hover:border-primary/30">
                <div className="flex flex-1 flex-col p-5">
                  <p className="mb-1 text-xs tracking-wider uppercase text-muted-foreground">{getLocationType(tags)}</p>
                  <h3 className="mb-2 font-serif text-lg font-bold tracking-wide text-foreground">{name}</h3>
                  <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{loc.excerpt}</p>
                </div>
              </Link>
            );
          })}
        </div>
        <ViewAllLink href="/locations" label="View All Locations" />
      </div>
    </section>
  );
}

function NpcsPreview({ data }: { data: PreviewNode[] }) {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader subtitle="Allies & Contacts" title="Notable NPCs" icon={Users} />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {data.slice(0, 4).map((npc) => {
            const name = getDisplayName(npc);
            const race = npc.frontmatter?.race ?? "";
            const alignment = npc.frontmatter?.alignment ?? "";
            const occupation = Array.isArray(npc.frontmatter?.occupation) ? npc.frontmatter.occupation[0] : "";
            return (
              <Link key={npc.fields.slug} to={`/npcs/${npc.fields.slug}`} className="group flex flex-col overflow-hidden rounded-lg border border-border/50 bg-card transition-colors hover:border-primary/30">
                <div className="p-5">
                  <p className="mb-1 text-xs tracking-wider uppercase text-muted-foreground">
                    {typeof race === 'string' && race.includes('|') ? race.split('|')[0].replace(/\[\[.*?\//, '').trim() : race}
                    {alignment ? ` · ${alignment}` : ""}
                  </p>
                  <h3 className="mb-1 font-serif text-lg font-bold tracking-wide text-foreground">{name}</h3>
                  {occupation && <p className="font-serif text-sm italic text-primary">{occupation}</p>}
                </div>
              </Link>
            );
          })}
        </div>
        <ViewAllLink href="/npcs" label="View All NPCs" />
      </div>
    </section>
  );
}

function SessionsPreview({ data }: { data: PreviewNode[] }) {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader subtitle="Adventure Log" title="Recent Sessions" icon={Scroll} />
        <div className="grid gap-6 md:grid-cols-3">
          {data.slice(0, 3).map((session) => {
            const name = getDisplayName(session);
            const date = session.frontmatter?.date ? new Date(session.frontmatter.date).toLocaleDateString() : "";
            const summary = session.frontmatter?.summary ?? session.excerpt;
            return (
              <Link key={session.fields.slug} to={`/sessions/${session.fields.slug}`} className="group flex flex-col rounded-lg border border-border/50 bg-card p-6 transition-colors hover:border-primary/30">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="flex items-center gap-1.5 rounded-sm border border-primary/30 bg-primary/10 px-2 py-0.5 font-serif text-xs tracking-wider uppercase text-primary">Session</span>
                </div>
                <h3 className="mb-2 font-serif text-lg font-bold tracking-wide text-foreground">{name}</h3>
                {date && <p className="mb-3 text-xs text-muted-foreground">{date}</p>}
                <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">{summary}</p>
              </Link>
            );
          })}
        </div>
        <ViewAllLink href="/sessions" label="View All Sessions" />
      </div>
    </section>
  );
}

function ItemsPreview({ data }: { data: PreviewNode[] }) {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader subtitle="Party Inventory" title="Notable Items" icon={Gem} />
        <div className="grid gap-6 md:grid-cols-3">
          {data.slice(0, 3).map((item) => {
            const name = getDisplayName(item);
            const aliases = item.frontmatter?.aliases;
            const displayName = Array.isArray(aliases) && aliases.length > 0 ? aliases[0] : name;
            return (
              <Link key={item.fields.slug} to={`/items/${item.fields.slug}`} className="group flex flex-col overflow-hidden rounded-lg border border-border/50 bg-card transition-colors hover:border-primary/30">
                <div className="p-5">
                  <p className="mb-1 text-xs tracking-wider uppercase text-muted-foreground">Item</p>
                  <h3 className="mb-2 font-serif text-lg font-bold tracking-wide text-foreground">{displayName}</h3>
                  <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{item.excerpt}</p>
                </div>
              </Link>
            );
          })}
        </div>
        <ViewAllLink href="/items" label="View All Items" />
      </div>
    </section>
  );
}

function LorePreview({ data }: { data: PreviewNode[] }) {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader subtitle="World Knowledge" title="Lore & Quests" icon={BookOpen} />
        <div className="grid gap-6 md:grid-cols-3">
          {data.slice(0, 3).map((entry) => {
            const name = getDisplayName(entry);
            const description = entry.frontmatter?.description ?? entry.excerpt;
            return (
              <Link key={entry.fields.slug} to={`/lore/${entry.fields.slug}`} className="group flex flex-col rounded-lg border border-border/50 bg-card p-6 transition-colors hover:border-primary/30">
                <span className="mb-3 inline-flex self-start rounded-sm border border-primary/30 bg-primary/10 px-2 py-0.5 font-serif text-xs tracking-wider uppercase text-primary">Quest</span>
                <h3 className="mb-3 font-serif text-lg font-bold tracking-wide text-foreground">{name}</h3>
                <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">{typeof description === 'string' ? description : ''}</p>
              </Link>
            );
          })}
        </div>
        <ViewAllLink href="/lore" label="View All Lore" />
      </div>
    </section>
  );
}

function SectionDivider() {
  return (
    <div className="mx-auto max-w-7xl px-6">
      <div className="h-px bg-border/30" />
    </div>
  );
}

export function HomePreviewSections({ locations, npcs, sessions, items, lore }: HomePreviewSectionsProps) {
  return (
    <>
      {locations.length > 0 && <LocationsPreview data={locations} />}
      <SectionDivider />
      {npcs.length > 0 && <NpcsPreview data={npcs} />}
      <SectionDivider />
      {sessions.length > 0 && <SessionsPreview data={sessions} />}
      <SectionDivider />
      {items.length > 0 && <ItemsPreview data={items} />}
      <SectionDivider />
      {lore.length > 0 && <LorePreview data={lore} />}
    </>
  );
}
