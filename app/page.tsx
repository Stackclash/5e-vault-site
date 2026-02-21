import { CampaignNav } from "@/components/campaign-nav";
import { HeroSection } from "@/components/hero-section";
import { CampaignOverview } from "@/components/campaign-overview";
import { CampaignFooter } from "@/components/campaign-footer";
import { HomePreviewSections } from "@/components/home-preview-sections";

export default function CampaignPage() {
  return (
    <>
      <CampaignNav />
      <main>
        <HeroSection />
        <CampaignOverview />
        <div className="mx-auto max-w-7xl px-6">
          <div className="h-px bg-border/30" />
        </div>
        <HomePreviewSections />
      </main>
      <CampaignFooter />
    </>
  );
}
