# TODO — Vault Compatibility & Deploy Readiness

Tracks the work needed to make this site build against the current 5e-vault and deploy to GitHub Pages. Work top-to-bottom; mark items `- [x]` when completed. Each phase ends with a verification gate — don't start the next phase until the gate passes.

## Locked decisions (do not re-litigate; revisit only if the DM reopens them)

| Decision | Choice |
|---|---|
| NPC visibility | Only NPCs the party has met — include an NPC only if frontmatter `partyRelationships` is a non-empty map. Never hardcode the party name. |
| Player pages | None in v1 — no Player entity, no `/party` page. Remove the hardcoded "Active Players: 5" hero stat. |
| Campaign bible body | Never rendered — structured frontmatter/relations only. The body is spoiler-saturated. |
| Session recaps | Publish session `summary` frontmatter verbatim — recaps narrate events players lived through. |
| URL structure | Root-level routes (`/npcs/{slug}`, `/locations/{slug}`, `/sessions/{slug}`, `/quests/{slug}`); single campaign makes campaign-scoped prefixes pure friction. |
| Nav entries | Cut **Items** (no data exists); rename **Lore → Quests**. |
| Hosting | GitHub Pages project page with `pathPrefix: "/5e-vault-site"`. |
| Deploy sync | CI checks out the vault submodule at `origin/main` tip on every build (push + weekly schedule + manual). Local pin is for dev only. |
| Placeholder images | Treat `z_Assets/PlaceholderImage.png` as "no image" — render a CSS fallback card instead. |
| MDX bodies | Never render note bodies as MDX — they're Obsidian scaffolding (Meta Bind/Dataview/Datacore/leaflet). Player-safe prose is extracted into plain node fields at build time (allowlist, not blocklist). |

**Caveat (surface, don't fix here):** both repos are public on GitHub (Stackclash/5e-vault, Stackclash/5e-vault-site). DM notes, `5. Mechanics/`, and `6. Resources/` are world-readable at the repo level regardless of site filtering — the site protects players from casual browsing, not from GitHub.

**Never publish:** `5. Mechanics/` (9,113 generated 5etools files) and `6. Resources/` (210 copyrighted sourcebook/module files). Prose wikilinks into them get reduced to plain text.

---

## Phase 1 — Foundation: green build against the real vault

- [x] **1.1 Init + bump the vault submodule.** `git submodule update --init vault`, then check out vault `origin/main` and commit the gitlink bump. Everything below needs the vault present.
- [x] **1.2 Fix `1. DM Stuff` → `1. DM Toolkit`** (the live vault renamed the folder). Four spots: `gatsby-config.ts` campaign + session source paths (~lines 35, 51); `src/entity-config.ts` campaign + session `includePath` (~lines 12, 20). Grep for `DM Stuff` afterward to confirm zero hits.
- [x] **1.3 Fix the session filename regex** in `gatsby/node/onCreateNode.ts` (~line 32): `/S(\d+) ([\w\s]+)/` → `/^S(\d+)\s+(.+)$/`. The current one truncates apostrophe titles (`S32 Into the Lion's Den` → "Into the Lion").
- [x] **1.4 Fix session↔campaign linkage** in `gatsby/node/createResolvers.ts`. Session journals link `campaign:` frontmatter, not `party:` — the current resolvers match on `fm.party` and silently attach nothing. Change: `Session.campaign` resolves `extractWikilinkName(fm.campaign)` against campaign names; `Campaign.sessions` filters sessions by their `fm.campaign`; `Session.party` resolves session → campaign → campaign's `fm.party`.
- [x] **1.5 Null-guard `partyRelationships`** in the `Campaign.npcs` resolver (`createResolvers.ts` ~line 103): `frontmatter?.partyRelationships?.[partyName]`. Real NPC notes have `partyRelationships:` null — currently a TypeError.
- [x] **1.6 Remove the stray `import { resolve } from "node:dns"`** (`createResolvers.ts` line 3).
- [x] **1.7 Relax `Campaign.world!` / `Campaign.party!` to nullable** in `gatsby/node/createSchemaCustomization.ts`; add a `reporter.warn` in `createPages.ts` when a campaign is missing world/party. An Obsidian typo shouldn't be a whole-build failure.
- [x] **1.8 Drop `?__contentFilePath` from `gatsby/node/createPages.ts`** (and the now-unneeded `parent { ... contentFilePath }` query bits). The template never renders MDX children; this removes the only MDX compile in the build — including of the spoiler-laden campaign bible.
- [x] **1.9 Apply the met-NPCs filter** in `src/entity-config.ts` using the existing (unused) `filter` hook on the NPC entity: include only if frontmatter `partyRelationships` is a non-empty map. *DM data-hygiene note: met NPCs without a `partyRelationships` entry in the vault won't appear on the site.*
- [x] **1.10 GATE: `yarn build` green.** Verify counts via GraphiQL (`gatsby develop`): 1 Campaign, 1 Party, 1 World, ~44 Sessions, 5 Settlements, 2 Regions, ~18 PointOfInterest, 5 Shops, 2 Quests, NPCs = only met ones. Confirm index dashboard notes (`NPCs.md`, `Settlements.md`, `Session Journals.md`) are excluded; if any leaks in, add an `excludePath`.

## Phase 2 — Content pipeline: player-safe extraction

Frontmatter-first, plus allowlisted body sections extracted into plain string fields at `onCreateNode` time. DM safety comes from only extracting what's known safe.

- [ ] **2.1 Create `gatsby/extract.ts`** with pure, testable helpers:
  - `reduceWikilinks(text)` — `[[path|alias]]` → `alias`, `[[Name]]` → `Name` (v1: reduce ALL wikilinks to plain text; cross-linking published entities is a later enhancement — this is what neutralizes Mechanics/Resources links).
  - `extractSection(body, heading)` — text between a `## Heading` and the next same-or-higher heading.
  - `extractCallout(body, calloutId)` — dedented text of a `> [!info|bg-c-purple]- Overview`-style callout.
  - `cleanProse(text)` — strip Meta Bind lines (`INPUT[...]`/`VIEW[...]`/`BUTTON[...]`), inline DQL (`` `=...` ``), code fences, `%%` comments; collapse blank lines; return `null` if empty or "TBD".
  - `normalizeImagePath(p)` — backslashes → forward slashes; `z_Assets/PlaceholderImage.png` → null.
- [ ] **2.2 Extend `gatsby/node/onCreateNode.ts` per entity** (all plain strings/lists):
  - **Npc** (frontmatter only — never touch NPC body; `## Secrets`/`## Stats`/`## DM Notes` live there): `race` (wikilink-reduced), `gender`, `age`, `alignment`, `condition`, `occupation`, `personality`, `ideal`, `bond`, `flaw`, `goals`, `likes`, `dislikes`, `aliases`, `images`.
  - **Settlement/Region/PointOfInterest/Shop/World**: `overview` = `cleanProse(extractCallout(body, "Overview"))`, `history` = `cleanProse(extractSection(body, "History"))`. Nullable — many are TBD stubs.
  - **Quest**: `steps[]` (`{text, completed}` per party) and `questNpcs[]` (`{name (reduced), description}`).
  - **Session**: run `summary` through `reduceWikilinks`.
  - **Campaign**: structured fields only, no body extraction.
- [ ] **2.3 Extend schema + resolvers** (`createSchemaCustomization.ts`, `createResolvers.ts`) for the new fields and types (`QuestStep`, `QuestNpc`).
- [ ] **2.4 Image pipeline.** Add `gatsby-plugin-image` + `gatsby-plugin-sharp` + `gatsby-transformer-sharp` (install + register). Source `vault/z_Assets` (ignore `**/Music/**`, `**/Weather/**`, `**/*.json`) and `vault/4. World Almanac/NPCs/img` (COS portraits; note COS frontmatter uses backslash paths — normalize). Add `image: File` resolvers on Npc and Location types mapping the first normalized `images[]` entry to a File node by `relativePath`.
- [ ] **2.5 (Optional) Unit tests for `gatsby/extract.ts`** — vitest devDependency, fixtures copied from real vault notes (a location with Overview/History, an NPC, an apostrophe-titled session). This is the code most likely to regress when the DM edits vault templates.
- [ ] **2.6 GATE:** `yarn build` green; spot-check in GraphiQL that a fleshed-out location (e.g. Thornmere) has non-null `overview`, an NPC has reduced-race text (no `[[`), and no extracted field anywhere contains `INPUT[`, `[[`, or `## DM Notes` content.

## Phase 3 — Pages & UI: real data everywhere

- [ ] **3.1 `src/pages/index.tsx`** — home page rendering the single campaign's content (hero + preview sections). Keep the generated `/{campaign-slug}` page too. **`src/pages/404.tsx`** — simple themed not-found page.
- [ ] **3.2 Detail templates + generation loops** in `gatsby/node/createPages.ts` (no `__contentFilePath` anywhere):
  - `src/templates/npc-detail.tsx` — portrait (GatsbyImage or CSS fallback), race/age/alignment/occupation, personality/ideal/bond/flaw, party relationship badge, location link.
  - `src/templates/location-detail.tsx` — one template for all Location implementors: type badge, image, overview/history, parent breadcrumb, children grid, NPCs-at-location.
  - `src/templates/session-detail.tsx` — number, title, date, full summary, locations visited, prev/next session nav (pass ids via pageContext).
  - `src/templates/quest-detail.tsx` — description, steps checklist (per-party completion), related NPCs, active/completed badge.
- [ ] **3.3 List pages:** `src/pages/npcs.tsx`, `src/pages/locations.tsx` (grouped by type or hierarchy), `src/pages/sessions.tsx` (newest first), `src/pages/quests.tsx` (active vs completed).
- [ ] **3.4 Replace hardcoded demo components with real data:**
  - `src/components/campaign-nav.tsx` — links → Locations / NPCs / Sessions / Quests (root-level hrefs; drop the `path.join(baseSlug, ...)` scheme); brand → real campaign title; drop Items, drop Lore.
  - `src/components/campaign-overview.tsx` — delete the fake "Vaeltharis" narrative; replace with data-driven cards (e.g. latest session summary, active quest count) or remove from the page.
  - `src/components/hero-section.tsx` — remove the hardcoded "Active Players: 5" stat; keep the generic hero art.
  - `src/components/home-preview-sections.tsx` — `/lore/{slug}` → `/quests/{slug}`; add missing `slug` to the locations/NPCs preview queries (currently links resolve to `/locations/undefined`); remove the commented-out Items preview.
  - `src/components/campaign-footer.tsx` — real links and title.
  - `gatsby-config.ts` `siteMetadata` — title → "The Hunt for Vecna | Campaign Compendium", real description.
- [ ] **3.5 Cleanup:** remove unused demo images from `static/images` (npc-\*, location-\*, item-\*, placeholder-\*) once nothing references them.
- [ ] **3.6 GATE:** `yarn build` green; click through home → each list page → one detail page of each type in `gatsby serve`; zero dead nav links; no raw `[[`, `INPUT[`, or DM-notes text visible anywhere.

## Phase 4 — Deploy (GitHub Pages)

- [ ] **4.1 `.github/workflows/deploy.yaml`:** add `submodules: true` to the checkout step, then `git -C vault fetch origin && git -C vault checkout origin/main` so builds track the vault tip. Comment: a PAT/deploy key becomes required if the vault repo ever goes private.
- [ ] **4.2 `gatsby-config.ts`:** add `pathPrefix: "/5e-vault-site"` — required for the workflow's `PREFIX_PATHS=true` to work; without it every asset 404s under `stackclash.github.io/5e-vault-site/`.
- [ ] **4.3 Triggers:** `workflow_dispatch` + `push: branches: [main]` + weekly `schedule` (picks up vault-content drift without site commits).
- [ ] **4.4 First deploy + smoke test:** confirm repo Pages source = "GitHub Actions"; run the workflow; verify under the `/5e-vault-site/` prefix: home, one NPC, one location, one session, one quest page, images loading, 404 page.
- [ ] **4.5 README.md:** replace the stub with build/dev/deploy instructions, submodule notes, and the entity/extraction architecture summary (fix the `src/entity.config.ts` → `src/entity-config.ts` reference).
