# 5e Vault Site

Player-facing Gatsby 5 site built from an Obsidian D&D campaign vault.

This project reads markdown notes from the `vault/` git submodule and publishes only player-safe content (campaign overview, locations, NPCs the party has met, session recaps, and quests).

## Prerequisites

- Node.js 20+
- Yarn
- Git with submodule support

## First-time setup

1. Initialize/update the vault submodule:

	 ```bash
	 git submodule update --init vault
	 ```

2. Install dependencies:

	 ```bash
	 yarn
	 ```

## Local development

- Start dev server (also cleans Gatsby cache via predev):

	```bash
	yarn dev
	```

	Site: `http://localhost:8000`

- Run production build:

	```bash
	yarn build
	```

- Serve production build locally:

	```bash
	yarn serve
	```

- Lint:

	```bash
	yarn lint
	```

- Tests:

	```bash
	yarn test
	```

## Deployment (GitHub Pages)

This repo deploys as a GitHub Pages project site under `/5e-vault-site`.

- `gatsby-config.ts` sets:
	- `pathPrefix: "/5e-vault-site"`
- Workflow: `.github/workflows/deploy.yaml`
	- triggers on `workflow_dispatch`, `push` to `main`, and weekly schedule
	- checks out submodules
	- forces vault submodule to latest `origin/main` each build
	- builds with `PREFIX_PATHS=true`

If `Stackclash/5e-vault` ever becomes private, workflow checkout/submodule sync will require a PAT or deploy key.

## Content model

Entity classification lives in `src/entity-config.ts` (note the hyphen).

Current entities:

- Campaign
- Party
- Session
- World
- Region
- Settlement
- PointOfInterest
- Shop
- Npc
- Quest

### Note types & frontmatter fields

Own-note fields are extracted in `gatsby/node/onCreateNode.ts`; cross-note relationships (wikilinks resolved against other notes) are resolved lazily in `gatsby/node/createResolvers.ts`. Every prose field is passed through `reduceWikilinks`/`cleanProse` (`gatsby/extract.ts`) before publishing.

**Campaign** — `1. DM Toolkit/Campaigns/`, tag `campaign`

| Field | Used for |
|---|---|
| `public_premise` | Public-facing premise text (homepage hero) |
| `world` (wikilink) | Resolves the linked World |
| `party` (wikilink) | Resolves the linked Party |

Body is never rendered — the campaign bible stays DM-only.

**Party** — `3. The Party/Parties/`, tag `party`

No frontmatter is read directly. A Party's campaigns are found by reverse lookup: any Campaign whose `party` field points back to it.

**Session** — `1. DM Toolkit/Session Journals/`, tag `session-journal`

Filename `S<number> <Title>` (e.g. `S32 Into the Lion's Den`) is parsed for session number and title; frontmatter `session_number` overrides the parsed number if present.

| Field | Used for |
|---|---|
| `date` | Session date |
| `summary` | Recap prose |
| `party_present` | Array of character names, shown as tags |
| `items` | Array of item names found |
| `campaign` (wikilink) | Resolves the parent Campaign |
| `location` / `locations` (wikilink(s)) | Resolves session Location(s) |
| `npcs` (array of wikilinks) | Resolves NPCs met |
| `quests` (array of wikilinks) | Resolves Quests touched |

**World, Region, Settlement, PointOfInterest, Shop** (`Location` interface)

| Type | Vault path | Tags |
|---|---|---|
| World | `4. World Almanac/Worlds/` | `world` |
| Region | `4. World Almanac/Regions/` | `location`, `region` |
| Settlement | `4. World Almanac/Settlements/` | `location`, `settlement` |
| PointOfInterest | `4. World Almanac/Places of Interest/` | `location`, `point-of-interest` |
| Shop | `4. World Almanac/Shops/` | `location`, `shop` |

Common fields:

| Field | Used for |
|---|---|
| `summary` | Short description |
| `images` | Array of vault-relative image paths; first entry resolves to the page's hero image |
| `location` (wikilink) | Parent Location, builds the location hierarchy |
| Body `Overview` callout | Long-form overview prose |
| Body `## History` section | History prose |

Type-specific fields: Settlement adds `population` (number) and `government` (string); Region adds `terrain` (string) and `climate` (string).

**Npc** — `4. World Almanac/NPCs/`, tag `npc`

Visibility rule: an NPC is only published if `partyRelationships` is a non-empty map — this is the sole "has the party met this NPC" signal. Body is never read, so `## Secrets`/`## DM Notes` stay unpublished by construction.

| Field | Used for |
|---|---|
| `partyRelationships` | Map of party name → relationship label; shown as "Party Relationship" and drives the visibility filter |
| `race`, `gender`, `age`, `alignment`, `condition` | Quick-facts panel |
| `occupation` | Array, joined for display |
| `aliases` | Array, shown as "Also Known As" |
| `personality`, `ideal`, `bond`, `flaw`, `goals`, `likes`, `dislikes` | Character trait cards |
| `player_impression` | "What the Party Knows" trait card |
| `images` | Array of vault-relative image paths; first entry resolves to the portrait |
| `location` (wikilink) | Resolves where the NPC is found |

**Quest** — `3. The Party/Quests/`, tag `quest`

| Field | Used for |
|---|---|
| `description` | Full quest text |
| `player_summary` | Short summary shown in the page header and preview cards |
| `world` (wikilink) | Resolves the parent World (also used to derive related Campaigns) |
| `active`, `completed` | Maps of party name → boolean, combined into per-party status badges |
| `steps` | Array of `{ text, completed: { partyName: boolean } }`, rendered as an objectives checklist |
| `npcs` | Array of `{ name, description }`, rendered as related-NPC cards |

## Extraction architecture

Build pipeline summary:

1. `gatsby-source-filesystem` sources selected vault folders.
2. `gatsby-plugin-mdx` creates Mdx nodes from vault notes.
3. `gatsby/node/onCreateNode.ts` classifies each note and creates typed child nodes.
4. `gatsby/extract.ts` allowlists and cleans player-safe text:
	 - wikilinks reduced to plain text
	 - Obsidian/Meta Bind/Dataview scaffolding stripped
	 - selected sections/callouts extracted
5. `gatsby/node/createSchemaCustomization.ts` defines schema.
6. `gatsby/node/createResolvers.ts` resolves relationships and image files lazily.
7. `gatsby/node/createPages.ts` creates list/detail pages using safe extracted fields.

Safety rules:

- Never publish `vault/5. Mechanics` or `vault/6. Resources` content directly.
- NPC visibility is restricted to notes with non-empty `partyRelationships`.
- Campaign bible body is not rendered.
- MDX note bodies are not rendered as site pages.

## Useful paths

- `gatsby/extract.ts`
- `gatsby/node/onCreateNode.ts`
- `gatsby/node/createResolvers.ts`
- `gatsby/node/createPages.ts`
- `src/entity-config.ts`
- `src/templates/`


