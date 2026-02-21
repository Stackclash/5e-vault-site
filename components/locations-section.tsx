import { MapPin } from "lucide-react";

const locations = [
  {
    name: "The Eldergrove",
    type: "Enchanted Forest",
    image: "/images/location-eldergrove.jpg",
    description:
      "An ancient woodland where the trees whisper secrets of ages past. Home to druids and fey creatures, the Eldergrove holds the first seal of the Dread Sovereign's prison. The canopy glows with bioluminescent moss at night.",
    status: "Explored",
    threats: "Corrupted treants, shadow sprites",
  },
  {
    name: "Ironhold Fortress",
    type: "Dwarven Stronghold",
    image: "/images/location-ironhold.jpg",
    description:
      "A massive fortress carved into the heart of Mount Anvil. Once the jewel of dwarven civilization, Ironhold has fallen under a dark enchantment. King Duran III rules from a cursed throne, and the forges burn with unnatural flame.",
    status: "Current Objective",
    threats: "Corrupted dwarven guard, shadow constructs, the cursed king",
  },
  {
    name: "Mistport",
    type: "Coastal Town",
    image: "/images/location-mistport.jpg",
    description:
      "A fog-shrouded harbor town where smugglers and merchants trade in equal measure. The party's base of operations, with contacts in the Dockside Tavern. Rumored to house a secret entrance to the Underdark beneath its warehouses.",
    status: "Safe Haven",
    threats: "Thieves' guild, occasional sea monsters",
  },
];

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

export function LocationsSection() {
  return (
    <section id="locations" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="mb-16 text-center">
          <p className="mb-3 font-serif text-sm tracking-[0.3em] uppercase text-primary">
            Known Regions
          </p>
          <h2 className="mb-4 font-serif text-3xl font-bold tracking-wide text-foreground md:text-5xl">
            Locations
          </h2>
          <div className="mx-auto mt-4 flex items-center justify-center gap-3">
            <div className="h-px w-12 bg-primary/40" />
            <MapPin className="h-4 w-4 text-primary" />
            <div className="h-px w-12 bg-primary/40" />
          </div>
        </div>

        {/* Location cards */}
        <div className="flex flex-col gap-12">
          {locations.map((location, index) => (
            <div
              key={location.name}
              className={`group flex flex-col overflow-hidden rounded-lg border border-border/50 bg-card transition-colors hover:border-primary/30 lg:flex-row ${index % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
            >
              {/* Image */}
              <div className="relative aspect-video w-full overflow-hidden lg:aspect-auto lg:w-2/5">
                <img
                  src={location.image}
                  alt={`Illustration of ${location.name}`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/30 lg:bg-gradient-to-l" />
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col justify-center p-8 lg:p-12">
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <StatusBadge status={location.status} />
                  <span className="text-xs tracking-wider uppercase text-muted-foreground">
                    {location.type}
                  </span>
                </div>
                <h3 className="mb-3 font-serif text-2xl font-bold tracking-wide text-foreground md:text-3xl">
                  {location.name}
                </h3>
                <p className="mb-6 leading-relaxed text-muted-foreground">
                  {location.description}
                </p>
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="font-serif font-semibold tracking-wide text-accent">
                    Known Threats:
                  </span>
                  <span>{location.threats}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
