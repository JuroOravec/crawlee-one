#!/usr/bin/env tsx
/**
 * Unified CLI for the benchmarking infrastructure.
 *
 * Usage:
 *   npx tsx benchmarks/run-bench.ts <command>
 *
 * Commands:
 *   generate   Run vitest bench, then transform results into rich archive + dashboard JSON
 *   export     Export benchmarks/config.ts values to $GITHUB_ENV (or print locally)
 *
 * Environment variables (for `generate`):
 *   BENCHMARK_MACHINE  - machine identifier (default: "local")
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execSync } from 'node:child_process';
import { benchConfig } from './config.js';
import type { SidecarData, SidecarEntry, MemorySample } from './helpers.js';

// ---------------------------------------------------------------------------
// Config schema
// ---------------------------------------------------------------------------

export interface BenchConfig {
  /** Schema version for the per-commit result JSON files. */
  resultVersion: number;

  // -- File paths -----------------------------------------------------------

  /** Absolute path to the project's package.json. */
  packageJsonPath: string;
  /** Absolute path to vitest bench JSON output. */
  vitestOutputFile: string;
  /** Absolute path to the unified benchmark sidecar file. */
  sidecarFile: string;
  /** Absolute path to the dashboard JSON output. */
  dashboardOutputFile: string;
  /** Absolute path to the root directory for persisted benchmark results. */
  resultsDir: string;

  // -- Tracked dependencies -------------------------------------------------

  /** Package names whose installed versions are recorded in each result file. */
  trackedDependencies: string[];

  // -- github-action-benchmark settings -------------------------------------
  // See https://github.com/benchmark-action/github-action-benchmark

  /** Display name shown in the dashboard chart header. */
  name: string;
  /** Branch that hosts the GitHub Pages dashboard. */
  ghPagesBranch: string;
  /** Directory path on the gh-pages branch where dashboard data lives. */
  benchmarkDataDirPath: string;
  /** Percentage threshold for flagging a regression (e.g. "115%"). */
  alertThreshold: string;
  /** Whether the CI workflow should fail when a regression exceeds alertThreshold. */
  failOnAlert: boolean;
  /** Post a comparison comment on every PR, not only when an alert fires. */
  commentAlways: boolean;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const rootDir = path.resolve(import.meta.dirname ?? '.', '..');

/** Convert an absolute path to a posix-style path relative to the project root. */
const toRelative = (absPath: string): string =>
  path.relative(rootDir, absPath).split(path.sep).join('/');

const readJsonFile = <T>(filePath: string): T => {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T;
};

const git = (cmd: string): string => {
  try {
    return execSync(`git ${cmd}`, { encoding: 'utf-8' }).trim();
  } catch {
    return '';
  }
};

// =========================================================================
// generate — run vitest bench with JSON output, then transform results
// =========================================================================

const cmdGenerate = () => {
  const cmd = `vitest bench --run --outputJson ${benchConfig.vitestOutputFile}`;
  console.log(`> ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });

  console.log('\n--- Transforming results ---\n');
  cmdTransform();
};

// =========================================================================
// export — write config values to $GITHUB_ENV (or print)
// =========================================================================

const cmdExport = () => {
  const vars: Record<string, string> = {
    // File paths (relative to repo root, as expected by the workflow)
    BENCH_DASHBOARD_OUTPUT: toRelative(benchConfig.dashboardOutputFile),
    BENCH_RESULTS_DIR: toRelative(benchConfig.resultsDir),

    // github-action-benchmark settings
    BENCH_GH_PAGES_BRANCH: benchConfig.ghPagesBranch,
    BENCH_DATA_DIR_PATH: benchConfig.benchmarkDataDirPath,
    BENCH_ALERT_THRESHOLD: benchConfig.alertThreshold,
    BENCH_FAIL_ON_ALERT: String(benchConfig.failOnAlert),
    BENCH_COMMENT_ALWAYS: String(benchConfig.commentAlways),
  };

  const githubEnvPath = process.env.GITHUB_ENV;

  if (githubEnvPath) {
    const lines = Object.entries(vars)
      .map(([k, v]) => `${k}=${v}`)
      .join('\n');
    fs.appendFileSync(githubEnvPath, lines + '\n');
    console.log('Exported benchmark config to $GITHUB_ENV:');
  } else {
    console.log('GITHUB_ENV not set — printing values (dry run):');
  }

  for (const [k, v] of Object.entries(vars)) {
    console.log(`  ${k}=${v}`);
  }
};

// =========================================================================
// transform (internal) — convert vitest output to rich archive + dashboard JSON
// =========================================================================

// -- Types ----------------------------------------------------------------

interface VitestBenchmark {
  id: string;
  name: string;
  rank: number;
  rme: number;
  samples: number[];
  sampleCount: number;
  median: number;
  totalTime: number;
  min: number;
  max: number;
  hz: number;
  period: number;
  mean: number;
  sd: number;
  variance: number;
  sem: number;
  df: number;
  critical: number;
  moe: number;
  p75: number;
  p99: number;
  p995: number;
  p999: number;
}

interface VitestBenchGroup {
  fullName: string;
  benchmarks: VitestBenchmark[];
}

interface VitestBenchFile {
  filepath: string;
  groups: VitestBenchGroup[];
}

interface VitestBenchOutput {
  files: VitestBenchFile[];
}

interface RichResultEntry {
  value: number;
  unit: string;
  type: 'time' | 'memory';
  samples?: number[];
  stats: Record<string, number>;
}

interface RichResult {
  version: number;
  commit_hash: string;
  commit_hash_short: string;
  commit_date: string;
  branch: string;
  tag: string;
  date: number;
  env_name: string;
  params: {
    machine: string;
    node: string;
    os: string;
  };
  node_version: string;
  dependencies: Record<string, string>;
  results: Record<string, RichResultEntry>;
}

interface DashboardEntry {
  name: string;
  unit: string;
  value: number;
}

// -- Implementation -------------------------------------------------------

const cmdTransform = () => {
  // Collect environment metadata
  const machine = process.env.BENCHMARK_MACHINE || 'local';
  const nodeVersion = process.version.slice(1); // e.g. "22.14.0"
  const nodeMajor = nodeVersion.split('.')[0]; // e.g. "22"
  const commitFull = git('rev-parse HEAD');
  const commitShort = git('rev-parse --short HEAD');
  const commitDate = git('log -1 --format=%cI');
  const branch = git('rev-parse --abbrev-ref HEAD');
  const tag = git('describe --tags --exact-match 2>/dev/null') || '';

  // Read dependency versions from package.json + node_modules
  const getInstalledVersion = (pkg: string): string => {
    try {
      const pkgPath = path.resolve(
        path.dirname(benchConfig.packageJsonPath),
        'node_modules',
        pkg,
        'package.json'
      );
      return readJsonFile<{ version: string }>(pkgPath).version;
    } catch {
      return '';
    }
  };

  const dependencies: Record<string, string> = {};
  for (const dep of benchConfig.trackedDependencies) {
    const ver = getInstalledVersion(dep);
    if (ver) dependencies[dep] = ver;
  }

  // Read vitest bench output
  const vitestOutputPath = benchConfig.vitestOutputFile;

  if (!fs.existsSync(vitestOutputPath)) {
    console.error(
      `Error: vitest output not found at ${vitestOutputPath}\n` +
        'Run "npx tsx benchmarks/run-bench.ts generate" first.'
    );
    process.exit(1);
  }

  const vitestOutput = readJsonFile<VitestBenchOutput>(vitestOutputPath);

  // Read unified sidecar (if present)
  const sidecarPath = benchConfig.sidecarFile;

  let sidecar: SidecarData = {};
  if (fs.existsSync(sidecarPath)) {
    sidecar = readJsonFile<SidecarData>(sidecarPath);
  }

  // Transform vitest results -> rich result entries
  const results: Record<string, RichResultEntry> = {};

  for (const file of vitestOutput.files) {
    for (const group of file.groups) {
      for (const b of group.benchmarks) {
        const meta = sidecar[b.name] as SidecarEntry | undefined;

        // If the sidecar knows this is a memory bench, handle it specially
        if (meta?.type === 'memory' && meta.memorySamples && meta.memorySamples.length > 0) {
          const samples = meta.memorySamples;
          const deltas = samples.map((s: MemorySample) => s.rss_after - s.rss_before);
          deltas.sort((a: number, b: number) => a - b);
          const medianDelta =
            deltas.length % 2 === 1
              ? deltas[Math.floor(deltas.length / 2)]
              : (deltas[Math.floor(deltas.length / 2) - 1] +
                  deltas[Math.floor(deltas.length / 2)]) /
                2;

          const avgBefore =
            samples.reduce((s: number, v: MemorySample) => s + v.rss_before, 0) / samples.length;
          const avgAfter =
            samples.reduce((s: number, v: MemorySample) => s + v.rss_after, 0) / samples.length;

          results[b.name] = {
            value: medianDelta,
            unit: meta.unit ?? 'bytes',
            type: 'memory',
            stats: {
              median_delta: medianDelta,
              mean_delta: deltas.reduce((s: number, v: number) => s + v, 0) / deltas.length,
              min_delta: Math.min(...deltas),
              max_delta: Math.max(...deltas),
              rss_before_avg: avgBefore,
              rss_after_avg: avgAfter,
              samples: samples.length,
            },
          };
        } else {
          // Default: throughput / time benchmark
          results[b.name] = {
            value: b.mean,
            unit: meta?.unit ?? 'ms',
            type: meta?.type ?? 'time',
            samples: b.samples.length > 0 ? b.samples : undefined,
            stats: {
              mean: b.mean,
              median: b.median,
              min: b.min,
              max: b.max,
              stddev: b.sd,
              rme: b.rme,
              hz: b.hz,
              iterations: b.sampleCount,
              p75: b.p75,
              p99: b.p99,
              p995: b.p995,
              p999: b.p999,
            },
          };
        }
      }
    }
  }

  // 1. Write rich result file
  const richResult: RichResult = {
    version: benchConfig.resultVersion,
    commit_hash: commitFull,
    commit_hash_short: commitShort,
    commit_date: commitDate,
    branch,
    tag,
    date: Date.now(),
    env_name: `node${nodeMajor}`,
    params: {
      machine,
      node: nodeVersion,
      os: `${os.type()} ${os.release()}`,
    },
    node_version: nodeVersion,
    dependencies,
    results,
  };

  const resultsDir = path.resolve(benchConfig.resultsDir, machine);
  fs.mkdirSync(resultsDir, { recursive: true });

  const resultFileName = `${commitShort}-node${nodeMajor}.json`;
  const resultFilePath = path.join(resultsDir, resultFileName);
  fs.writeFileSync(resultFilePath, JSON.stringify(richResult, null, 2) + '\n');
  console.log(`Rich result written to ${resultFilePath}`);

  // Write / update machine.json
  const machineJsonPath = path.join(resultsDir, 'machine.json');
  if (!fs.existsSync(machineJsonPath)) {
    const cpus = os.cpus();
    const machineInfo = {
      machine,
      arch: os.arch(),
      platform: os.platform(),
      os: `${os.type()} ${os.release()}`,
      cpu: cpus.length > 0 ? cpus[0].model : 'unknown',
      num_cpu: cpus.length,
      ram_bytes: os.totalmem(),
    };
    fs.writeFileSync(machineJsonPath, JSON.stringify(machineInfo, null, 2) + '\n');
    console.log(`Machine info written to ${machineJsonPath}`);
  }

  // 2. Auto-generate benchmarks.json from sidecar metadata
  if (Object.keys(sidecar).length > 0) {
    const benchmarksRegistry: {
      version: number;
      benchmarks: Record<string, { type: string; unit: string; pretty_name: string }>;
    } = {
      version: benchConfig.resultVersion,
      benchmarks: {},
    };

    for (const [name, meta] of Object.entries(sidecar)) {
      benchmarksRegistry.benchmarks[name] = {
        type: meta.type,
        unit: meta.unit,
        pretty_name: meta.prettyName,
      };
    }

    const benchmarksJsonPath = path.join(benchConfig.resultsDir, 'benchmarks.json');
    fs.mkdirSync(path.dirname(benchmarksJsonPath), { recursive: true });
    fs.writeFileSync(benchmarksJsonPath, JSON.stringify(benchmarksRegistry, null, 2) + '\n');
    console.log(`Benchmarks registry written to ${benchmarksJsonPath}`);
  }

  // 3. Write lightweight dashboard JSON for github-action-benchmark
  const dashboardOutput: DashboardEntry[] = [];

  for (const [name, entry] of Object.entries(results)) {
    dashboardOutput.push({
      name,
      unit: entry.type === 'time' ? 'ms' : 'bytes',
      value: entry.type === 'time' ? entry.stats.mean : entry.value,
    });
  }

  const dashboardPath = benchConfig.dashboardOutputFile;
  fs.writeFileSync(dashboardPath, JSON.stringify(dashboardOutput, null, 2) + '\n');
  console.log(`Dashboard output written to ${dashboardPath}`);

  // Cleanup sidecar
  if (fs.existsSync(sidecarPath)) {
    fs.unlinkSync(sidecarPath);
  }

  console.log('Transform complete.');
};

// =========================================================================
// CLI dispatch
// =========================================================================

const COMMANDS: Record<string, () => void> = {
  generate: cmdGenerate,
  export: cmdExport,
};

const command = process.argv[2];

if (!command || !COMMANDS[command]) {
  console.error(
    `Usage: npx tsx benchmarks/run-bench.ts <command>\n\n` +
      `Commands:\n` +
      `  generate   Run benchmarks and transform results into rich archive + dashboard JSON\n` +
      `  export     Export config values to $GITHUB_ENV (or print locally)\n`
  );
  process.exit(1);
}

COMMANDS[command]();
