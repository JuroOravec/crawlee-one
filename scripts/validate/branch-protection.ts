/**
 * Validates that GitHub branch protection required status checks match the CI
 * workflow job names in `ci.yml`. Catches drift where CI changes but branch protection
 * still references old job names, causing PRs to get stuck.
 *
 * Requires `gh` CLI with admin access to the repo. If the API call fails
 * (e.g. insufficient permissions), the script warns and skips rather than
 * failing -- this avoids breaking CI for contributors who lack admin access.
 */

import { readFile } from 'node:fs/promises';
import { execSync } from 'node:child_process';
import { parse } from 'yaml';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Cartesian product of N arrays. */
function cartesian<T>(...arrays: T[][]): T[][] {
  return arrays.reduce<T[][]>(
    (acc, arr) => acc.flatMap((combo) => arr.map((val) => [...combo, val])),
    [[]]
  );
}

/**
 * Parse the CI workflow YAML and derive the set of job names that GitHub
 * Actions will report as status checks.
 *
 * For matrix jobs the format is: `{job} ({val1}, {val2}, ...)`
 * For non-matrix jobs: just the job key name.
 */
async function getExpectedChecks(): Promise<Set<string>> {
  const ciYaml = await readFile('.github/workflows/ci.yml', 'utf-8');
  const ci = parse(ciYaml);

  const checks = new Set<string>();

  for (const [jobName, jobDef] of Object.entries(ci.jobs)) {
    const job = jobDef as Record<string, unknown>;
    const strategy = job.strategy as { matrix?: Record<string, unknown> } | undefined;
    const matrix = strategy?.matrix;

    if (matrix) {
      // Collect only array-valued keys (skip `include`, `exclude`, etc.)
      const keys = Object.keys(matrix).filter((k) => Array.isArray(matrix[k]));
      const values = keys.map((k) => matrix[k] as unknown[]);

      if (values.length > 0) {
        for (const combo of cartesian(...values)) {
          checks.add(`${jobName} (${combo.join(', ')})`);
        }
      } else {
        checks.add(jobName);
      }
    } else {
      checks.add(jobName);
    }
  }

  return checks;
}

/**
 * Fetch the required status checks from GitHub branch protection for `main`.
 * Returns null if the API call fails (missing `gh`, no auth, no admin access).
 */
function getActualChecks(): Set<string> | null {
  try {
    // Get owner/repo
    const nwo = execSync('gh repo view --json nameWithOwner -q .nameWithOwner', {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();

    // Fetch branch protection
    const raw = execSync(
      `gh api repos/${nwo}/branches/main/protection --jq '.required_status_checks.checks'`,
      { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }
    ).trim();

    if (!raw || raw === 'null') {
      console.warn('Branch protection has no required status checks configured.');
      return new Set();
    }

    const checks = JSON.parse(raw) as { context: string }[];
    return new Set(checks.map((c) => c.context));
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export default async function validateBranchProtection(): Promise<void> {
  // 1. Derive expected checks from CI YAML
  const expected = await getExpectedChecks();
  console.log('Expected CI job names:');
  for (const name of [...expected].sort()) {
    console.log(`  - ${name}`);
  }

  // 2. Fetch actual branch protection checks
  const actual = getActualChecks();

  if (actual === null) {
    console.warn('');
    console.warn('Could not fetch branch protection settings from GitHub.');
    console.warn('This usually means `gh` is not installed, not authenticated, or the');
    console.warn('current token lacks admin access to the repo.');
    console.warn('');
    console.warn('To run this check locally, authenticate with:');
    console.warn('  gh auth login');
    console.warn('');
    console.warn('To run in CI, add a PAT with `repo` scope as a secret and set GH_TOKEN.');
    console.warn('');
    console.warn('Skipping branch protection validation.');
    return;
  }

  console.log('\nBranch protection required checks:');
  if (actual.size === 0) {
    console.log('  (none)');
  } else {
    for (const name of [...actual].sort()) {
      console.log(`  - ${name}`);
    }
  }

  // 3. Compare
  const missing = [...expected].filter((c) => !actual.has(c));
  const extra = [...actual].filter((c) => !expected.has(c));

  if (missing.length === 0 && extra.length === 0) {
    console.log('\nBranch protection checks match CI job names.');
    return;
  }

  // 4. Report mismatch
  console.error('');
  if (missing.length > 0) {
    console.error('CI jobs NOT required by branch protection (PRs will merge without them):');
    for (const name of missing) {
      console.error(`  - ${name}`);
    }
  }
  if (extra.length > 0) {
    console.error(
      'Branch protection requires checks that no longer exist in CI (PRs will get stuck):'
    );
    for (const name of extra) {
      console.error(`  - ${name}`);
    }
  }

  // 5. Print fix instructions
  const nwo = execSync('gh repo view --json nameWithOwner -q .nameWithOwner', {
    encoding: 'utf-8',
    stdio: ['pipe', 'pipe', 'pipe'],
  }).trim();

  const checksPayload = [...expected]
    .sort()
    .map((c) => `      { "context": "${c}" }`)
    .join(',\n');

  console.error('');
  console.error('Update branch protection to match CI by running:');
  console.error('');
  console.error(`gh api repos/${nwo}/branches/main/protection \\`);
  console.error('  --method PUT \\');
  console.error('  -H "Accept: application/vnd.github+json" \\');
  console.error("  --input - <<'EOF'");
  console.error('{');
  console.error('  "required_status_checks": {');
  console.error('    "strict": true,');
  console.error('    "checks": [');
  console.error(checksPayload);
  console.error('    ]');
  console.error('  },');
  console.error('  "enforce_admins": false,');
  console.error('  "required_pull_request_reviews": {');
  console.error('    "required_approving_review_count": 0');
  console.error('  },');
  console.error('  "restrictions": null');
  console.error('}');
  console.error('EOF');
  console.error('');

  throw new Error('Branch protection required checks do not match CI job names.');
}
