import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import {
  reduceWikilinks,
  extractSection,
  extractCallout,
  cleanProse,
  normalizeImagePath,
  parseSessionFilename,
} from "./extract";

const FIXTURES_DIR = join(__dirname, "__fixtures__");

function loadFixtureBody(fileName: string): string {
  const raw = readFileSync(join(FIXTURES_DIR, fileName), "utf-8");
  const match = /^---\r?\n[\s\S]*?\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
  return match ? match[1] : raw;
}

describe("reduceWikilinks", () => {
  it("reduces a piped wikilink to its alias (NPC race field shape)", () => {
    expect(reduceWikilinks("[[5. Mechanics/Races/Human.md|Human]]")).toBe("Human");
  });

  it("reduces a bare wikilink to its basename", () => {
    expect(reduceWikilinks("[[Eamon Morcant]]")).toBe("Eamon Morcant");
  });

  it("reduces multiple wikilinks embedded in prose", () => {
    expect(reduceWikilinks("He met [[NPC A|Ally]] and [[NPC B]] in town.")).toBe(
      "He met Ally and NPC B in town."
    );
  });

  it("passes through text with no wikilinks untouched", () => {
    expect(reduceWikilinks("Went over theme of campaign and characters.")).toBe(
      "Went over theme of campaign and characters."
    );
  });

  it("returns null for null/undefined input", () => {
    expect(reduceWikilinks(null)).toBeNull();
    expect(reduceWikilinks(undefined)).toBeNull();
  });
});

describe("extractSection", () => {
  const body = loadFixtureBody("thornmere.md");

  it("extracts the History section from a real, filled-in location note", () => {
    const history = extractSection(body, "History");
    expect(history).toContain("Thornmere was founded generations ago");
  });

  it("stops at the next heading of the same or higher level", () => {
    const history = extractSection(body, "History");
    expect(history).not.toContain("Plot Hooks");
    expect(history).not.toContain("DM Notes");
  });

  it("returns null for a heading that doesn't exist in the body", () => {
    expect(extractSection(body, "Nonexistent Heading")).toBeNull();
  });
});

describe("extractCallout", () => {
  it("extracts a real, filled-in Overview callout", () => {
    const body = loadFixtureBody("thornmere.md");
    const overview = extractCallout(body, "Overview");
    expect(overview).toContain("Thornmere is a low-lying farming village");
  });

  it("falls back to a single un-prefixed stub line (vault template quirk)", () => {
    const body = loadFixtureBody("wizard-of-wines.md");
    const overview = extractCallout(body, "Overview");
    expect(overview).toBe("TBD");
  });

  it("returns null when the callout doesn't exist", () => {
    expect(extractCallout("# Title\nSome text", "Overview")).toBeNull();
  });
});

describe("cleanProse", () => {
  it("returns null for TBD stub content, case-insensitively", () => {
    expect(cleanProse("TBD")).toBeNull();
    expect(cleanProse("  tbd  ")).toBeNull();
  });

  it("returns null for empty or null content", () => {
    expect(cleanProse("")).toBeNull();
    expect(cleanProse("   ")).toBeNull();
    expect(cleanProse(null)).toBeNull();
    expect(cleanProse(undefined)).toBeNull();
  });

  it("strips standalone Meta Bind INPUT/VIEW/BUTTON lines", () => {
    const text = "Some real prose.\n`INPUT[textArea:description]`\nMore prose.";
    expect(cleanProse(text)).toBe("Some real prose.\nMore prose.");
  });

  it("strips inline DQL expressions", () => {
    const text = "`$=await dv.view('views/foo')`\nActual content here.";
    expect(cleanProse(text)).toBe("Actual content here.");
  });

  it("strips fenced code blocks", () => {
    const text = "Before.\n```leaflet\nid: Faerun_Map\n```\nAfter.";
    expect(cleanProse(text)).toBe("Before.\n\nAfter.");
  });

  it("strips %% comments", () => {
    expect(cleanProse("Visible %% hidden DM note %% text")).toBe("Visible  text");
  });

  it("collapses long runs of blank lines", () => {
    expect(cleanProse("Para one.\n\n\n\n\nPara two.")).toBe("Para one.\n\nPara two.");
  });

  it("produces clean, DM-safe prose from the real Thornmere fixture", () => {
    const body = loadFixtureBody("thornmere.md");
    const overview = cleanProse(extractCallout(body, "Overview"));
    expect(overview).toContain("Thornmere is a low-lying farming village");
    expect(overview).not.toMatch(/INPUT\[/);
    expect(overview).not.toMatch(/\[\[/);
  });
});

describe("normalizeImagePath", () => {
  it("converts backslashes to forward slashes (COS NPC frontmatter shape)", () => {
    expect(normalizeImagePath("4. World Almanac\\NPCs\\img\\anastrasya-karelova.webp")).toBe(
      "4. World Almanac/NPCs/img/anastrasya-karelova.webp"
    );
  });

  it("treats the vault placeholder image as no image", () => {
    expect(normalizeImagePath("z_Assets/PlaceholderImage.png")).toBeNull();
  });

  it("returns null for empty or null input", () => {
    expect(normalizeImagePath("")).toBeNull();
    expect(normalizeImagePath(null)).toBeNull();
    expect(normalizeImagePath(undefined)).toBeNull();
  });
});

describe("parseSessionFilename", () => {
  it("parses an apostrophe-titled session filename without truncating the title", () => {
    expect(parseSessionFilename("S32 Into the Lion's Den")).toEqual({
      sessionNumber: 32,
      title: "Into the Lion's Den",
    });
  });

  it("the apostrophe-titled fixture file still exists with the expected name", () => {
    // Guards against the vault renaming the fixture out from under this test.
    expect(readdirSync(FIXTURES_DIR)).toContain("S32 Into the Lion's Den.md");
  });

  it("returns null for a filename that isn't a session journal", () => {
    expect(parseSessionFilename("Thornmere")).toBeNull();
  });
});
