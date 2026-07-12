# design-sync notes — 5e-vault-site

- This is a Gatsby **site**, not a component package: no dist/, no build for the library. The converter entry is the hand-written `.design-sync/ds-entry.ts` (pass `--entry ./.design-sync/ds-entry.ts`), which re-exports exactly the scoped 45 components. Regenerate it if components are added.
- Six site components are deliberately excluded (import Gatsby `Link`/`useStaticQuery`, unusable outside the Gatsby runtime): CampaignNav, CampaignFooter, PageHeader, HomePreviewSections, Seo, Layout.
- Tailwind CSS v4 CSS-first theme in `src/styles/globals.css`. Utilities only exist after compilation: run `node .design-sync/build-css.mjs` (= cfg.buildCmd) before every converter run. It compiles `.design-sync/tailwind-entry.css` (imports globals.css + adds an `@source` scan over `.design-sync/previews/**`) to `.design-sync/.cache/compiled.css` (= cfg.cssEntry). **Authored previews must use Tailwind classes discoverable in that scan** — after editing any `previews/*.tsx`, re-run build-css BEFORE the converter so new utility classes compile in, or they render unstyled.
- Theme is dark-by-default (dark fantasy, oklch tokens in `:root`) — cards render dark; that's the brand, not a bug.
- **Fonts RESOLVED** (was TBD): the campaign fonts (Cinzel headings, Crimson Text body, Geist Mono) are self-hosted woff2 under `.design-sync/fonts/` with a `.design-sync/fonts/fonts.css` `@font-face` sheet, wired via `cfg.extraFonts`. Validate shows 20 @font-face rules, no `[FONT_MISSING]`. The deployed Gatsby site itself does NOT ship these (falls back to Georgia/Times) — the woff2s here exist only for the design-sync bundle. If the family list changes, refresh `fonts/` + `fonts.css`.
- **Preview surface (`_frame.tsx`)**: the design-sync card html forces `body{background:#fff}` (lib/emit.mjs), but this DS is dark-by-default, so bare components render light-on-white and wash out. Every authored primitive preview wraps its content in the shared `.design-sync/previews/_frame.tsx` `<Frame>` (`bg-background text-foreground` padded panel) so it renders on the correct dark surface. `_frame.tsx` is NOT a component (not in ds-entry) — it's imported relatively by the previews and bundled from source. Full-bleed site sections (HeroSection, CampaignOverview) instead get a plain `<div className="bg-background text-foreground">` wrapper; Dialog needs none (its overlay + DialogContent are self-dark).
- `.design-sync/docs/*.md` are frontmatter-only regroup stubs (category: Actions/Forms/Overlays/Display/Site) so the DS pane isn't one flat "general" group.
- yarn 1 (classic): use `yarn install --frozen-lockfile` (not `--immutable`). Node is managed by mise — prefix commands with `export PATH="$HOME/AppData/Local/mise/shims:$PATH"` (git-bash) or use `mise exec -- node`.
- Playwright for the render check: chromium build 1228 is cached under `~/.cache/ms-playwright`; the matching `playwright-core@1.61.1` is already installed in `.ds-sync/node_modules`.

## Authored previews (this sync)
- 17 components have authored `.design-sync/previews/*.tsx`, all graded good: Button, Badge, Alert, Card, Table, Tabs, Avatar, Progress, Spinner (display/actions); Input, Select, Checkbox, Slider (forms); Dialog (overlays); SectionHeader, HeroSection, CampaignOverview (site). Remaining 28 ship the floor card (authorable on any later re-sync).
- `cfg.overrides`: Dialog `single` (open state), Table `column` (wide), SectionHeader `column`, HeroSection/CampaignOverview `single` (full-bleed sections with fixed viewports).

## Known render warns
- (none — render check is clean, 45/45.)

## Re-sync risks / watch-list
- **Tooltip is deliberately a floor card.** Its open state (Radix Tooltip + Floating-UI positioning inside a portal) does not settle in the static headless capture — only the trigger renders. Do not "fix" it by re-authoring a trigger-only card (misleading) or by reimplementing the tip. A future harness that waits for positioning could author it; otherwise leave it floored. Same caution applies to any other Floating-UI popper open-state (Popover, HoverCard, DropdownMenu, ContextMenu, Menubar, Select-open) — Dialog works only because it's `fixed`-centered, not popper-positioned.
- **Avatar previews use unresolved image paths on purpose** (`/images/*.jpg` 404 → AvatarFallback initials). That's the intended render; don't chase the broken-image.
- **HeroSection's background image** (`/images/hero-banner.jpg`) also 404s in the card; the dark overlay stack hides it. Fine for the preview.
- **Fonts are inputs, not derived**: `.design-sync/fonts/*.woff2` are committed assets. A `git clean` or fonts refresh that drops them reintroduces `[FONT_MISSING]`.
- Preview classes depend on the build-css `@source` scan — if a preview is edited without re-running build-css before the converter, its new classes silently won't compile.
