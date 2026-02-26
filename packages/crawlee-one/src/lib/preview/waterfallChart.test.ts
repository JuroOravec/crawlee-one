import { describe, expect, it } from 'vitest';

import { renderWaterfallChart } from './waterfallChart.js';

describe('renderWaterfallChart', () => {
  it('renders empty message when no entries', () => {
    const html = renderWaterfallChart([]);
    expect(html).toContain('No request data');
    expect(html).toContain('handledAt timestamps');
  });

  it('renders chart when entries exist', () => {
    const entries = [
      {
        id: 'req1',
        url: 'https://a.com',
        handledAt: '2026-01-01T00:00:00.000Z',
        lastHandledAt: '2025-12-31T23:59:59.999Z',
      },
      {
        id: 'req2',
        url: 'https://b.com',
        handledAt: '2026-01-01T00:00:05.000Z',
        lastHandledAt: '2026-01-01T00:00:00.000Z',
      },
    ];
    const html = renderWaterfallChart(entries);
    expect(html).toContain('Request handling timeline');
    expect(html).toContain('waterfall-chart');
    expect(html).toContain('2 requests');
    expect(html).toContain('apexcharts');
    expect(html).toContain('cdn.jsdelivr.net');
  });

  it('accepts custom title and itemLabel for dataset context', () => {
    const entries: Parameters<typeof renderWaterfallChart>[0] = [];
    const html = renderWaterfallChart(entries, {
      title: 'Dataset handling time',
      itemLabel: 'entry',
    });
    expect(html).toContain('Dataset handling time');
    expect(html).toContain('No entry data');
    expect(html).toContain('dateHandled');
  });
});
