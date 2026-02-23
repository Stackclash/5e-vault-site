import React from "react";
import { CampaignNav } from "./campaign-nav";
import { CampaignFooter } from "./campaign-footer";

interface LayoutProps {
  children: React.ReactNode;
  campaignSlug?: string;
}

export function Layout({ children, campaignSlug }: LayoutProps) {
  return (
    <div className="bg-background font-sans antialiased">
      <CampaignNav campaignSlug={campaignSlug} />
      <main>{children}</main>
      <CampaignFooter />
    </div>
  );
}
