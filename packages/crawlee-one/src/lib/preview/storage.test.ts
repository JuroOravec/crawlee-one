import { describe, expect, it } from 'vitest';
import * as fsp from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {
  buildSortParam,
  getEntriesPageWithSort,
  listDatasets,
  parseSortParam,
  readEntry,
} from './storage.js';

describe('listDatasets', () => {
  it('returns empty array when datasets dir does not exist', async () => {
    const tmp = path.join(os.tmpdir(), `crawlee-preview-${Date.now()}`);
    const result = await listDatasets(tmp);
    expect(result).toEqual([]);
  });

  it('returns datasets with item counts', async () => {
    const tmp = path.join(os.tmpdir(), `crawlee-preview-${Date.now()}`);
    const ds1 = path.join(tmp, 'datasets', 'ds-one');
    const ds2 = path.join(tmp, 'datasets', 'ds-two');
    await fsp.mkdir(ds1, { recursive: true });
    await fsp.mkdir(ds2, { recursive: true });
    await fsp.writeFile(path.join(ds1, '000000001.json'), '{}');
    await fsp.writeFile(path.join(ds1, '000000002.json'), '{}');
    await fsp.writeFile(path.join(ds2, '000000001.json'), '{}');
    await fsp.writeFile(path.join(ds2, 'metadata.json'), '{}'); // non-index file should be ignored

    try {
      const result = await listDatasets(tmp);
      expect(result).toHaveLength(2);
      const byId = Object.fromEntries(result.map((r) => [r.id, r.itemCount]));
      expect(byId['ds-one']).toBe(2);
      expect(byId['ds-two']).toBe(1);
    } finally {
      await fsp.rm(tmp, { recursive: true, force: true });
    }
  });
});

describe('readEntry', () => {
  it('returns null when file does not exist', async () => {
    const tmp = path.join(os.tmpdir(), `crawlee-preview-${Date.now()}`);
    const result = await readEntry(tmp, 'nonexistent', '0');
    expect(result).toBeNull();
  });

  it('returns parsed JSON when file exists', async () => {
    const tmp = path.join(os.tmpdir(), `crawlee-preview-${Date.now()}`);
    const dsDir = path.join(tmp, 'datasets', 'my-ds');
    await fsp.mkdir(dsDir, { recursive: true });
    const payload = { foo: 'bar', count: 42 };
    await fsp.writeFile(path.join(dsDir, '000000001.json'), JSON.stringify(payload));

    try {
      const result = await readEntry(tmp, 'my-ds', '000000001');
      expect(result).toEqual(payload);
    } finally {
      await fsp.rm(tmp, { recursive: true, force: true });
    }
  });
});

describe('parseSortParam', () => {
  it('parses empty or undefined', () => {
    expect(parseSortParam('')).toEqual([]);
    expect(parseSortParam(undefined)).toEqual([]);
  });
  it('parses asc and desc', () => {
    expect(parseSortParam('name')).toEqual([{ path: 'name', dir: 'asc' }]);
    expect(parseSortParam('-age')).toEqual([{ path: 'age', dir: 'desc' }]);
    expect(parseSortParam('a,-b,c')).toEqual([
      { path: 'a', dir: 'asc' },
      { path: 'b', dir: 'desc' },
      { path: 'c', dir: 'asc' },
    ]);
  });
});

describe('buildSortParam', () => {
  it('builds param string', () => {
    expect(buildSortParam([])).toBe('');
    expect(
      buildSortParam([
        { path: 'name', dir: 'asc' },
        { path: 'age', dir: 'desc' },
      ])
    ).toBe('name,-age');
  });
});

describe('getEntriesPageWithSort', () => {
  it('sorts by path and paginates', async () => {
    const tmp = path.join(os.tmpdir(), `crawlee-preview-sort-${Date.now()}`);
    const dsDir = path.join(tmp, 'datasets', 'ds1');
    await fsp.mkdir(dsDir, { recursive: true });
    await fsp.writeFile(path.join(dsDir, '000000001.json'), JSON.stringify({ name: 'Charlie' }));
    await fsp.writeFile(path.join(dsDir, '000000002.json'), JSON.stringify({ name: 'Alice' }));
    await fsp.writeFile(path.join(dsDir, '000000003.json'), JSON.stringify({ name: 'Bob' }));
    try {
      const { entries, totalCount } = await getEntriesPageWithSort(tmp, 'ds1', 0, 2, [
        { path: 'name', dir: 'asc' },
      ]);
      expect(entries).toHaveLength(2);
      expect(totalCount).toBe(3);
      expect((entries[0].data as { name: string }).name).toBe('Alice');
      expect((entries[1].data as { name: string }).name).toBe('Bob');
    } finally {
      await fsp.rm(tmp, { recursive: true, force: true });
    }
  });
});
