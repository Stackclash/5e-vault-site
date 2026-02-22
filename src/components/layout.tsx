import React from "react";
import { CampaignNav } from "./campaign-nav";
import { CampaignFooter } from "./campaign-footer";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="bg-background font-sans antialiased">
      <CampaignNav />
      <main>{children}</main>
      <CampaignFooter />
    </div>
  );
}
