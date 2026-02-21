import type { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  subtitle: string;
  title: string;
  icon: LucideIcon;
}

export function SectionHeader({ subtitle, title, icon: Icon }: SectionHeaderProps) {
  return (
    <div className="mb-16 text-center">
      <p className="mb-3 font-serif text-sm tracking-[0.3em] uppercase text-primary">
        {subtitle}
      </p>
      <h2 className="mb-4 font-serif text-3xl font-bold tracking-wide text-foreground md:text-5xl text-balance">
        {title}
      </h2>
      <div className="mx-auto mt-4 flex items-center justify-center gap-3">
        <div className="h-px w-12 bg-primary/40" />
        <Icon className="h-4 w-4 text-primary" />
        <div className="h-px w-12 bg-primary/40" />
      </div>
    </div>
  );
}
