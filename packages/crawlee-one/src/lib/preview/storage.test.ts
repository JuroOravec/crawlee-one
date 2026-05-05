import * as fsp from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  buildSortParam,
  getAllDatasetTimelineData,
  getAllEntryDateHandleds,
  getAllRequestTimelineData,
  getEntriesPageWithSort,
  getRequestsPageWithSort,
  listDatasets,
  listReports,
  listRequestIds,
  listRequestQueues,
  parseSortParam,
  readEntry,
  readReportHtml,
  readRequest,
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

describe('listReports', () => {
  it('returns empty array when reports dir does not exist', async () => {
    const tmp = path.join(os.tmpdir(), `crawlee-preview-${Date.now()}`);
    const result = await listReports(tmp);
    expect(result).toEqual([]);
  });

  it('returns reports with hasHtml/hasJson flags', async () => {
    const tmp = path.join(os.tmpdir(), `crawlee-preview-${Date.now()}`);
    const r1 = path.join(tmp, 'reports', 'llm-compare--jobDetail');
    const r2 = path.join(tmp, 'reports', 'llm-compare--other');
    await fsp.mkdir(r1, { recursive: true });
    await fsp.mkdir(r2, { recursive: true });
    await fsp.writeFile(path.join(r1, 'report.html'), '<html></html>');
    await fsp.writeFile(path.join(r2, 'report.html'), '<html></html>');
    await fsp.writeFile(path.join(r2, 'report.json'), '{}');

    try {
      const result = await listReports(tmp);
      expect(result).toHaveLength(2);
      expect(result.find((r) => r.id === 'llm-compare--jobDetail')).toEqual({
        id: 'llm-compare--jobDetail',
        hasHtml: true,
        hasJson: false,
      });
      expect(result.find((r) => r.id === 'llm-compare--other')).toEqual({
        id: 'llm-compare--other',
        hasHtml: true,
        hasJson: true,
      });
    } finally {
      await fsp.rm(tmp, { recursive: true, force: true });
    }
  });

  it('ignores report dirs without report.html or report.json', async () => {
    const tmp = path.join(os.tmpdir(), `crawlee-preview-${Date.now()}`);
    const r1 = path.join(tmp, 'reports', 'empty-dir');
    await fsp.mkdir(r1, { recursive: true });

    try {
      const result = await listReports(tmp);
      expect(result).toEqual([]);
    } finally {
      await fsp.rm(tmp, { recursive: true, force: true });
    }
  });
});

describe('listRequestQueues', () => {
  it('returns empty array when request_queues dir does not exist', async () => {
    const tmp = path.join(os.tmpdir(), `crawlee-preview-${Date.now()}`);
    const result = await listRequestQueues(tmp);
    expect(result).toEqual([]);
  });

  it('returns queues with request counts, excluding .response.json', async () => {
    const tmp = path.join(os.tmpdir(), `crawlee-preview-${Date.now()}`);
    const q1 = path.join(tmp, 'request_queues', 'llm-compare--jobDetail');
    const q2 = path.join(tmp, 'request_queues', 'dev-main');
    await fsp.mkdir(q1, { recursive: true });
    await fsp.mkdir(q2, { recursive: true });
    await fsp.writeFile(path.join(q1, 'abc123.json'), '{}');
    await fsp.writeFile(path.join(q1, 'def456.json'), '{}');
    await fsp.writeFile(path.join(q1, 'abc123.response.json'), '{}'); // excluded
    await fsp.writeFile(path.join(q2, 'xyz789.json'), '{}');

    try {
      const result = await listRequestQueues(tmp);
      expect(result).toHaveLength(2);
      expect(result.find((r) => r.id === 'llm-compare--jobDetail')).toEqual({
        id: 'llm-compare--jobDetail',
        requestCount: 2,
      });
      expect(result.find((r) => r.id === 'dev-main')).toEqual({
        id: 'dev-main',
        requestCount: 1,
      });
    } finally {
      await fsp.rm(tmp, { recursive: true, force: true });
    }
  });
});

describe('listRequestIds', () => {
  it('returns ids excluding .response.json files', async () => {
    const tmp = path.join(os.tmpdir(), `crawlee-preview-${Date.now()}`);
    const q = path.join(tmp, 'request_queues', 'my-queue');
    await fsp.mkdir(q, { recursive: true });
    await fsp.writeFile(path.join(q, 'req1.json'), '{}');
    await fsp.writeFile(path.join(q, 'req2.json'), '{}');
    await fsp.writeFile(path.join(q, 'req1.response.json'), '{}');

    try {
      const result = await listRequestIds(tmp, 'my-queue');
      expect(result).toEqual(['req1', 'req2']);
    } finally {
      await fsp.rm(tmp, { recursive: true, force: true });
    }
  });
});

describe('readRequest', () => {
  it('returns null when request does not exist', async () => {
    const tmp = path.join(os.tmpdir(), `crawlee-preview-${Date.now()}`);
    const result = await readRequest(tmp, 'nonexistent', 'req1');
    expect(result).toBeNull();
  });

  it('returns parsed JSON when request exists', async () => {
    const tmp = path.join(os.tmpdir(), `crawlee-preview-${Date.now()}`);
    const q = path.join(tmp, 'request_queues', 'my-queue');
    await fsp.mkdir(q, { recursive: true });
    const payload = { id: 'req1', url: 'https://example.com' };
    await fsp.writeFile(path.join(q, 'req1.json'), JSON.stringify(payload));

    try {
      const result = await readRequest(tmp, 'my-queue', 'req1');
      expect(result).toEqual(payload);
    } finally {
      await fsp.rm(tmp, { recursive: true, force: true });
    }
  });
});

describe('getRequestsPageWithSort', () => {
  it('sorts and paginates requests', async () => {
    const tmp = path.join(os.tmpdir(), `crawlee-preview-sort-${Date.now()}`);
    const q = path.join(tmp, 'request_queues', 'q1');
    await fsp.mkdir(q, { recursive: true });
    await fsp.writeFile(path.join(q, 'a.json'), JSON.stringify({ url: 'https://c.com' }));
    await fsp.writeFile(path.join(q, 'b.json'), JSON.stringify({ url: 'https://a.com' }));
    await fsp.writeFile(path.join(q, 'c.json'), JSON.stringify({ url: 'https://b.com' }));

    try {
      const { entries, totalCount } = await getRequestsPageWithSort(tmp, 'q1', 0, 2, [
        { path: 'url', dir: 'asc' },
      ]);
      expect(entries).toHaveLength(2);
      expect(totalCount).toBe(3);
      expect((entries[0].data as { url: string }).url).toBe('https://a.com');
      expect((entries[1].data as { url: string }).url).toBe('https://b.com');
    } finally {
      await fsp.rm(tmp, { recursive: true, force: true });
    }
  });
});

describe('getAllRequestTimelineData', () => {
  it('returns id, url, handledAt, lastHandledAt sorted by handledAt', async () => {
    const tmp = path.join(os.tmpdir(), `crawlee-preview-timeline-${Date.now()}`);
    const q = path.join(tmp, 'request_queues', 'my-queue');
    await fsp.mkdir(q, { recursive: true });
    const req1 = {
      id: 'req1',
      json: JSON.stringify({
        id: 'req1',
        url: 'https://a.com',
        handledAt: '2026-01-01T00:00:00.000Z',
      }),
    };
    const req2 = {
      id: 'req2',
      json: JSON.stringify({
        id: 'req2',
        url: 'https://b.com',
        handledAt: '2026-01-01T00:00:05.000Z',
      }),
    };
    await fsp.writeFile(path.join(q, 'req1.json'), JSON.stringify(req1));
    await fsp.writeFile(path.join(q, 'req2.json'), JSON.stringify(req2));

    try {
      const result = await getAllRequestTimelineData(tmp, 'my-queue');
      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({ id: 'req1', url: 'https://a.com' });
      expect(result[1]).toMatchObject({ id: 'req2', url: 'https://b.com' });
      expect(result[0]!.handledAt).toBe('2026-01-01T00:00:00.000Z');
      expect(result[0]!.lastHandledAt).toMatch(/2025-12-31T23:59:59/);
      expect(result[1]!.lastHandledAt).toBe('2026-01-01T00:00:00.000Z');
    } finally {
      await fsp.rm(tmp, { recursive: true, force: true });
    }
  });

  it('uses startedAt from userData for first request lastHandledAt when present', async () => {
    const tmp = path.join(os.tmpdir(), `crawlee-preview-startedAt-${Date.now()}`);
    const q = path.join(tmp, 'request_queues', 'my-queue');
    await fsp.mkdir(q, { recursive: true });
    const req1 = {
      id: 'req1',
      json: JSON.stringify({
        id: 'req1',
        url: 'https://a.com',
        userData: { startedAt: '2025-12-31T23:59:50.000Z' },
        handledAt: '2026-01-01T00:00:00.000Z',
      }),
    };
    await fsp.writeFile(path.join(q, 'req1.json'), JSON.stringify(req1));

    try {
      const result = await getAllRequestTimelineData(tmp, 'my-queue');
      expect(result).toHaveLength(1);
      expect(result[0]!.lastHandledAt).toBe('2025-12-31T23:59:50.000Z');
    } finally {
      await fsp.rm(tmp, { recursive: true, force: true });
    }
  });
});

describe('getAllEntryDateHandleds', () => {
  it('extracts metadata.dateHandled from dataset entries', async () => {
    const tmp = path.join(os.tmpdir(), `crawlee-preview-dateHandled-${Date.now()}`);
    const ds = path.join(tmp, 'datasets', 'my-ds');
    await fsp.mkdir(ds, { recursive: true });
    await fsp.writeFile(
      path.join(ds, '000000001.json'),
      JSON.stringify({ name: 'A', metadata: { dateHandled: '2026-01-01T00:00:00.000Z' } })
    );
    await fsp.writeFile(
      path.join(ds, '000000002.json'),
      JSON.stringify({ name: 'B', metadata: { dateHandled: '2026-01-01T00:00:03.000Z' } })
    );

    try {
      const result = await getAllEntryDateHandleds(tmp, 'my-ds');
      expect(result).toHaveLength(2);
      expect(result).toContain('2026-01-01T00:00:00.000Z');
      expect(result).toContain('2026-01-01T00:00:03.000Z');
    } finally {
      await fsp.rm(tmp, { recursive: true, force: true });
    }
  });

  it('skips entries without metadata.dateHandled', async () => {
    const tmp = path.join(os.tmpdir(), `crawlee-preview-dateHandled-${Date.now()}`);
    const ds = path.join(tmp, 'datasets', 'my-ds');
    await fsp.mkdir(ds, { recursive: true });
    await fsp.writeFile(path.join(ds, '000000001.json'), JSON.stringify({ name: 'A' }));
    await fsp.writeFile(
      path.join(ds, '000000002.json'),
      JSON.stringify({ name: 'B', metadata: { dateHandled: '2026-01-01T00:00:00.000Z' } })
    );

    try {
      const result = await getAllEntryDateHandleds(tmp, 'my-ds');
      expect(result).toEqual(['2026-01-01T00:00:00.000Z']);
    } finally {
      await fsp.rm(tmp, { recursive: true, force: true });
    }
  });
});

describe('getAllDatasetTimelineData', () => {
  it('returns timeline entries sorted by dateHandled with requestStartedAt for first', async () => {
    const tmp = path.join(os.tmpdir(), `crawlee-preview-datasetTimeline-${Date.now()}`);
    const ds = path.join(tmp, 'datasets', 'my-ds');
    await fsp.mkdir(ds, { recursive: true });
    await fsp.writeFile(
      path.join(ds, '000000001.json'),
      JSON.stringify({
        name: 'A',
        metadata: {
          dateHandled: '2026-01-01T00:00:00.000Z',
          requestStartedAt: '2025-12-31T23:59:50.000Z',
          loadedUrl: 'https://a.com',
        },
      })
    );
    await fsp.writeFile(
      path.join(ds, '000000002.json'),
      JSON.stringify({
        name: 'B',
        metadata: { dateHandled: '2026-01-01T00:00:05.000Z', loadedUrl: 'https://b.com' },
      })
    );

    try {
      const result = await getAllDatasetTimelineData(tmp, 'my-ds');
      expect(result).toHaveLength(2);
      expect(result[0]!.id).toBe('000000001');
      expect(result[0]!.lastHandledAt).toBe('2025-12-31T23:59:50.000Z');
      expect(result[1]!.id).toBe('000000002');
      expect(result[1]!.lastHandledAt).toBe('2026-01-01T00:00:00.000Z');
    } finally {
      await fsp.rm(tmp, { recursive: true, force: true });
    }
  });
});

describe('readReportHtml', () => {
  it('returns null when report.html does not exist', async () => {
    const tmp = path.join(os.tmpdir(), `crawlee-preview-${Date.now()}`);
    const result = await readReportHtml(tmp, 'nonexistent');
    expect(result).toBeNull();
  });

  it('returns HTML content when report exists', async () => {
    const tmp = path.join(os.tmpdir(), `crawlee-preview-${Date.now()}`);
    const reportDir = path.join(tmp, 'reports', 'llm-compare--jobDetail');
    await fsp.mkdir(reportDir, { recursive: true });
    const html = '<!DOCTYPE html><html><body>LLM Report</body></html>';
    await fsp.writeFile(path.join(reportDir, 'report.html'), html);

    try {
      const result = await readReportHtml(tmp, 'llm-compare--jobDetail');
      expect(result).toBe(html);
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
