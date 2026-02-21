"use client";

import { useState } from "react";
import { Scroll, ChevronDown, ChevronUp, Skull, Star, AlertTriangle } from "lucide-react";

const sessions = [
  {
    number: 24,
    title: "Whispers in the Undermines",
    date: "February 15, 2026",
    highlight: "Key Discovery",
    summary:
      "The party descended into the Undermines beneath Mount Anvil, following Grimjaw's hand-drawn map. After navigating flooded tunnels and a collapsed mining shaft, they discovered a secret passage leading directly to Ironhold's undercroft. A tense encounter with a shadow patrol nearly ended in disaster, but Vex's quick thinking and a well-placed Silence spell saved the group.",
    keyEvents: [
      "Discovered the Undermines passage to Ironhold",
      "Encountered and evaded a shadow patrol of 6 corrupted dwarves",
      "Found ancient dwarven runes that may weaken the king's enchantment",
      "Kael attuned to the Sunblade found in Session 22",
    ],
    lootFound: ["Scroll of Dispel Magic", "3 potions of Shadow Resistance"],
  },
  {
    number: 23,
    title: "The Smith's Bargain",
    date: "February 8, 2026",
    highlight: "New Ally",
    summary:
      "The party tracked down Grimjaw Ironhand at his exile forge near the mountain pass. After proving their intentions by defeating a band of shadow raiders attacking his forge, Grimjaw agreed to help them infiltrate Ironhold. He revealed that King Duran is being controlled through a cursed crown, and that his brother Tormund is among the enchanted guard.",
    keyEvents: [
      "Recruited Grimjaw Ironhand as an ally",
      "Defeated 8 shadow raiders in a pitched battle at the forge",
      "Learned about the Cursed Crown controlling King Duran",
      "Grimjaw forged silvered weapons for the party",
    ],
    lootFound: ["Silvered Longsword", "Silvered Arrows (20)", "Grimjaw's Map of Ironhold"],
  },
  {
    number: 22,
    title: "The Sunken Vault",
    date: "February 1, 2026",
    highlight: "Boss Fight",
    summary:
      "Deep within the ruins beneath the Eldergrove, the party confronted the guardian of the second phylactery fragment: an ancient treant corrupted by shadow magic. The battle was fierce, with Mira nearly falling to the creature's crushing vines. In the aftermath, they recovered the fragment and discovered the legendary Sunblade hidden in the vault.",
    keyEvents: [
      "Defeated the Corrupted Ancient Treant (boss encounter)",
      "Recovered the Second Phylactery Fragment",
      "Found the legendary Sunblade in the Sunken Vault",
      "Seraphina performed a partial cleansing ritual on the fragment",
    ],
    lootFound: ["Second Phylactery Fragment", "Sunblade", "Ring of Forest Walking"],
  },
  {
    number: 21,
    title: "Roots of Corruption",
    date: "January 25, 2026",
    highlight: "Exploration",
    summary:
      "The party ventured deeper into the Eldergrove following Theron's divination. They discovered that the forest's corruption stemmed from the second phylactery fragment buried in a sunken elven vault. After solving a series of ancient puzzles and befriending a displaced dryad named Willow, they located the vault entrance.",
    keyEvents: [
      "Explored the deep Eldergrove and found signs of corruption",
      "Befriended Willow the Dryad, who guided them to the vault",
      "Solved the Puzzle of the Four Seasons to unlock the vault",
      "Detected a Shadow Covenant spy following the party",
    ],
    lootFound: ["Cloak of Elvenkind", "Dryad's Blessing (temporary buff)"],
  },
  {
    number: 20,
    title: "Council of Shadows",
    date: "January 18, 2026",
    highlight: "Roleplay Heavy",
    summary:
      "Back in Mistport, the party reported their findings to Theron and the Silver Council. Tensions ran high as council members debated the best course of action. Lyra Shadowmend approached the party privately with intelligence about Shadow Covenant movements. The session ended with a shocking revelation: someone on the Silver Council is feeding information to the enemy.",
    keyEvents: [
      "Reported to the Silver Council in Mistport",
      "Learned of a traitor within the Silver Council",
      "Lyra provided intel on Shadow Covenant's next target: Ironhold",
      "Theron revealed the existence of a third fragment in Ironhold",
    ],
    lootFound: ["1000 gold from the Council", "Sending Stones (pair)"],
  },
];

function HighlightIcon({ highlight }: { highlight: string }) {
  const icons: Record<string, React.ReactNode> = {
    "Boss Fight": <Skull className="h-3.5 w-3.5" />,
    "Key Discovery": <Star className="h-3.5 w-3.5" />,
    "New Ally": <Star className="h-3.5 w-3.5" />,
    Exploration: <Star className="h-3.5 w-3.5" />,
    "Roleplay Heavy": <AlertTriangle className="h-3.5 w-3.5" />,
  };
  return <>{icons[highlight] ?? <Star className="h-3.5 w-3.5" />}</>;
}

function SessionCard({ session }: { session: (typeof sessions)[number] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="group relative flex gap-6">
      {/* Timeline dot and line */}
      <div className="hidden flex-col items-center sm:flex">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-card font-serif text-sm font-bold text-primary">
          {session.number}
        </div>
        <div className="w-px flex-1 bg-border/50" />
      </div>

      {/* Card */}
      <div className="mb-8 flex-1 rounded-lg border border-border/50 bg-card p-6 transition-colors hover:border-primary/30 lg:p-8">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1.5 rounded-sm border border-primary/30 bg-primary/10 px-2 py-0.5 font-serif text-xs tracking-wider uppercase text-primary sm:hidden">
            <span>#{session.number}</span>
          </span>
          <span className="flex items-center gap-1.5 rounded-sm border border-accent/30 bg-accent/10 px-2 py-0.5 font-serif text-xs tracking-wider uppercase text-accent">
            <HighlightIcon highlight={session.highlight} />
            {session.highlight}
          </span>
          <span className="text-xs text-muted-foreground">{session.date}</span>
        </div>

        <h3 className="mb-3 font-serif text-xl font-bold tracking-wide text-foreground">
          {session.title}
        </h3>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          {session.summary}
        </p>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 font-serif text-xs tracking-wider uppercase text-primary transition-colors hover:text-primary/80"
        >
          {expanded ? "Hide Details" : "Key Events & Loot"}
          {expanded ? (
            <ChevronUp className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )}
        </button>

        {expanded && (
          <div className="mt-4 grid gap-6 border-t border-border/50 pt-4 md:grid-cols-2">
            <div>
              <h4 className="mb-3 font-serif text-xs font-semibold tracking-wider uppercase text-accent">
                Key Events
              </h4>
              <ul className="flex flex-col gap-2">
                {session.keyEvents.map((event) => (
                  <li
                    key={event}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {event}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-3 font-serif text-xs font-semibold tracking-wider uppercase text-accent">
                Loot Found
              </h4>
              <ul className="flex flex-col gap-2">
                {session.lootFound.map((loot) => (
                  <li
                    key={loot}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {loot}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function SessionsSection() {
  return (
    <section id="sessions" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="mb-16 text-center">
          <p className="mb-3 font-serif text-sm tracking-[0.3em] uppercase text-primary">
            Adventure Log
          </p>
          <h2 className="mb-4 font-serif text-3xl font-bold tracking-wide text-foreground md:text-5xl">
            Session Summaries
          </h2>
          <div className="mx-auto mt-4 flex items-center justify-center gap-3">
            <div className="h-px w-12 bg-primary/40" />
            <Scroll className="h-4 w-4 text-primary" />
            <div className="h-px w-12 bg-primary/40" />
          </div>
        </div>

        {/* Sessions timeline */}
        <div className="mx-auto max-w-4xl">
          {sessions.map((session) => (
            <SessionCard key={session.number} session={session} />
          ))}
        </div>
      </div>
    </section>
  );
}
