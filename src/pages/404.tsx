import React from "react";
import { graphql, Link, PageProps } from "gatsby";
import { Compass } from "lucide-react";
import { Layout } from "../components/layout";
import { Seo } from "../components/seo";

export default function NotFoundPage({ data }: PageProps<Queries.NotFoundQuery>) {
  const campaign = data.campaigns.nodes[0];

  return (
    <Layout title={campaign?.name ?? "Campaign Compendium"}>
      <section className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-6 pt-20 text-center">
        <Compass className="mb-6 h-12 w-12 text-primary/60" />
        <p className="mb-3 font-serif text-sm tracking-[0.3em] uppercase text-primary">Lost the trail</p>
        <h1 className="mb-4 font-serif text-5xl font-bold tracking-wide text-foreground">404</h1>
        <p className="mb-10 max-w-md text-lg leading-relaxed text-muted-foreground">
          This path leads nowhere on the map. The page you sought may have been moved or never existed.
        </p>
        <Link
          to="/"
          className="rounded-lg border border-primary/30 bg-primary/5 px-8 py-4 font-serif text-sm tracking-widest uppercase text-primary transition-colors hover:bg-primary/10"
        >
          Return Home
        </Link>
      </section>
    </Layout>
  );
}

export function Head() {
  return <Seo title="Page Not Found" />;
}

export const query = graphql`
  query NotFound {
    campaigns: allCampaign {
      nodes {
        name
      }
    }
  }
`;
