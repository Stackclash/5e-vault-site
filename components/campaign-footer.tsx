import Link from "next/link";
import { Shield, Swords } from "lucide-react";

const footerLinks = [
  { label: "Locations", href: "/locations" },
  { label: "NPCs", href: "/npcs" },
  { label: "Sessions", href: "/sessions" },
  { label: "Items", href: "/items" },
  { label: "Lore", href: "/lore" },
];

export function CampaignFooter() {
  return (
    <footer className="border-t border-border/50 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center gap-6 text-center">
          {/* Logo and title */}
          <Link
            href="/"
            className="flex items-center gap-2 text-primary transition-colors hover:text-primary/80"
          >
            <Shield className="h-5 w-5" />
            <span className="font-serif text-lg font-semibold tracking-wider uppercase">
              Shattered Realm
            </span>
          </Link>

          {/* Nav links */}
          <nav aria-label="Footer navigation" className="flex flex-wrap justify-center gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-serif text-xs tracking-widest uppercase text-muted-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Decorative divider */}
          <div className="flex items-center gap-3">
            <div className="h-px w-8 bg-border" />
            <Swords className="h-4 w-4 text-muted-foreground" />
            <div className="h-px w-8 bg-border" />
          </div>

          {/* Flavor text */}
          <p className="max-w-md text-sm italic leading-relaxed text-muted-foreground">
            &ldquo;The road is long and the darkness deep, but those who carry
            the light need never walk alone.&rdquo;
          </p>
          <p className="text-xs tracking-wider uppercase text-muted-foreground/60">
            &mdash; Inscription on the Temple of Dawn
          </p>

          {/* Meta */}
          <div className="mt-4 flex flex-col items-center gap-2 text-xs text-muted-foreground/50">
            <span>
              Campaign managed with care. All content is fictional and created
              for entertainment.
            </span>
            <span>
              Dungeons & Dragons is a trademark of Wizards of the Coast.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
