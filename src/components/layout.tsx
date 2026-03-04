import React from "react";
import { CampaignNav } from "./campaign-nav";
import { CampaignFooter } from "./campaign-footer";

interface LayoutProps {
  title: string;
  baseSlug: string;
  children: React.ReactNode;
}

export function Layout({ title, baseSlug, children }: LayoutProps) {
  return (
    <div className="bg-background font-sans antialiased">
      <CampaignNav title={title} baseSlug={baseSlug} />
      <main>{children}</main>
      <CampaignFooter title={title} baseSlug={baseSlug} />
    </div>
  );
}
