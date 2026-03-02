import type { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
  graphqlTypegen: true,
  siteMetadata: {
    title: "Chronicles of the Shattered Realm | Campaign Compendium",
    description:
      "A digital compendium for a D&D 5e campaign set in the Shattered Realm.",
    theme: {
      backgroundImage: "/images/hero-banner.jpg",
      fonts: {
        heading: "'Cinzel', 'Times New Roman', serif",
        body: "'Crimson Text', 'Georgia', serif",
      },
      colors: {
        background: "oklch(0.14 0.005 60)",
        foreground: "oklch(0.88 0.02 80)",
        primary: "oklch(0.75 0.12 70)",
        accent: "oklch(0.65 0.15 45)",
        card: "oklch(0.18 0.008 60)",
        border: "oklch(0.28 0.015 55)",
        muted: "oklch(0.22 0.01 50)",
        mutedForeground: "oklch(0.58 0.03 60)",
      },
    },
  },
  plugins: [
    "gatsby-plugin-postcss",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "campaign",
        path: `${__dirname}/vault/1. DM Stuff/Campaigns`,
        fastHash: true,
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "party",
        path: `${__dirname}/vault/3. The Party/Parties`,
        fastHash: true,
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "session",
        path: `${__dirname}/vault/1. DM Stuff/Session Journals`,
        fastHash: true,
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "world",
        path: `${__dirname}/vault/4. World Almanac/Worlds`,
        fastHash: true,
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "npc",
        path: `${__dirname}/vault/4. World Almanac/NPCs`,
        fastHash: true,
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "location",
        path: `${__dirname}/vault/4. World Almanac`,
        ignore: [
          "**/Worlds/**",
          "**/NPCs/**",
        ],
        fastHash: true,
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "quest",
        path: `${__dirname}/vault/3. The Party/Quests`,
        fastHash: true,
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: `${__dirname}/static/images`,
      },
    },
    {
      resolve: 'gatsby-plugin-mdx',
      options: {
          extensions: ['.md'],
          gatsbyRemarkPlugins: ['gatsby-remark-obsidian']
      }
    },
  ],
};

export default config;
