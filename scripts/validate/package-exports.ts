/**
 * Validates that every workspace package under `packages/` and `scrapers/`
 * that defines package.json `exports` and `bin` fields are consistent with
 * the tsup entry points in tsup.config.ts, for every workspace package that
 * has a tsup config.
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

import { readFile, readdir, stat } from 'node:fs/promises';

/** Directories that contain workspace packages. */
const WORKSPACE_DIRS = ['packages', 'scrapers'];

/** Possible tsup config filenames. */
const TSUP_CONFIG_NAMES = ['tsup.config.ts', 'tsup.config.js', 'tsup.config.mjs'];

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
 * Extract tsup entry keys from a tsup config file by finding lines that assign
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
      'Could not parse tsup config: no entry object found. ' +
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
      'Could not parse any entry keys from tsup config. ' +
        'If the config format changed, update this validation script.'
    );
  }

  return keys;
}

/**
 * Find all workspace package directories that contain a tsup config file.
 * Returns array of { dir, tsupConfigPath } objects.
 */
async function findPackagesWithTsup(): Promise<{ dir: string; tsupConfig: string }[]> {
  const results: { dir: string; tsupConfig: string }[] = [];

  for (const parentDir of WORKSPACE_DIRS) {
    let entries: string[];
    try {
      entries = await readdir(parentDir);
    } catch {
      continue;
    }

    for (const entry of entries) {
      const fullPath = `${parentDir}/${entry}`;
      const stats = await stat(fullPath);
      if (!stats.isDirectory()) continue;

      for (const configName of TSUP_CONFIG_NAMES) {
        const configPath = `${fullPath}/${configName}`;
        try {
          await stat(configPath);
          results.push({ dir: fullPath, tsupConfig: configPath });
          break; // found a config, no need to check other names
        } catch {
          // not found, try next name
        }
      }
    }
  }

  return results;
}

/**
 * Validate a single package's exports/bin against its tsup entry points.
 * Returns an array of error messages (empty if consistent).
 */
async function validatePackage(dir: string, tsupConfigPath: string): Promise<string[]> {
  const pkg = JSON.parse(await readFile(`${dir}/package.json`, 'utf-8'));
  const exports: Record<string, { import?: string }> = pkg.exports ?? {};
  const bin: string | Record<string, string> | undefined = pkg.bin;

  // Collect all dist paths that package.json exposes
  const exportedKeys = new Map<string, string>();

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

  console.log('  package.json exposed entry keys:');
  for (const [key, source] of [...exportedKeys.entries()].sort((a, b) =>
    a[0].localeCompare(b[0])
  )) {
    console.log(`    - ${key}  (from ${source})`);
  }

  // Read tsup config entry points
  const tsupSource = await readFile(tsupConfigPath, 'utf-8');
  const tsupKeys = parseTsupEntryKeys(tsupSource);

  console.log('  tsup entry keys:');
  for (const key of [...tsupKeys].sort()) {
    console.log(`    - ${key}`);
  }

  const errors: string[] = [];

  for (const [key, source] of exportedKeys) {
    if (!tsupKeys.has(key)) {
      errors.push(
        `${dir}: package.json declares ${source} but tsup has no "${key}" entry point. ` +
          `The file won't be built. Add "${key}" to tsup entry, ` +
          `or remove the export from package.json.`
      );
    }
  }

  // Every tsup entry should have an export or bin
  for (const key of tsupKeys) {
    if (!exportedKeys.has(key)) {
      errors.push(
        `${dir}: tsup builds "${key}" but package.json has no corresponding export or bin. ` +
          `The file gets built but consumers can't import it. Add an export ` +
          `path to package.json, or remove "${key}" from tsup entry.`
      );
    }
  }

  return errors;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export default async function validatePackageExports(): Promise<void> {
  const packages = await findPackagesWithTsup();

  if (packages.length === 0) {
    console.log('No packages with tsup config found.');
    return;
  }

  const allErrors: string[] = [];

  for (const { dir, tsupConfig } of packages) {
    console.log(`\n${dir} (${tsupConfig.split('/').pop()}):`);
    const errors = await validatePackage(dir, tsupConfig);
    allErrors.push(...errors);
  }

  if (allErrors.length > 0) {
    console.error('');
    for (const err of allErrors) {
      console.error(`  - ${err}`);
    }
    throw new Error('package.json exports/bin and tsup entry points are inconsistent.');
  }

  console.log('\nAll packages: exports/bin and tsup entry points are consistent.');
}
