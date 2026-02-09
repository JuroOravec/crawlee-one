/**
 * Validates that package.json `exports` and `bin` fields are consistent with
 * the tsup entry points in tsup.config.ts.
 *
 * Catches drift like:
 * - Adding a new subpath export to package.json without a matching tsup entry
 *   (the import path would resolve to a file that doesn't get built).
 * - Adding a new tsup entry without exposing it in package.json exports
 *   (the file gets built but consumers can't import it).
 * - Renaming a tsup entry key without updating the corresponding export path.
 *
 * Parsing tsup.config.ts via regex is intentionally brittle -- if the config
 * format changes enough to break parsing, the validation fails, which is
 * exactly the signal we want.
 */

import { readFile } from 'node:fs/promises';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Derive the expected tsup entry key from a dist output path.
 * `./dist/index.js` -> `index`, `./dist/apify.js` -> `apify`, `dist/cli.js` -> `cli`
 */
function distPathToEntryKey(distPath: string): string {
  return distPath
    .replace(/^\.?\//, '') // strip leading ./ or /
    .replace(/^dist\//, '') // strip dist/
    .replace(/\.js$/, ''); // strip .js
}

/**
 * Extract tsup entry keys from tsup.config.ts by finding lines that assign
 * entry values (e.g., `index: 'src/index.ts'`).
 *
 * Scans for the `entry:` property, then collects key-value pairs until
 * hitting the closing brace. Comments containing braces are stripped first
 * to avoid confusing the block boundary detection.
 */
function parseTsupEntryKeys(configSource: string): Set<string> {
  // Strip single-line comments so braces inside them don't confuse parsing
  const stripped = configSource.replace(/\/\/.*$/gm, '');

  // Match the entry object block (now safe since comments are gone)
  const entryMatch = stripped.match(/entry\s*:\s*\{([^}]+)\}/s);
  if (!entryMatch) {
    throw new Error(
      'Could not parse tsup.config.ts: no entry object found. ' +
        'If the config format changed, update this validation script.'
    );
  }

  const entryBlock = entryMatch[1];
  const keys = new Set<string>();

  // Match each key in the entry object (handles both quoted and unquoted keys)
  const keyPattern = /^\s*(?:['"]?(\w+)['"]?)\s*:/gm;
  let match: RegExpExecArray | null;
  while ((match = keyPattern.exec(entryBlock)) !== null) {
    keys.add(match[1]);
  }

  if (keys.size === 0) {
    throw new Error(
      'Could not parse any entry keys from tsup.config.ts. ' +
        'If the config format changed, update this validation script.'
    );
  }

  return keys;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export default async function validatePackageExports(): Promise<void> {
  // 1. Read package.json exports and bin
  const pkg = JSON.parse(await readFile('package.json', 'utf-8'));
  const exports: Record<string, { import?: string }> = pkg.exports ?? {};
  const bin: string | Record<string, string> | undefined = pkg.bin;

  // Collect all dist paths that package.json exposes
  const exportedKeys = new Map<string, string>(); // entryKey -> source description

  for (const [subpath, conditions] of Object.entries(exports)) {
    const importPath = conditions.import;
    if (importPath) {
      const key = distPathToEntryKey(importPath);
      exportedKeys.set(key, `exports["${subpath}"].import = "${importPath}"`);
    }
  }

  if (typeof bin === 'string') {
    const key = distPathToEntryKey(bin);
    exportedKeys.set(key, `bin = "${bin}"`);
  } else if (bin && typeof bin === 'object') {
    for (const [name, path] of Object.entries(bin)) {
      const key = distPathToEntryKey(path);
      exportedKeys.set(key, `bin["${name}"] = "${path}"`);
    }
  }

  console.log('package.json exposed entry keys:');
  for (const [key, source] of [...exportedKeys.entries()].sort((a, b) =>
    a[0].localeCompare(b[0])
  )) {
    console.log(`  - ${key}  (from ${source})`);
  }

  // 2. Read tsup.config.ts entry points
  const tsupSource = await readFile('tsup.config.ts', 'utf-8');
  const tsupKeys = parseTsupEntryKeys(tsupSource);

  console.log('\ntsup entry keys:');
  for (const key of [...tsupKeys].sort()) {
    console.log(`  - ${key}`);
  }

  // 3. Compare
  const errors: string[] = [];

  // Every exported path must have a tsup entry
  for (const [key, source] of exportedKeys) {
    if (!tsupKeys.has(key)) {
      errors.push(
        `package.json declares ${source} but tsup has no "${key}" entry point. ` +
          `The file won't be built. Add "${key}" to tsup.config.ts entry, ` +
          `or remove the export from package.json.`
      );
    }
  }

  // Every tsup entry should have an export or bin
  for (const key of tsupKeys) {
    if (!exportedKeys.has(key)) {
      errors.push(
        `tsup builds "${key}" but package.json has no corresponding export or bin. ` +
          `The file gets built but consumers can't import it. Add an export ` +
          `path to package.json, or remove "${key}" from tsup.config.ts entry.`
      );
    }
  }

  if (errors.length > 0) {
    console.error('');
    for (const err of errors) {
      console.error(`  - ${err}`);
    }
    throw new Error('package.json exports/bin and tsup entry points are inconsistent.');
  }

  console.log('\npackage.json exports/bin and tsup entry points are consistent.');
}
