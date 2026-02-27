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
        name: "vault",
        path: `${__dirname}/vault`,
        fastHash: true,
        ignore: [
          "**/z_Templates/**",
          "**/z_Extra/**",
          "**/z_Scripts/**",
          "**/5. Mechanics/**"
        ]
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
