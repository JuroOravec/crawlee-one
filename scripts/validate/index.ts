/**
 * Validation runner -- discovers and executes all validation scripts in this
 * directory. Each script must export a default async function. If any script
 * throws, the runner exits with code 1.
 *
 * Usage:
 *   npx tsx scripts/validate/index.ts
 *   npm run validate
 */

import { readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const files = await readdir(__dirname);
const scripts = files.filter((f) => f.endsWith('.ts') && f !== 'index.ts').sort();

if (scripts.length === 0) {
  console.log('No validation scripts found.');
  process.exit(0);
}

let failed = false;

for (const script of scripts) {
  console.log(`\n=== ${script} ===\n`);
  try {
    const mod = await import(join(__dirname, script));
    if (typeof mod.default !== 'function') {
      throw new Error(`${script} does not export a default function`);
    }
    await mod.default();
    console.log(`\nPASS: ${script}`);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`\nFAIL: ${script} -- ${message}`);
    failed = true;
  }
}

console.log('');

if (failed) {
  console.error('One or more validation scripts failed.');
  process.exit(1);
} else {
  console.log('All validation scripts passed.');
}
