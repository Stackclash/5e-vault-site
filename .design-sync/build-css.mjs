// Compiles the Tailwind v4 CSS-first theme into a static stylesheet for the
// design-sync bundle (cfg.cssEntry). Uses the repo's own postcss +
// @tailwindcss/postcss so output matches the site build.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import postcss from 'postcss';
import tailwindcss from '@tailwindcss/postcss';

const here = dirname(fileURLToPath(import.meta.url));
const from = join(here, 'tailwind-entry.css');
const to = join(here, '.cache', 'compiled.css');

mkdirSync(dirname(to), { recursive: true });
const result = await postcss([tailwindcss()]).process(readFileSync(from, 'utf8'), { from, to });
writeFileSync(to, result.css);
console.log(`wrote ${to} (${(result.css.length / 1024).toFixed(1)} KiB)`);
