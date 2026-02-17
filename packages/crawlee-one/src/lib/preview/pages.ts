/**
 * HTML page generators for the preview server.
 * Uses template literals; no external templating.
 */

import { buildSortParam } from './storage.js';

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Build an absolute path (always starts with /). */
function pathTo(basePath: string, ...segments: string[]): string {
  const base = (basePath || '').replace(/\/$/, '');
  const path = [base, ...segments].filter(Boolean).join('/');
  return path.startsWith('/') ? path : '/' + path;
}

const layoutStart = (title: string, breadcrumbs: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)} — Crawlee datasets</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: system-ui, sans-serif; margin: 1rem 2rem; line-height: 1.5; color: #1a1a1a; }
    nav { margin-bottom: 1.5rem; font-size: 0.9rem; }
    nav a { color: #0066cc; text-decoration: none; }
    nav a:hover { text-decoration: underline; }
    nav span { color: #666; }
    h1 { font-size: 1.25rem; margin: 0 0 1rem; }
    table { border-collapse: collapse; width: 100%; font-size: 0.875rem; }
    th, td { border: 1px solid #ccc; padding: 0.4rem 0.6rem; text-align: left; }
    th { background: #f5f5f5; font-weight: 600; }
    tr:hover { background: #fafafa; }
    a { color: #0066cc; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .pagination { margin-top: 1rem; }
    .pagination a, .pagination span { margin-right: 0.5rem; }
    .dataset-list { list-style: none; padding: 0; margin: 0; }
    .dataset-item { padding: 0.75rem 0; border-bottom: 1px solid #eee; }
    .dataset-item a { font-weight: 500; }
    .dataset-meta { font-size: 0.85rem; color: #666; margin-top: 0.2rem; }
    .table-scroll {
      overflow: auto;
      min-height: 150px;
      height: calc(100vh - 320px);
      margin: 1rem 0;
    }
    .table-scroll th {
      position: sticky;
      top: 0;
      background: #f5f5f5;
      z-index: 1;
      box-shadow: 0 1px 0 #ccc;
    }
    .sort-header { white-space: nowrap; cursor: pointer; user-select: none; }
    .sort-header:hover { background: #ebebeb; }
    .sort-header .sort-icons { font-size: 0.75rem; margin-left: 0.25rem; }
    .sort-header .sort-icons .arrow-up,
    .sort-header .sort-icons .arrow-down { color: #999; }
    .sort-header.sort-asc .sort-icons .arrow-up { color: #0066cc; }
    .sort-header.sort-desc .sort-icons .arrow-down { color: #0066cc; }
    .filter-form { margin: 1rem 0; }
    .filter-form textarea { width: 100%; min-height: 2rem; font-family: monospace; font-size: 0.85rem; padding: 0.5rem; }
    .filter-warning { font-size: 0.75rem; color: #999; margin-top: 0.25rem; }
    .filter-error { font-size: 0.85rem; color: #c00; margin-top: 0.25rem; }
    pre { background: #f5f5f5; padding: 1rem; overflow-x: auto; font-size: 0.8rem; }
  </style>
</head>
<body>
  <nav>${breadcrumbs}</nav>
  <main>
`;

const layoutEnd = `
  </main>
</body>
</html>
`;

export function pageDatasets(
  basePath: string,
  datasets: { id: string; itemCount: number }[]
): string {
  const datasetsHref = pathTo(basePath, 'datasets');
  const breadcrumbs = `<a href="${escapeHtml(datasetsHref)}">Datasets</a>`;
  let list = '';
  for (const ds of datasets) {
    const href = pathTo(basePath, 'datasets', encodeURIComponent(ds.id));
    list += `
    <li class="dataset-item">
      <a href="${escapeHtml(href)}">${escapeHtml(ds.id)}</a>
      <div class="dataset-meta">${ds.itemCount} item${ds.itemCount === 1 ? '' : 's'}</div>
    </li>`;
  }
  const empty =
    datasets.length === 0
      ? '<p>No datasets found in local storage. Run a crawler to populate datasets.</p>'
      : '';
  return `${layoutStart('Datasets', breadcrumbs)}
<h1>Datasets</h1>
${empty}
<ul class="dataset-list">${list}</ul>
${layoutEnd}`;
}

/** Build query string preserving page, sort, and filter. */
function buildQuery(page: number, sortParam: string, filterValue: string): string {
  const params = new URLSearchParams();
  if (page > 1) params.set('page', String(page));
  if (sortParam) params.set('sort', sortParam);
  if (filterValue) params.set('filter', filterValue);
  const q = params.toString();
  return q ? `?${q}` : '';
}

export function pageDatasetEntries(
  basePath: string,
  datasetId: string,
  entries: Record<string, string | number | boolean | null>[],
  totalCount: number,
  page: number,
  pageSize: number,
  sortSpec: { path: string; dir: 'asc' | 'desc' }[] = [],
  filterValue = '',
  filterError: string | null = null
): string {
  const datasetHref = pathTo(basePath, 'datasets');
  const datasetEntryHref = pathTo(basePath, 'datasets', encodeURIComponent(datasetId));
  const breadcrumbs =
    `<a href="${escapeHtml(datasetHref)}">Datasets</a> <span>›</span> ` + escapeHtml(datasetId);

  const headers =
    entries.length > 0
      ? Object.keys(entries[0])
          .filter((k) => k !== 'id')
          .sort()
      : [];
  const cols = ['id', ...headers];

  const sortByPath = new Map(sortSpec.map((s, i) => [s.path, { dir: s.dir, order: i }]));

  let tableRows = '';
  for (const entry of entries) {
    const entryId = String(entry['id'] ?? '');
    const detailHref = `${datasetEntryHref}/${encodeURIComponent(entryId)}`;
    tableRows += '<tr>';
    tableRows += `<td><a href="${escapeHtml(detailHref)}">${escapeHtml(entryId)}</a></td>`;
    for (const h of headers) {
      const v = entry[h];
      const cell =
        v === null || v === undefined
          ? ''
          : typeof v === 'string'
            ? escapeHtml(v.length > 200 ? v.slice(0, 200) + '…' : v)
            : String(v);
      tableRows += `<td>${cell}</td>`;
    }
    tableRows += '</tr>';
  }

  let thead = '<tr>';
  for (const col of cols) {
    const isId = col === 'id';
    if (isId) {
      thead += `<th>${escapeHtml(col)}</th>`;
      continue;
    }
    const current = sortByPath.get(col);
    let nextSort: { path: string; dir: 'asc' | 'desc' }[];
    let sortClass = '';
    if (!current) {
      nextSort = [{ path: col, dir: 'asc' }, ...sortSpec.filter((s) => s.path !== col)];
    } else if (current.dir === 'asc') {
      nextSort = sortSpec.map((s) => (s.path === col ? { path: col, dir: 'desc' as const } : s));
      sortClass = ' sort-asc';
    } else {
      nextSort = sortSpec.filter((s) => s.path !== col);
      sortClass = ' sort-desc';
    }
    const nextQuery = buildQuery(page, buildSortParam(nextSort), filterValue);
    const href = `${datasetEntryHref}${nextQuery}`;
    thead += `<th class="sort-header${sortClass}"><a href="${escapeHtml(href)}" style="text-decoration:none;color:inherit">${escapeHtml(col)}<span class="sort-icons"><span class="arrow-up">↑</span><span class="arrow-down">↓</span></span></a></th>`;
  }
  thead += '</tr>';

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const currentSortParam = buildSortParam(sortSpec);
  let pagination = '<div class="pagination">';
  if (page > 1) {
    const prevQuery = buildQuery(page - 1, currentSortParam, filterValue);
    pagination += `<a href="${escapeHtml(datasetEntryHref)}${prevQuery}">Previous</a> `;
  }
  pagination += `Page ${page} of ${totalPages} (${totalCount} total)`;
  if (page < totalPages) {
    const nextQuery = buildQuery(page + 1, currentSortParam, filterValue);
    pagination += ` <a href="${escapeHtml(datasetEntryHref)}${nextQuery}">Next</a>`;
  }
  pagination += '</div>';

  const filterForm =
    `<form class="filter-form" method="get" action="${escapeHtml(datasetEntryHref)}">
  <textarea name="filter" placeholder="obj.name === 'Alice'  // JS expression, obj = entry data">${escapeHtml(filterValue)}</textarea>
  <input type="hidden" name="sort" value="${escapeHtml(currentSortParam)}">
  <input type="hidden" name="page" value="1">
  <button type="submit">Apply filter</button>
  <p class="filter-warning">This script runs on the server. Never publish this preview page.</p>
</form>` +
    (filterError ? `<p class="filter-error">Filter error: ${escapeHtml(filterError)}</p>` : '');

  return `${layoutStart(`${datasetId} — entries`, breadcrumbs)}
<h1>${escapeHtml(datasetId)}</h1>
<p>${totalCount} entr${totalCount === 1 ? 'y' : 'ies'}</p>
${filterForm}
<div class="table-scroll">
  <table>
    <thead>${thead}</thead>
    <tbody>${tableRows}</tbody>
  </table>
</div>
${pagination}
${layoutEnd}`;
}

export function pageEntryDetail(
  basePath: string,
  datasetId: string,
  entryId: string,
  json: object
): string {
  const datasetHref = pathTo(basePath, 'datasets');
  const datasetEntryHref = pathTo(basePath, 'datasets', encodeURIComponent(datasetId));
  const breadcrumbs =
    `<a href="${escapeHtml(datasetHref)}">Datasets</a> <span>›</span> ` +
    `<a href="${escapeHtml(datasetEntryHref)}">${escapeHtml(datasetId)}</a> <span>›</span> ` +
    escapeHtml(entryId);

  const pretty = JSON.stringify(json, null, 2);
  return `${layoutStart(`Entry ${escapeHtml(entryId)}`, breadcrumbs)}
<h1>Entry ${escapeHtml(entryId)}</h1>
<p><a href="${escapeHtml(datasetEntryHref)}">← Back to dataset</a></p>
<pre>${escapeHtml(pretty)}</pre>
${layoutEnd}`;
}

export function pageError(message: string): string {
  return `${layoutStart('Error', '<a href="/datasets">Datasets</a>')}
<h1>Error</h1>
<p>${escapeHtml(message)}</p>
${layoutEnd}`;
}
