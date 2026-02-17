import { describe, expect, it } from 'vitest';
import { pageDatasets, pageDatasetEntries, pageEntryDetail, pageError } from './pages.js';

describe('pageDatasets', () => {
  it('renders empty state when no datasets', () => {
    const html = pageDatasets('', []);
    expect(html).toContain('No datasets found');
    expect(html).not.toContain('<li class="dataset-item">');
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

describe('pageError', () => {
  it('escapes HTML in message', () => {
    const html = pageError('<script>alert(1)</script>');
    expect(html).toContain('&lt;script&gt;');
    expect(html).not.toContain('<script>');
  });
});
