#!/usr/bin/env node
/**
 * Sync brand assets from @tokyo3rdhq/magi-design-system.
 *
 * Per docs/audits/design-system-compliance.md F-001/F-006: magi-portal must
 * reference the DS canonical brand SVG (single source of truth), not
 * vendor hand-rolled copies. This script copies the three SVGs from
 * node_modules into public/ on every install.
 *
 * Run automatically via npm postinstall hook (see package.json).
 *
 * Source of truth:
 *   node_modules/@tokyo3rdhq/magi-design-system/dist/assets/logo/
 *     magi-mark.svg      →  public/favicon.svg
 *     magi-lockup.svg    →  public/magi-lockup.svg
 *     magi-wordmark.svg  →  public/og-default.svg
 *
 * Usage:
 *   node scripts/sync-brand.mjs
 */

import { copyFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DS = join(
  ROOT,
  'node_modules',
  '@tokyo3rdhq',
  'magi-design-system',
  'dist',
  'assets',
  'logo',
);
const PUBLIC = join(ROOT, 'public');

const MAPPINGS = [
  { from: 'magi-mark.svg', to: 'favicon.svg' },
  { from: 'magi-lockup.svg', to: 'magi-lockup.svg' },
  { from: 'magi-wordmark.svg', to: 'og-default.svg' },
];

if (!existsSync(DS)) {
  console.warn(
    `[sync-brand] Design system not found at ${DS}. ` +
      `Run 'npm install' first. Skipping.`,
  );
  process.exit(0);
}

mkdirSync(PUBLIC, { recursive: true });

let copied = 0;
for (const { from, to } of MAPPINGS) {
  const src = join(DS, from);
  const dest = join(PUBLIC, to);
  if (!existsSync(src)) {
    console.warn(`[sync-brand] Source not found: ${src} — skipping ${to}.`);
    continue;
  }
  copyFileSync(src, dest);
  copied += 1;
}

console.log(
  `[sync-brand] ${copied}/${MAPPINGS.length} brand assets synced from ` +
    `@tokyo3rdhq/magi-design-system → public/`,
);