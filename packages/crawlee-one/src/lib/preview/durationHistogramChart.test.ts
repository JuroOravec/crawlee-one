import { describe, expect, it } from 'vitest';
import { renderDurationHistogramChart } from './durationHistogramChart.js';

describe('renderDurationHistogramChart', () => {
  it('renders empty message when no entries', () => {
    const html = renderDurationHistogramChart([]);
    expect(html).toContain('No request data');
    expect(html).toContain('Time taken distribution');
  });

  it('renders histogram when entries exist', () => {
    const entries = [
      {
        id: 'req1',
        url: 'https://a.com',
        handledAt: '2026-01-01T00:00:01.000Z',
        lastHandledAt: '2026-01-01T00:00:00.000Z',
      },
      {
        id: 'req2',
        url: 'https://b.com',
        handledAt: '2026-01-01T00:00:03.000Z',
        lastHandledAt: '2026-01-01T00:00:01.000Z',
      },
    ];
    const html = renderDurationHistogramChart(entries);
    expect(html).toContain('Time taken distribution');
    expect(html).toContain('duration-histogram');
    expect(html).toContain('2 requests');
    expect(html).toContain('Count');
  });

  it('accepts custom title and itemLabel for dataset context', () => {
    const html = renderDurationHistogramChart([], {
      title: 'Entry duration distribution',
      itemLabel: 'entry',
    });
    expect(html).toContain('Entry duration distribution');
    expect(html).toContain('No entry data');
    expect(html).toContain('compute durations');
  });
});
