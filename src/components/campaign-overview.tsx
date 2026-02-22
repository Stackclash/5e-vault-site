import { BookOpen, Flame, Clock, Target } from "lucide-react";

export function CampaignOverview() {
  return (
    <section id="overview" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="mb-16 text-center">
          <p className="mb-3 font-serif text-sm tracking-[0.3em] uppercase text-primary">
            Campaign Overview
          </p>
          <h2 className="mb-4 font-serif text-3xl font-bold tracking-wide text-foreground md:text-5xl">
            The Story So Far
          </h2>
          <div className="mx-auto mt-4 flex items-center justify-center gap-3">
            <div className="h-px w-12 bg-primary/40" />
            <BookOpen className="h-4 w-4 text-primary" />
            <div className="h-px w-12 bg-primary/40" />
          </div>
        </div>

        {/* Main narrative */}
        <div className="mx-auto mb-16 max-w-3xl">
          <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
            In the war-torn continent of Vaeltharis, five adventurers were drawn
            together by fate and prophecy. What began as a simple escort mission
            through the Eldergrove has spiraled into a desperate quest to
            prevent the resurrection of the Dread Sovereign, an ancient lich
            whose phylactery was shattered into five fragments scattered across
            the realm.
          </p>
          <p className="text-lg leading-relaxed text-muted-foreground">
            With two fragments recovered and dark agents closing in, the party
            now faces their greatest challenge yet: infiltrating the fortress of
            Ironhold, where the third fragment is guarded by a corrupted dwarven
            king under the thrall of shadow magic.
          </p>
        </div>

        {/* Info cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="group rounded-lg border border-border/50 bg-card p-8 transition-colors hover:border-primary/30">
            <Flame className="mb-4 h-6 w-6 text-accent" />
            <h3 className="mb-2 font-serif text-lg font-semibold tracking-wide text-foreground">
              Current Arc
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              The Siege of Ironhold. The party must find a way into the dwarven
              fortress, break the king&apos;s enchantment, and secure the third
              phylactery fragment before the Shadow Covenant arrives.
            </p>
          </div>

          <div className="group rounded-lg border border-border/50 bg-card p-8 transition-colors hover:border-primary/30">
            <Clock className="mb-4 h-6 w-6 text-accent" />
            <h3 className="mb-2 font-serif text-lg font-semibold tracking-wide text-foreground">
              Next Session
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Session 25 is scheduled for Saturday evening. The party stands at
              the gates of Ironhold, having secured passage through the
              Undermines. Prepare for combat and diplomacy.
            </p>
          </div>

          <div className="group rounded-lg border border-border/50 bg-card p-8 transition-colors hover:border-primary/30 md:col-span-2 lg:col-span-1">
            <Target className="mb-4 h-6 w-6 text-accent" />
            <h3 className="mb-2 font-serif text-lg font-semibold tracking-wide text-foreground">
              Active Quests
            </h3>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Retrieve the Third Fragment from Ironhold
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                Discover the identity of the Shadow Covenant leader
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                Return the stolen relic to the Temple of Dawn
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
