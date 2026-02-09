/**
 * Benchmark wrapper functions that enrich vitest's bench() with metadata.
 *
 * - measurePerf()   — wraps bench() for throughput benchmarks, records metadata.
 * - measureMemory() — wraps bench() for memory benchmarks, records metadata + RSS samples.
 *
 * Both write to a unified sidecar file (benchConfig.sidecarFile) that the
 * transform step reads to auto-generate benchmarks.json and merge memory data.
 */

import fs from 'node:fs';
import { bench } from 'vitest';
import { benchConfig } from './config.js';

// ---------------------------------------------------------------------------
// Sidecar types (shared with run-bench.ts)
// ---------------------------------------------------------------------------

export interface MemorySample {
  rss_before: number;
  rss_after: number;
}

export interface SidecarEntry {
  type: 'time' | 'memory';
  unit: string;
  prettyName: string;
  /** Only present for memory benchmarks. */
  memorySamples?: MemorySample[];
}

export type SidecarData = Record<string, SidecarEntry>;

// ---------------------------------------------------------------------------
// Sidecar state — written incrementally to disk
// ---------------------------------------------------------------------------

const sidecar: SidecarData = {};

const flushSidecar = (): void => {
  const dir = benchConfig.sidecarFile.substring(0, benchConfig.sidecarFile.lastIndexOf('/'));
  if (dir) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(benchConfig.sidecarFile, JSON.stringify(sidecar, null, 2));
};

const registerMeta = (name: string, entry: SidecarEntry): void => {
  sidecar[name] = entry;
  flushSidecar();
};

const addMemorySample = (name: string, sample: MemorySample): void => {
  const entry = sidecar[name];
  if (entry?.memorySamples) {
    entry.memorySamples.push(sample);
  }
  flushSidecar();
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Throughput benchmark wrapper. Registers metadata in the sidecar, then
 * delegates to vitest's bench().
 */
export const measurePerf = (
  name: string,
  prettyName: string,
  fn: () => Promise<void>,
  options?: { iterations?: number; time?: number }
): void => {
  registerMeta(name, { type: 'time', unit: 'ms', prettyName });
  bench(name, fn, options);
};

/**
 * Memory benchmark wrapper. Registers metadata in the sidecar, wraps the
 * function to capture peak memory (RSS) delta per iteration, then delegates to vitest's
 * bench().
 */
export const measureMemory = (
  name: string,
  prettyName: string,
  fn: () => Promise<void>,
  options?: { iterations?: number; time?: number }
): void => {
  registerMeta(name, { type: 'memory', unit: 'bytes', prettyName, memorySamples: [] });

  bench(
    name,
    async () => {
      if (typeof globalThis.gc === 'function') globalThis.gc();
      const before = process.memoryUsage();
      await fn();
      const after = process.memoryUsage();
      addMemorySample(name, { rss_before: before.rss, rss_after: after.rss });
    },
    options
  );
};
