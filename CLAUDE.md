# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A Gatsby 5 static site that publishes a player-facing D&D campaign compendium from the DM's Obsidian vault. The vault is a git submodule at `vault/` (github.com/Stackclash/5e-vault) and is treated as read-only input full of DM-only spoilers — the entire build pipeline exists to extract only player-safe content from it. If you edit vault notes themselves, follow `vault/CLAUDE.md`.

`TODO.md` tracks the phased build-out and a **locked decisions** table. Read it before structural changes; do not re-litigate locked decisions.

## Commands

Package manager is yarn. The vault submodule must be present before anything builds: `git submodule update --init vault`.

- `yarn dev` — gatsby develop (cleans first via predev); GraphiQL at http://localhost:8000/___graphql
- `yarn build` — production build (cleans first)
- `yarn serve` — serve the built site
- `yarn test` — vitest run (all tests)
- `yarn vitest run gatsby/extract.test.ts` — one file; add `-t "name"` for one test
- `yarn lint` / `yarn lint:fix`

Tests live next to the code (`gatsby/extract.test.ts`) with fixtures copied from real vault notes in `gatsby/__fixtures__/`.

## Architecture

### Data pipeline (vault → GraphQL nodes)

1. `gatsby-config.ts` sources specific vault folders as named filesystem instances (`campaign`, `party`, `session`, `world`, `npc`, `location`, `quest`, `assets`). Folder paths matter: the vault renamed folders before (e.g. `1. DM Stuff` → `1. DM Toolkit`), and source paths must match `includePath` rules in `src/entity-config.ts`.
2. `gatsby-plugin-mdx` (with `gatsby-remark-obsidian`) parses `.md` files into Mdx nodes. **Mdx bodies are never rendered as pages** — they contain Obsidian scaffolding (Meta Bind/Dataview) and DM spoilers. No template uses `__contentFilePath`.
3. `gatsby/node/onCreateNode.ts` classifies each Mdx node against `src/entity-config.ts` (frontmatter tag + file path include/exclude + optional `filter` hook) and creates a typed child node: Campaign, Party, Session, World, Npc, Shop, Settlement, PointOfInterest, Region, Quest. First matching entity wins.
4. Player-safe fields are extracted at node-creation time into plain strings using the pure helpers in `gatsby/extract.ts` (`reduceWikilinks`, `extractSection`, `extractCallout`, `cleanProse`, `normalizeImagePath`, `parseSessionFilename`). Extraction is an **allowlist**: only known-safe frontmatter fields and body sections (locations get the `Overview` callout and `## History` section) are pulled. NPC bodies are never touched — frontmatter only (`## Secrets`/`## DM Notes` live in the body).
5. `gatsby/node/createSchemaCustomization.ts` defines the schema; `Location` is an interface implemented by World, Region, Settlement, PointOfInterest, and Shop.
6. `gatsby/node/createResolvers.ts` resolves all cross-entity relationships lazily. Relationships are **not stored on nodes** — resolvers fetch the entity's parent Mdx node and match frontmatter wikilinks (`[[Name]]`) against other entities by name, via helpers in `gatsby/utils.ts` (`extractWikilinkName`, `getParentNode`, location-hierarchy walkers). The location hierarchy is walked upward through `location` frontmatter until a World is reached.
7. `gatsby/node/createPages.ts` generates pages from templates in `src/templates/`. Root `gatsby-node.ts` just re-exports the four APIs from `gatsby/node/`.

### Images

Frontmatter `images[]` paths are vault-root-relative and normalized (backslashes fixed; `PlaceholderImage.png` → null, render a CSS fallback instead). The `image: File` resolver in `createResolvers.ts` maps a path prefix to its filesystem source instance (`ASSET_SOURCE_PREFIXES`) and matches the remainder against `File.relativePath`. NPC portraits are covered by the existing `npc` source — adding an overlapping source gets silently deduped by Gatsby (first source wins).

### Player-safety rules (from TODO.md locked decisions)

- Never publish `vault/5. Mechanics/` or `vault/6. Resources/`; wikilinks into them are reduced to plain text by `reduceWikilinks`.
- NPCs appear only if frontmatter `partyRelationships` is a non-empty map (the `filter` hook on the npc entity).
- The campaign bible body is never rendered — structured frontmatter/relations only.
- Every extracted prose field must pass through `reduceWikilinks`; no raw `[[`, `INPUT[`, or DM-notes text may reach the site.

### Frontend

React 18 + Tailwind CSS 4 (via PostCSS) + shadcn/ui (new-york style) in `src/components/ui/`. Path alias `@/*` → `src/*`. Site-wide theme (fonts, oklch colors) lives in `siteMetadata.theme` in `gatsby-config.ts`. GraphQL typegen writes to `src/types/gatsby-types.d.ts` (eslint-ignored).

### Deploy

GitHub Pages via `.github/workflows/deploy.yaml`, built with `PREFIX_PATHS=true` for the `/5e-vault-site` path prefix. CI checks out the vault submodule at its `origin/main` tip; the local submodule pin is for dev only. Both repos are public — the site filters content for players, but the vault itself is world-readable on GitHub.
