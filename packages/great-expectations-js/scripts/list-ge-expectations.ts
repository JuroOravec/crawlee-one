/**
 * Fetch all Great Expectations expectation names from the GitHub repo.
 *
 * Sources:
 *   - Core:     great_expectations/expectations/core/*.py
 *   - Semantic: contrib/great_expectations_semantic_types_expectations/.../expectations/*.py
 *
 * Usage:
 *   npx tsx scripts/list-ge-expectations.ts [--format json|txt]
 *
 * The output can be shown to an LLM agent so it can pick which expectations
 * apply to which fields. We then implement them incrementally in TS/Node.
 */

const REPO = 'great-expectations/great_expectations';
const BRANCH = 'develop';

const DIRS = [
  {
    label: 'core',
    path: 'great_expectations/expectations/core',
  },
  {
    label: 'semantic_types',
    path: 'contrib/great_expectations_semantic_types_expectations/great_expectations_semantic_types_expectations/expectations',
  },
] as const;

interface GHContentsEntry {
  name: string;
  type: 'file' | 'dir';
}

async function fetchExpectationFiles(dirPath: string): Promise<string[]> {
  const url = `https://api.github.com/repos/${REPO}/contents/${dirPath}?ref=${BRANCH}`;
  const res = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'crawlee-one-ge-list',
    },
  });

  if (!res.ok) {
    throw new Error(`GitHub API ${res.status}: ${await res.text()}`);
  }

  const entries: GHContentsEntry[] = await res.json();

  return entries
    .filter((e) => e.type === 'file' && e.name.endsWith('.py'))
    .map((e) => e.name.replace(/\.py$/, ''))
    .filter((name) => name !== '__init__' && name.startsWith('expect'));
}

async function main() {
  const format = process.argv.includes('--format')
    ? process.argv[process.argv.indexOf('--format') + 1]
    : 'json';

  const result: Record<string, string[]> = {};

  for (const { label, path } of DIRS) {
    try {
      result[label] = await fetchExpectationFiles(path);
    } catch (err) {
      console.error(`Warning: failed to fetch ${label}: ${err}`);
      result[label] = [];
    }
  }

  const all = [...new Set([...result.core, ...result.semantic_types])].sort();

  if (format === 'txt') {
    for (const name of all) {
      console.log(name);
    }
  } else {
    console.log(
      JSON.stringify(
        {
          total: all.length,
          core: result.core.sort(),
          semantic_types: result.semantic_types.sort(),
        },
        null,
        2
      )
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
