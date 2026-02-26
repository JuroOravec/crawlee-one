import { describe, expect, it } from 'vitest';

import {
  pageDatasetEntries,
  pageDatasets,
  pageEntryDetail,
  pageError,
  pageReportDetail,
  pageReports,
  pageRequestDetail,
  pageRequestQueueEntries,
  pageRequestQueues,
} from './pages.js';

describe('pageDatasets', () => {
  it('renders empty state when no datasets', () => {
    const html = pageDatasets('', []);
    expect(html).toContain('No datasets found');
    expect(html).not.toContain('<li class="dataset-item">');
  });

  it('renders nav with Datasets, Requests, and Reports links', () => {
    const html = pageDatasets('', []);
    expect(html).toContain('/datasets');
    expect(html).toContain('/requests');
    expect(html).toContain('/reports');
    expect(html).toContain('Datasets');
    expect(html).toContain('Requests');
    expect(html).toContain('Reports');
  });

  it('renders dataset list with item counts', () => {
    const html = pageDatasets('', [
      { id: 'dev-foo', itemCount: 10 },
      { id: 'default', itemCount: 1 },
    ]);
    expect(html).toContain('dev-foo');
    expect(html).toContain('10 items');
    expect(html).toContain('default');
    expect(html).toContain('1 item');
    expect(html).toContain('/datasets/dev-foo');
    expect(html).toContain('/datasets/default');
  });
});

describe('pageDatasetEntries', () => {
  it('renders table with flattened entries and string IDs', () => {
    const entries = [
      { id: '000000001', name: 'Alice', 'meta.tags': '["a","b"]' },
      { id: '000000002', name: 'Bob', 'meta.tags': '[]' },
    ];
    const html = pageDatasetEntries('', 'my-ds', entries, 2, 1, 100);
    expect(html).toContain('my-ds');
    expect(html).toContain('2 entries');
    expect(html).toContain('Alice');
    expect(html).toContain('Bob');
    expect(html).toContain('000000001');
    expect(html).toContain('000000002');
    expect(html).toContain('/datasets/my-ds/000000001');
    expect(html).toContain('/datasets/my-ds/000000002');
  });

  it('renders sortable headers with arrow icons', () => {
    const entries = [
      { id: '000000001', name: 'A', x: 1 },
      { id: '000000002', name: 'B', x: 2 },
    ];
    const html = pageDatasetEntries('', 'my-ds', entries, 2, 1, 100);
    expect(html).toContain('sort-header');
    expect(html).toContain('sort-icons');
    expect(html).toContain('↑');
    expect(html).toContain('↓');
    expect(html).toContain('sort=name');
  });

  it('renders filter form with warning', () => {
    const entries = [{ id: '1', name: 'A' }];
    const html = pageDatasetEntries('', 'ds', entries, 1, 1, 100);
    expect(html).toContain('filter-form');
    expect(html).toContain('name="filter"');
    expect(html).toContain('Apply filter');
    expect(html).toContain('runs on the server');
    expect(html).toContain('Never publish');
  });

  it('renders filter error when provided', () => {
    const entries = [{ id: '1', name: 'A' }];
    const html = pageDatasetEntries('', 'ds', entries, 1, 1, 100, [], '', 'Unexpected token');
    expect(html).toContain('filter-error');
    expect(html).toContain('Unexpected token');
  });

  it('renders pagination', () => {
    const entries = Array.from({ length: 100 }, (_, i) => ({
      id: String(i).padStart(9, '0'),
      x: 1,
    }));
    const html = pageDatasetEntries('', 'ds', entries, 250, 2, 100);
    expect(html).toContain('Page 2 of 3');
    expect(html).toContain('250 total');
    expect(html).toContain('Previous');
    expect(html).toContain('Next');
  });

  it('renders Table and Stats tabs', () => {
    const entries = [{ id: '000000001', name: 'Alice' }];
    const html = pageDatasetEntries('', 'my-ds', entries, 1, 1, 100);
    expect(html).toContain('tab-link');
    expect(html).toContain('Table');
    expect(html).toContain('Stats');
    expect(html).toContain('tab=stats');
  });

  it('renders stats charts when tab=stats', () => {
    const entries = [{ id: '000000001', name: 'Alice' }];
    const statsTimelineData = [
      {
        id: '1',
        url: 'https://a.com',
        handledAt: '2026-01-01T00:00:00.000Z',
        lastHandledAt: '2025-12-31T23:59:59.999Z',
      },
      {
        id: '2',
        url: 'https://b.com',
        handledAt: '2026-01-01T00:00:03.000Z',
        lastHandledAt: '2026-01-01T00:00:00.000Z',
      },
    ];
    const html = pageDatasetEntries(
      '',
      'my-ds',
      entries,
      3,
      1,
      100,
      [],
      '',
      null,
      'stats',
      statsTimelineData
    );
    expect(html).toContain('Dataset handling time');
    expect(html).toContain('waterfall-chart');
    expect(html).toContain('Entry duration distribution');
    expect(html).toContain('duration-histogram');
    expect(html).not.toContain('<tbody>');
  });
});

describe('pageEntryDetail', () => {
  it('renders JSON payload with entry id in title', () => {
    const json = { id: 1, name: 'test', nested: { a: 1 } };
    const html = pageEntryDetail('', 'my-ds', '000000005', json);
    expect(html).toContain('Entry 000000005');
    expect(html).toContain('test');
    expect(html).toContain('nested');
    expect(html).toContain('/datasets/my-ds');
  });
});

describe('pageRequestQueues', () => {
  it('renders empty state when no queues', () => {
    const html = pageRequestQueues('', []);
    expect(html).toContain('No request queues found');
    expect(html).not.toContain('<li class="dataset-item">');
  });

  it('renders queue list with request counts', () => {
    const html = pageRequestQueues('', [
      { id: 'llm-compare--jobDetail', requestCount: 10 },
      { id: 'dev-main', requestCount: 1 },
    ]);
    expect(html).toContain('llm-compare--jobDetail');
    expect(html).toContain('10 requests');
    expect(html).toContain('1 request');
    expect(html).toContain('/requests/llm-compare--jobDetail');
  });
});

describe('pageRequestQueueEntries', () => {
  it('renders table with flattened requests', () => {
    const entries = [
      { id: 'req1', url: 'https://a.com', method: 'GET' },
      { id: 'req2', url: 'https://b.com', method: 'POST' },
    ];
    const html = pageRequestQueueEntries('', 'my-queue', entries, 2, 1, 100);
    expect(html).toContain('my-queue');
    expect(html).toContain('2 requests');
    expect(html).toContain('req1');
    expect(html).toContain('req2');
    expect(html).toContain('/requests/my-queue/req1');
    expect(html).toContain('https://a.com');
  });

  it('renders Table and Stats tabs', () => {
    const entries = [{ id: 'req1', url: 'https://a.com' }];
    const html = pageRequestQueueEntries('', 'my-queue', entries, 1, 1, 100);
    expect(html).toContain('tab-link');
    expect(html).toContain('Table');
    expect(html).toContain('Stats');
    expect(html).toContain('tab=stats');
  });

  it('renders stats chart when tab=stats', () => {
    const entries = [{ id: 'req1', url: 'https://a.com' }];
    const timestamps = [
      '2026-01-01T00:00:00.000Z',
      '2026-01-01T00:00:02.000Z',
      '2026-01-01T00:00:05.000Z',
    ];
    const timelineData = timestamps.map((handledAt, i) => ({
      id: `req-${i}`,
      url: `https://example.com/${i}`,
      handledAt,
      lastHandledAt:
        i === 0 ? new Date(new Date(handledAt).getTime() - 1).toISOString() : timestamps[i - 1]!,
    }));
    const html = pageRequestQueueEntries(
      '',
      'my-queue',
      entries,
      3,
      1,
      100,
      [],
      '',
      null,
      'stats',
      timelineData
    );
    expect(html).toContain('Request handling timeline');
    expect(html).toContain('waterfall-chart');
    expect(html).toContain('Time taken distribution');
    expect(html).toContain('duration-histogram');
    expect(html).not.toContain('<tbody>');
  });
});

describe('pageRequestDetail', () => {
  it('renders JSON and back link', () => {
    const json = { id: 'req1', url: 'https://example.com' };
    const html = pageRequestDetail('', 'my-queue', 'req1', json);
    expect(html).toContain('Request req1');
    expect(html).toContain('https://example.com');
    expect(html).toContain('← Back to requests');
    expect(html).toContain('/requests/my-queue');
  });
});

describe('pageReports', () => {
  it('renders empty state when no reports', () => {
    const html = pageReports('', []);
    expect(html).toContain('No reports found');
    expect(html).toContain('llm compare');
    expect(html).not.toContain('<li class="dataset-item">');
  });

  it('renders report list with format labels', () => {
    const html = pageReports('', [
      { id: 'llm-compare--jobDetail', hasHtml: true, hasJson: false },
      { id: 'llm-compare--other', hasHtml: true, hasJson: true },
    ]);
    expect(html).toContain('llm-compare--jobDetail');
    expect(html).toContain('llm-compare--other');
    expect(html).toContain('HTML');
    expect(html).toContain('HTML, JSON');
    expect(html).toContain('/reports/llm-compare--jobDetail');
  });
});

describe('pageReportDetail', () => {
  it('embeds report via iframe when hasHtml', () => {
    const html = pageReportDetail('', 'llm-compare--jobDetail', true);
    expect(html).toContain('llm-compare--jobDetail');
    expect(html).toContain('report-iframe');
    expect(html).toContain('/reports/llm-compare--jobDetail/content');
  });

  it('shows message when no HTML', () => {
    const html = pageReportDetail('', 'llm-compare--jobDetail', false);
    expect(html).toContain('No report.html found');
    expect(html).not.toContain('<iframe');
  });
});

describe('pageError', () => {
  it('escapes HTML in message', () => {
    const html = pageError('<script>alert(1)</script>');
    expect(html).toContain('&lt;script&gt;');
    expect(html).not.toContain('<script>');
  });
});
