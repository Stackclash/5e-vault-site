import React from "react";
import { CampaignNav } from "./campaign-nav";
import { CampaignFooter } from "./campaign-footer";

interface LayoutProps {
  title: string;
  children: React.ReactNode;
}

export function Layout({ title, children }: LayoutProps) {
  return (
    <div className="bg-background font-sans antialiased">
      <CampaignNav title={title} />
      <main>{children}</main>
      <CampaignFooter title={title} />
    </div>
  );
}
