/**
 * Validates that the minimum Node.js version from package.json `engines.node`
 * is consistent with the CI workflow's test matrix.
 *
 * Catches drift like:
 * - Bumping `engines.node` to `>=22` but leaving Node 20 in the CI matrix
 *   (wasting CI time testing an unsupported version).
 * - Adding Node 24 to the CI matrix without updating `engines` to reflect
 *   actual support.
 * - Removing a Node version from CI but still claiming support in `engines`.
 */

import { readFile } from 'node:fs/promises';
import { parse } from 'yaml';

/**
 * Extract the minimum major Node.js version from an engines.node semver range.
 * Handles common formats: `>=20.0.0`, `>=20`, `^20.0.0`, `~20.0.0`, `20.x`.
 */
function parseMinMajor(range: string): number {
  const match = range.match(/(\d+)/);
  if (!match) {
    throw new Error(`Could not parse minimum Node.js version from engines.node: "${range}"`);
  }
  return parseInt(match[1], 10);
}

export default async function validateNodeVersion(): Promise<void> {
  // 1. Read package.json engines.node
  const pkg = JSON.parse(await readFile('package.json', 'utf-8'));
  const enginesNode: string | undefined = pkg.engines?.node;

  if (!enginesNode) {
    throw new Error(
      'package.json does not specify engines.node. Add it to declare supported Node.js versions.'
    );
  }

  const minMajor = parseMinMajor(enginesNode);
  console.log(`package.json engines.node: "${enginesNode}" (minimum major: ${minMajor})`);

  // 2. Read CI workflow matrix
  const ciYaml = await readFile('.github/workflows/ci.yml', 'utf-8');
  const ci = parse(ciYaml);

  const testJob = ci.jobs?.test;
  if (!testJob?.strategy?.matrix?.['node-version']) {
    throw new Error('CI workflow does not have a test job with a node-version matrix.');
  }

  const matrixVersions: number[] = testJob.strategy.matrix['node-version'].map(
    (v: number | string) => (typeof v === 'string' ? parseInt(v, 10) : v)
  );
  console.log(`CI matrix node versions: [${matrixVersions.join(', ')}]`);

  // 3. Check: minimum engines version must be in the CI matrix
  const errors: string[] = [];

  if (!matrixVersions.includes(minMajor)) {
    errors.push(
      `engines.node minimum (${minMajor}) is not tested in CI matrix. ` +
        `Add ${minMajor} to the node-version matrix in .github/workflows/ci.yml, ` +
        `or update engines.node to match the actual minimum tested version.`
    );
  }

  // 4. Check: no CI matrix version is below the engines minimum
  const belowMin = matrixVersions.filter((v) => v < minMajor);
  if (belowMin.length > 0) {
    errors.push(
      `CI tests Node ${belowMin.join(', ')} which is below engines.node minimum (${minMajor}). ` +
        `Either remove ${belowMin.join(', ')} from the CI matrix, ` +
        `or lower engines.node to ">=${Math.min(...belowMin)}.0.0".`
    );
  }

  // 5. Check: CI matrix minimum should equal engines minimum
  const matrixMin = Math.min(...matrixVersions);
  if (matrixMin > minMajor) {
    errors.push(
      `engines.node claims support from Node ${minMajor}, but CI only tests ` +
        `from Node ${matrixMin}. Either add Node ${minMajor} to the CI matrix, ` +
        `or update engines.node to ">=${matrixMin}.0.0".`
    );
  }

  if (errors.length > 0) {
    for (const err of errors) {
      console.error(`  - ${err}`);
    }
    throw new Error('Node.js version configuration is inconsistent.');
  }

  console.log('\nengines.node and CI matrix are consistent.');
}
