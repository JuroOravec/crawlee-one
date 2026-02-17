import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import fsp from 'node:fs/promises';

import { exportDataset } from './exportDataset.js';
import { runExport } from './runExport.js';
import type { CrawleeOneDataset } from '../integrations/types.js';

function createMockDataset(
  items: object[],
  getItemCountOverride?: () => Promise<number | null>
): CrawleeOneDataset {
  const getItemCount = getItemCountOverride ?? (async () => items.length);
  const getItems = vi.fn(async (opts?: { offset?: number; limit?: number }) => {
    const offset = opts?.offset ?? 0;
    const limit = opts?.limit ?? items.length;
    return items.slice(offset, offset + limit);
  });
  return {
    pushData: vi.fn(),
    getItems,
    getItemCount,
  } as unknown as CrawleeOneDataset;
}

describe('exportDataset', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = mkdtempSync(path.join(tmpdir(), 'crawlee-one-export-'));
  });

  it('skips when dataset is empty', async () => {
    const dataset = createMockDataset([], async () => 0);
    const result = await exportDataset({
      datasetId: 'empty',
      format: 'json',
      outputPath: path.join(tmpDir, 'out.json'),
      io: { openDataset: vi.fn().mockResolvedValue(dataset) } as any,
    });
    expect(result).toEqual({ filesWritten: [], totalEntries: 0 });
  });

  it('exports single JSON file when no split options', async () => {
    const items = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ];
    const dataset = createMockDataset(items);
    const outputPath = path.join(tmpDir, 'out.json');

    const result = await exportDataset({
      datasetId: 'test',
      format: 'json',
      outputPath,
      io: { openDataset: vi.fn().mockResolvedValue(dataset) } as any,
    });

    expect(result.filesWritten).toHaveLength(1);
    expect(result.totalEntries).toBe(2);
    expect(result.filesWritten[0]).toMatch(/out\.json$/);
    const content = await fsp.readFile(result.filesWritten[0], 'utf-8');
    const parsed = JSON.parse(content);
    expect(parsed).toEqual(items);
  });

  it('runExport delegates to exportDataset with output override', async () => {
    const items = [{ id: 1, name: 'Test' }];
    const dataset = createMockDataset(items);
    const outputPath = path.join(tmpDir, 'via-runExport.json');

    const result = await runExport({
      datasetId: 'test',
      format: 'json',
      output: outputPath,
      io: { openDataset: vi.fn().mockResolvedValue(dataset) } as any,
    });

    expect(result.filesWritten).toHaveLength(1);
    expect(result.totalEntries).toBe(1);
    const content = await fsp.readFile(result.filesWritten[0], 'utf-8');
    expect(JSON.parse(content)).toEqual(items);
  });

  it('exports CSV with dot notation and JSON-serialized arrays', async () => {
    const items = [
      { id: 1, data: { name: 'Alice' }, tags: ['a', 'b'] },
      { id: 2, data: { name: 'Bob' }, tags: ['x'] },
    ];
    const dataset = createMockDataset(items);
    const outputPath = path.join(tmpDir, 'out.csv');

    const result = await exportDataset({
      datasetId: 'test',
      format: 'csv',
      outputPath,
      io: { openDataset: vi.fn().mockResolvedValue(dataset) } as any,
    });

    expect(result.filesWritten).toHaveLength(1);
    expect(result.totalEntries).toBe(2);
    const content = await fsp.readFile(result.filesWritten[0], 'utf-8');
    expect(content).toContain('data.name');
    expect(content).toContain('Alice');
    // Array serialized as JSON (not data[0].name); CSV escapes quotes as ""
    expect(content).toContain('""a""');
    expect(content).not.toMatch(/data\[0\]/);
  });

  it('splits into multiple files with --max-size', async () => {
    const itemSize = JSON.stringify({ id: 1, fill: 'x' }).length + 2; // ~15 bytes per item
    const items = [
      { id: 1, fill: 'x' },
      { id: 2, fill: 'x' },
      { id: 3, fill: 'x' },
      { id: 4, fill: 'x' },
      { id: 5, fill: 'x' },
    ];
    const dataset = createMockDataset(items);
    const outputPath = path.join(tmpDir, 'out.json');
    const maxSizeBytes = itemSize * 2 + 1; // fits 2 items, 3rd triggers split

    const result = await exportDataset({
      datasetId: 'test',
      format: 'json',
      outputPath,
      maxSizeBytes,
      io: { openDataset: vi.fn().mockResolvedValue(dataset) } as any,
    });

    expect(result.filesWritten.length).toBeGreaterThanOrEqual(2);
    expect(result.totalEntries).toBe(5);
    for (const file of result.filesWritten) {
      const content = await fsp.readFile(file, 'utf-8');
      expect(content.length).toBeLessThanOrEqual(maxSizeBytes + 50);
    }
  });

  it('splits into multiple files with --max-entries', async () => {
    const items = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];
    const dataset = createMockDataset(items);
    const outputPath = path.join(tmpDir, 'out.json');

    const result = await exportDataset({
      datasetId: 'test',
      format: 'json',
      outputPath,
      maxEntries: 2,
      io: { openDataset: vi.fn().mockResolvedValue(dataset) } as any,
    });

    expect(result.filesWritten).toHaveLength(3); // 2 + 2 + 1
    expect(result.totalEntries).toBe(5);
    expect(result.filesWritten[0]).toMatch(/out-0\.json$/);
    expect(result.filesWritten[1]).toMatch(/out-1\.json$/);
    expect(result.filesWritten[2]).toMatch(/out-2\.json$/);

    const content0 = JSON.parse(await fsp.readFile(result.filesWritten[0], 'utf-8'));
    const content1 = JSON.parse(await fsp.readFile(result.filesWritten[1], 'utf-8'));
    const content2 = JSON.parse(await fsp.readFile(result.filesWritten[2], 'utf-8'));
    expect(content0).toEqual([{ id: 1 }, { id: 2 }]);
    expect(content1).toEqual([{ id: 3 }, { id: 4 }]);
    expect(content2).toEqual([{ id: 5 }]);
  });

  it('applies --fields filter', async () => {
    const items = [{ id: 1, name: 'Alice', secret: 'x' }];
    const dataset = createMockDataset(items);
    const outputPath = path.join(tmpDir, 'out.json');

    const result = await exportDataset({
      datasetId: 'test',
      format: 'json',
      outputPath,
      fields: ['id', 'name'],
      io: { openDataset: vi.fn().mockResolvedValue(dataset) } as any,
    });

    const content = JSON.parse(await fsp.readFile(result.filesWritten[0], 'utf-8'));
    expect(content).toEqual([{ id: 1, name: 'Alice' }]);
  });

  it('applies --fields-omit filter', async () => {
    const items = [{ id: 1, name: 'Alice', secret: 'x' }];
    const dataset = createMockDataset(items);
    const outputPath = path.join(tmpDir, 'out.json');

    const result = await exportDataset({
      datasetId: 'test',
      format: 'json',
      outputPath,
      fieldsOmit: ['secret'],
      io: { openDataset: vi.fn().mockResolvedValue(dataset) } as any,
    });

    const content = JSON.parse(await fsp.readFile(result.filesWritten[0], 'utf-8'));
    expect(content).toEqual([{ id: 1, name: 'Alice' }]);
  });
});
