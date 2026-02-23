import { Scroll, Users, MapPin, Swords } from "lucide-react";

const stats = [
  { icon: Scroll, label: "Sessions Played", value: "24" },
  { icon: Users, label: "Active Players", value: "5" },
  { icon: MapPin, label: "Locations Explored", value: "12" },
  { icon: Swords, label: "Quests Completed", value: "8" },
];

export function HeroSection({ campaignName, campaignDescription }: { campaignName: string; campaignDescription: string }) {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="/images/hero-banner.jpg"
          alt="A vast fantasy landscape with a gothic castle silhouetted against a twilight sky"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-background/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/20" />
      </div>

      {/* Content */}
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 pt-20 text-center">
        <p className="mb-4 font-serif text-sm tracking-[0.3em] uppercase text-primary">
          A Dungeons & Dragons Campaign
        </p>
        <h1 className="mb-6 max-w-4xl font-serif text-5xl font-bold leading-tight tracking-wide text-foreground md:text-7xl lg:text-8xl text-balance">
          {campaignName}
        </h1>
        <p className="mb-12 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl text-pretty">
          {campaignDescription}
        </p>

        {/* Decorative divider */}
        <div className="mb-12 flex items-center gap-4">
          <div className="h-px w-16 bg-primary/40" />
          <Swords className="h-5 w-5 text-primary" />
          <div className="h-px w-16 bg-primary/40" />
        </div>

        {/* Stats row */}
        <div className="grid w-full max-w-3xl grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-2 rounded-lg border border-border/50 bg-card/50 px-4 py-6 backdrop-blur-sm"
            >
              <stat.icon className="h-5 w-5 text-primary" />
              <span className="font-serif text-2xl font-bold text-foreground">
                {stat.value}
              </span>
              <span className="text-xs tracking-wider uppercase text-muted-foreground">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
