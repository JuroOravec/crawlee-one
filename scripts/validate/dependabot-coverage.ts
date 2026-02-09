/**
 * Validates that every workspace package under `packages/` and `scrapers/`
 * has a corresponding entry in `.github/dependabot.yml`.
 *
 * Catches drift like:
 * - Adding a new scraper without registering it in dependabot.yml
 *   (its dependencies will never get update PRs).
 * - Removing a package but leaving a stale dependabot entry
 *   (Dependabot will fail silently on the missing directory).
 */

import { readFile, readdir, stat } from 'node:fs/promises';
import { parse } from 'yaml';

/** Directories that contain workspace packages. */
const WORKSPACE_DIRS = ['packages', 'scrapers'];

interface DependabotUpdate {
  'package-ecosystem': string;
  directory: string;
  [key: string]: unknown;
}

interface DependabotConfig {
  version: number;
  updates: DependabotUpdate[];
}

/**
 * List immediate subdirectories of a directory that contain a package.json.
 * Returns paths relative to the repo root (e.g. `packages/crawlee-one`).
 */
async function listPackages(parentDir: string): Promise<string[]> {
  let entries: string[];
  try {
    entries = await readdir(parentDir);
  } catch {
    // Directory doesn't exist -- no packages here
    return [];
  }

  const packages: string[] = [];

  for (const entry of entries) {
    const fullPath = `${parentDir}/${entry}`;
    const stats = await stat(fullPath);
    if (!stats.isDirectory()) continue;

    try {
      await stat(`${fullPath}/package.json`);
      packages.push(fullPath);
    } catch {
      // No package.json -- skip
    }
  }

  return packages;
}

export default async function validateDependabotCoverage(): Promise<void> {
  // 1. Discover all workspace packages
  const allPackages: string[] = [];
  for (const dir of WORKSPACE_DIRS) {
    const packages = await listPackages(dir);
    allPackages.push(...packages);
  }

  allPackages.sort();

  console.log('Workspace packages:');
  for (const pkg of allPackages) {
    console.log(`  - ${pkg}`);
  }

  // 2. Parse dependabot.yml
  const raw = await readFile('.github/dependabot.yml', 'utf-8');
  const config = parse(raw) as DependabotConfig;

  const npmEntries = config.updates
    .filter((u) => u['package-ecosystem'] === 'npm')
    .map((u) => u.directory.replace(/^\//, '')); // strip leading /

  console.log('\ndependabot.yml npm directories:');
  for (const dir of npmEntries.sort()) {
    console.log(`  - ${dir}`);
  }

  // 3. Check: every package must have a dependabot entry
  const errors: string[] = [];

  for (const pkg of allPackages) {
    if (!npmEntries.includes(pkg)) {
      errors.push(
        `Workspace package "${pkg}" has no dependabot.yml entry. ` +
          `Add a "package-ecosystem: npm" entry with directory: "/${pkg}".`
      );
    }
  }

  // 4. Check: no stale dependabot entries for workspace dirs
  for (const dir of npmEntries) {
    const isWorkspaceDir = WORKSPACE_DIRS.some((wd) => dir.startsWith(wd + '/'));
    if (isWorkspaceDir && !allPackages.includes(dir)) {
      errors.push(
        `dependabot.yml has entry for "/${dir}" but no package exists there. ` +
          `Remove the stale entry or create the package.`
      );
    }
  }

  if (errors.length > 0) {
    console.error('');
    for (const err of errors) {
      console.error(`  - ${err}`);
    }
    throw new Error('dependabot.yml is not in sync with workspace packages.');
  }

  console.log('\ndependabot.yml covers all workspace packages.');
}
