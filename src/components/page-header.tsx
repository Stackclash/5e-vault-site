import { Link } from "gatsby";
import { ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Breadcrumb {
  label: string;
  href: string;
}

interface PageHeaderProps {
  breadcrumbs: Breadcrumb[];
  subtitle: string;
  title: string;
  icon: LucideIcon;
  description?: string;
  image?: string;
  imageAlt?: string;
}

export function PageHeader({
  breadcrumbs,
  subtitle,
  title,
  icon: Icon,
  description,
  image,
  imageAlt,
}: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden">
      {/* Background image (if provided) */}
      {image && (
        <div className="absolute inset-0">
          <img
            src={image}
            alt={imageAlt ?? ""}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-background/80" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30" />
        </div>
      )}

      <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-28 md:pb-20 md:pt-32">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
            <li>
              <Link
                to="/"
                className="transition-colors hover:text-primary"
              >
                Home
              </Link>
            </li>
            {breadcrumbs.map((crumb) => (
              <li key={crumb.href} className="flex items-center gap-1.5">
                <ChevronRight className="h-3.5 w-3.5" />
                <Link
                  to={crumb.href}
                  className="transition-colors hover:text-primary"
                >
                  {crumb.label}
                </Link>
              </li>
            ))}
          </ol>
        </nav>

        {/* Title area */}
        <p className="mb-3 font-serif text-sm tracking-[0.3em] uppercase text-primary">
          {subtitle}
        </p>
        <h1 className="mb-4 font-serif text-4xl font-bold tracking-wide text-foreground md:text-6xl text-balance">
          {title}
        </h1>
        <div className="mt-4 flex items-center gap-3">
          <div className="h-px w-12 bg-primary/40" />
          <Icon className="h-4 w-4 text-primary" />
          <div className="h-px w-12 bg-primary/40" />
        </div>
        {description && (
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
            {description}
          </p>
        )}
      </div>

      {/* Bottom fade */}
      {image && (
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent" />
      )}
    </section>
  );
}
