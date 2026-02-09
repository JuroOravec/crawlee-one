# Benchmarking -- Deep Dive

This document covers the internals of the benchmarking infrastructure: file layout, the data pipeline, configuration, result persistence, CI integration, and one-time setup steps.

For a quick overview and day-to-day usage, see the [Benchmarking section in the Development Guide](../docs/development/README.md#benchmarking).

## Architecture

- `vitest` - Runs the actual benchmark tests
- `airspeed-velocity` - Stores rich per-commit benchmarking data to track performance changes across releases.
- `github-action-benchmark` - Takes the stored benchmark data and generates comparison alerts in PRs and Github pages for benchmarks dashboard.

NOTE: `airspeed-velocity` (`asv`) is a Python package. We reimplemented `asv`'s core functionality in `benchmarks/run-bench.ts`.

## File layout

```
benchmarks/
  config.ts           # Central configuration (single source of truth)
  helpers.ts          # measurePerf() and measureMemory() wrappers
  crawl.bench.ts      # Benchmark definitions
  run-bench.ts        # CLI: generate (run + transform), export (config → $GITHUB_ENV)
  temp/               # Transient outputs (gitignored)
    results.json        # Raw vitest JSON output
    sidecar.json        # Metadata + memory samples collected during the run
    dashboard.json      # Lightweight JSON for github-action-benchmark
  data/               # Persisted results (committed to main)
    benchmarks.json     # Auto-generated benchmark registry
    <machine>/          # One directory per machine/environment
      machine.json        # Hardware metadata
      <hash>-<env>.json   # Per-commit result file
```

## How it works

### 1. Define tests with wrapper functions

Actual benchmark tests use `measurePerf()` and `measureMemory()` functions similar to Jest's `it()`.

`measurePerf()` and `measureMemory()` wrap vitest's `bench()`.

These wrappers also save the results to a temporary file.
The results include metadata like test name, desc, perf_vs_memory, unit.

```ts
import { measurePerf, measureMemory } from './helpers.js';

describe('crawler throughput', () => {
  measurePerf(
    'jsdom crawl + parse',
    'JSDOM crawl + parse',
    async () => {
      await crawlOnce('jsdom', (ctx) => {
        // Exercise the JSDOM API
        ctx.window?.document?.title;
        ctx.window?.document?.querySelector('h1')?.textContent;
      });
    },
    { iterations: 5, time: 0 }
  );
});
```

### 2. Execute benchmarks and capture results

To execute the benchmark tests, run

```sh
run-bench.ts generate
```

Internally it calls

```sh
vitest bench --run --outputJson path/to/data.json
```

### 3. Transforms results

After vitest is done, the `generate` command then transforms the results:

1. Reads the vitest JSON output and a temp file containing metadat from `measureMemory()` and `measurePerf()`.
2. Enriches the data with system info, node version, and other things which could affect performance.

### 4. Store results

Finally, the `generate` command saves the benchmark results.

It creates a new file whose path is defined by the:

1. Machine name (as set by `BENCHMARK_MACHINE`, e.g. `ci-linux`)
2. Env name (e.g. `node23`)
3. Commit hash (e.g. `c917a8a`)

Final path may be:

```
benchmarks/data/ci-linux/c917a8a-node23.json
```

This is modelled after `airspeed-velocity` architecture.

Beside the benchmark results, we also store:

1. Machine system info in `benchmarks/data/<machine-name>/machine.json`:

   ```json
   {
     "machine": "local",
     "arch": "x64",
     "platform": "darwin",
     "os": "Darwin 25.2.0",
     "cpu": "Intel(R) Core(TM) i7-9750H CPU @ 2.60GHz",
     "num_cpu": 12,
     "ram_bytes": 17179869184
   }
   ```

2. Benchmarks metadata `benchmarks/data/benchmarks.json` (from `measureMemory` and `measurePerf`).

   ```json
   {
     "version": 1,
     "benchmarks": {
       "cheerio crawl + parse": {
         "type": "time",
         "unit": "ms",
         "pretty_name": "Cheerio crawl + parse"
       },
       "cheerio peak memory": {
         "type": "memory",
         "unit": "bytes",
         "pretty_name": "Cheerio peak memory"
       }
     }
   }
   ```

### 5. Commit results

After benchmarks have run, all that remains is to push the results to source control.

## Configuration

All benchmark settings are centralized in `benchmarks/config.ts`. This includes:

- File paths (vitest output, sidecar, dashboard JSON, results directory)
- Tracked dependencies (whose versions are recorded in each result)
- github-action-benchmark settings (alert threshold, fail-on-alert, comment-always, etc.)

The CI workflow reads these values dynamically via `run-bench.ts export` -- `config.ts` is the single source of truth.

## Benchmark dashboard

Beside the data stored in `benchmarks/data/`, we also rely on [github-action-benchmark](https://github.com/benchmark-action/github-action-benchmark)
to transform this project's Github pages into a benchmarks dashboard.

The data for the dashboard is stored on `gh-pages` branch at `dev/bench/`.

## CI integration

The `.github/workflows/benchmark.yml` workflow runs benchmarks automatically:

- **On push to `main`**: runs benchmarks, commits the results, updates the GitHub Pages dashboard.
- **On pull request**: runs benchmarks, compares against the baseline, and posts a PR comment.

## One-time setup: GitHub Pages dashboard

The CI workflow pushes benchmark data to a `gh-pages` branch and serves it via GitHub Pages. Both need to be configured once per repo. The commands below are idempotent -- safe to re-run.

```sh
# 1. Create the gh-pages branch (skip if it already exists)
if ! git ls-remote --heads origin gh-pages | grep -q gh-pages; then
  git checkout --orphan gh-pages
  git reset --hard
  git commit --allow-empty -m "Initialize gh-pages branch"
  git push origin gh-pages
  git checkout -
fi

# 2. Enable GitHub Pages with gh-pages as the source (409 = already enabled)
gh api repos/{owner}/{repo}/pages --method POST \
  -f "source[branch]=gh-pages" -f "source[path]=/" 2>/dev/null \
  && echo "GitHub Pages enabled" \
  || echo "GitHub Pages already configured (or check permissions)"
```

After the first benchmark run on `main`, the dashboard will be available at `https://<owner>.github.io/<repo>/dev/bench/`.
