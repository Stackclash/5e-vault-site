"use client";

import { useState } from "react";
import { Users, ChevronDown, ChevronUp } from "lucide-react";

const npcs = [
  {
    name: "Theron Ashvale",
    title: "Archmage of the Silver Council",
    race: "Human",
    image: "/images/npc-theron.jpg",
    alignment: "Lawful Good",
    location: "Mistport (Silver Tower)",
    disposition: "Friendly",
    description:
      "An elderly wizard of immense power and knowledge. Theron serves as the party's primary quest giver and has been researching the Dread Sovereign's phylactery for decades. He speaks in riddles but always has the party's best interests at heart.",
    knownInfo:
      "Holds the map to the phylactery fragments. Lost his apprentice to the Shadow Covenant ten years ago. His magic is weakening as the seals break.",
  },
  {
    name: "Lyra Shadowmend",
    title: "Information Broker",
    race: "Half-Elf",
    image: "/images/npc-lyra.jpg",
    alignment: "Chaotic Neutral",
    disposition: "Neutral",
    location: "Mistport (Dockside Tavern)",
    description:
      "A cunning rogue who deals in secrets and stolen goods. Lyra has connections throughout the underworld and can procure nearly anything for the right price. Her true motivations remain unknown, but she has proven useful.",
    knownInfo:
      "Former member of the Thieves' Guild. Knows the secret passages beneath Mistport. May have ties to the Shadow Covenant, though she denies it.",
  },
  {
    name: "Grimjaw Ironhand",
    title: "Master Smith of Ironhold",
    race: "Half-Orc",
    image: "/images/npc-grimjaw.jpg",
    alignment: "Neutral Good",
    disposition: "Friendly",
    location: "Ironhold (The Great Forge)",
    description:
      "A half-orc blacksmith of legendary skill who fled Ironhold when the corruption took hold. Now works from a makeshift forge near the mountain pass, crafting weapons for the resistance. Deeply loyal to the true king.",
    knownInfo:
      "Knows the layout of Ironhold's inner chambers. Can forge weapons capable of harming shadow creatures. His brother remains inside, trapped under the king's enchantment.",
  },
  {
    name: "Seraphina Dawnlight",
    title: "High Priestess of Solaris",
    race: "Tiefling",
    image: "/images/npc-seraphina.jpg",
    alignment: "Lawful Good",
    disposition: "Friendly",
    location: "Temple of Dawn (Eldergrove)",
    description:
      "A devoted cleric whose radiant faith stands in stark contrast to her infernal heritage. Seraphina tends to the Temple of Dawn, one of the last bastions of holy power against the encroaching darkness. She can heal wounds both physical and spiritual.",
    knownInfo:
      "Can perform the Ritual of Unbinding to cleanse corrupted phylactery fragments. The stolen relic the party seeks belongs to her temple. She senses a traitor among the Silver Council.",
  },
];

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

function NpcCard({ npc }: { npc: (typeof npcs)[number] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="group overflow-hidden rounded-lg border border-border/50 bg-card transition-colors hover:border-primary/30">
      <div className="flex flex-col sm:flex-row">
        {/* Portrait */}
        <div className="relative aspect-square w-full shrink-0 overflow-hidden sm:w-40 md:w-48">
          <img
            src={npc.image}
            alt={`Portrait of ${npc.name}`}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card/60 to-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-card/30" />
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-6">
          <div className="mb-2 flex flex-wrap items-center gap-3">
            <DispositionBadge disposition={npc.disposition} />
            <span className="text-xs tracking-wider uppercase text-muted-foreground">
              {npc.race} &middot; {npc.alignment}
            </span>
          </div>
          <h3 className="mb-1 font-serif text-xl font-bold tracking-wide text-foreground">
            {npc.name}
          </h3>
          <p className="mb-3 font-serif text-sm italic text-primary">
            {npc.title}
          </p>
          <p className="mb-2 text-sm text-muted-foreground">
            {npc.description}
          </p>

          {/* Expandable section */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-2 flex items-center gap-1 font-serif text-xs tracking-wider uppercase text-primary transition-colors hover:text-primary/80"
          >
            {expanded ? "Hide Details" : "Show Details"}
            {expanded ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
          </button>

          {expanded && (
            <div className="mt-4 flex flex-col gap-3 border-t border-border/50 pt-4">
              <div>
                <span className="font-serif text-xs font-semibold tracking-wider uppercase text-accent">
                  Location
                </span>
                <p className="mt-1 text-sm text-muted-foreground">
                  {npc.location}
                </p>
              </div>
              <div>
                <span className="font-serif text-xs font-semibold tracking-wider uppercase text-accent">
                  Known Information
                </span>
                <p className="mt-1 text-sm text-muted-foreground">
                  {npc.knownInfo}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function NpcsSection() {
  return (
    <section id="npcs" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="mb-16 text-center">
          <p className="mb-3 font-serif text-sm tracking-[0.3em] uppercase text-primary">
            Allies & Contacts
          </p>
          <h2 className="mb-4 font-serif text-3xl font-bold tracking-wide text-foreground md:text-5xl">
            Notable NPCs
          </h2>
          <div className="mx-auto mt-4 flex items-center justify-center gap-3">
            <div className="h-px w-12 bg-primary/40" />
            <Users className="h-4 w-4 text-primary" />
            <div className="h-px w-12 bg-primary/40" />
          </div>
        </div>

        {/* NPC grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {npcs.map((npc) => (
            <NpcCard key={npc.name} npc={npc} />
          ))}
        </div>
      </div>
    </section>
  );
}
