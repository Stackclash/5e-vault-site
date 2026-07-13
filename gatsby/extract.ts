function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Unlike utils.ts's extractWikilinkName (which resolves to the *target
// file's* basename for node-matching purposes), prose display text should
// prefer the alias when one is given - that's what a reader actually sees.
function wikilinkDisplayText(inner: string): string {
  const parts = inner.split("|");
  const raw = (parts.length > 1 ? parts[1] : parts[0]).trim();
  const fileName = raw.split("/").pop() ?? raw;
  return fileName.replace(/\.(md|markdown)$/i, "");
}

/**
 * Reduces every `[[path|alias]]` / `[[Name]]` wikilink embedded in prose to
 * its plain display text (the alias when present, otherwise the name).
 * This is what neutralizes prose links into Mechanics/Resources
 * (unpublished folders) - v1 never cross-links published entities, it just
 * flattens to text.
 */
export function reduceWikilinks(text: string | null | undefined): string | null {
  if (text == null) return null;
  return text.replace(/\[\[([^\]]+)\]\]/g, (_match, inner: string) => wikilinkDisplayText(inner));
}

/**
 * Extracts the text between a `## Heading` and the next heading of the same
 * or higher level (or end of body).
 */
export function extractSection(body: string, heading: string): string | null {
  if (!body) return null;
  const lines = body.split(/\r?\n/);
  const headingRegex = new RegExp(`^(#{1,6})\\s+${escapeRegExp(heading)}\\s*$`, "i");

  let startIndex = -1;
  let level = 0;
  for (let i = 0; i < lines.length; i++) {
    const match = headingRegex.exec(lines[i].trim());
    if (match) {
      startIndex = i;
      level = match[1].length;
      break;
    }
  }
  if (startIndex === -1) return null;

  const contentLines: string[] = [];
  const anyHeadingRegex = /^(#{1,6})\s+/;
  for (let i = startIndex + 1; i < lines.length; i++) {
    const match = anyHeadingRegex.exec(lines[i].trim());
    if (match && match[1].length <= level) break;
    contentLines.push(lines[i]);
  }

  const text = contentLines.join("\n").trim();
  return text.length > 0 ? text : null;
}

/**
 * Extracts the dedented text of a `> [!info|bg-c-purple]- Overview`-style
 * callout. Tolerates the vault's un-prefixed "TBD" stub line (a template
 * quirk where the placeholder text isn't blockquote-prefixed) as a
 * single-line fallback.
 */
export function extractCallout(body: string, calloutId: string): string | null {
  if (!body) return null;
  const lines = body.split(/\r?\n/);
  const headerRegex = new RegExp(
    `^>\\s*\\[![\\w-]+(?:\\|[^\\]]*)?\\]\\s*[-+]?\\s*${escapeRegExp(calloutId)}\\s*$`,
    "i"
  );

  let startIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (headerRegex.test(lines[i].trim())) {
      startIndex = i;
      break;
    }
  }
  if (startIndex === -1) return null;

  const contentLines: string[] = [];
  for (let i = startIndex + 1; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (trimmed.startsWith(">")) {
      contentLines.push(trimmed.replace(/^>\s?/, ""));
      continue;
    }
    if (contentLines.length === 0 && trimmed.length > 0) {
      contentLines.push(trimmed);
    }
    break;
  }

  const text = contentLines.join("\n").trim();
  return text.length > 0 ? text : null;
}

/**
 * Strips Obsidian/Meta Bind/Dataview scaffolding out of extracted prose:
 * `%%` comments, fenced code blocks, inline DQL (`` `=...` ``), and
 * standalone `INPUT[...]`/`VIEW[...]`/`BUTTON[...]` lines. Collapses runs of
 * blank lines and returns null for empty or "TBD" stub content.
 */
export function cleanProse(text: string | null | undefined): string | null {
  if (text == null) return null;

  let result = text;
  result = result.replace(/%%[\s\S]*?%%/g, "");
  result = result.replace(/```[\s\S]*?```/g, "");
  result = result.replace(/`\$?=[^`]*`/g, "");
  result = result
    .split(/\r?\n/)
    .filter((line) => !/^\s*`?(INPUT|VIEW|BUTTON)\[.*\]`?\s*$/i.test(line))
    .join("\n");
  result = result.replace(/\n{3,}/g, "\n\n").trim();

  if (result.length === 0 || result.toLowerCase() === "tbd") return null;
  return result;
}

/**
 * Normalizes an image path to forward slashes (COS NPC frontmatter uses
 * backslashes) and treats the vault's "no image" placeholder as null.
 */
export function normalizeImagePath(p: string | null | undefined): string | null {
  if (!p) return null;
  const normalized = p.trim().replace(/\\/g, "/");
  if (normalized === "" || normalized === "z_Assets/PlaceholderImage.png") return null;
  return normalized;
}

/**
 * Parses a session journal filename (e.g. "S32 Into the Lion's Den") into
 * its number and title. Anchored to end-of-string so apostrophes and other
 * punctuation in the title survive intact.
 */
export function parseSessionFilename(
  fileName: string
): { sessionNumber: number; title: string } | null {
  const match = /^S(\d+)\s+(.+)$/.exec(fileName);
  if (!match) return null;
  return { sessionNumber: parseInt(match[1], 10), title: match[2] };
}
