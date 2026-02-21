/**
 * HTML page generators for the preview server.
 * Uses template literals; no external templating.
 */

import { buildSortParam, type ReportSummary } from './storage.js';
import type { RequestTimelineEntry } from './storage.js';
import { renderDurationHistogramChart } from './durationHistogramChart.js';
import { renderWaterfallChart } from './waterfallChart.js';

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

/** Shared nav links for Datasets, Requests, and Reports. */
const navLinks = (basePath: string) => {
  const datasetsHref = pathTo(basePath, 'datasets');
  const requestsHref = pathTo(basePath, 'requests');
  const reportsHref = pathTo(basePath, 'reports');
  return `<a href="${escapeHtml(datasetsHref)}">Datasets</a> <span>|</span> <a href="${escapeHtml(requestsHref)}">Requests</a> <span>|</span> <a href="${escapeHtml(reportsHref)}">Reports</a>`;
};

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
    .report-embed { margin-top: 1rem; }
    .report-iframe { width: 100%; min-height: calc(100vh - 200px); border: 1px solid #ccc; border-radius: 4px; }
    .tabs { display: flex; gap: 0; margin-bottom: 1rem; border-bottom: 1px solid #ccc; }
    .tab-link { padding: 0.5rem 1rem; color: #0066cc; text-decoration: none; border-bottom: 2px solid transparent; margin-bottom: -1px; }
    .tab-link:hover { text-decoration: underline; }
    .tab-link.active { font-weight: 600; color: #1a1a1a; border-bottom-color: #0066cc; }
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

/** List datasets. */
export function pageDatasets(
  basePath: string,
  datasets: { id: string; itemCount: number }[]
): string {
  const breadcrumbs = navLinks(basePath);
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

/** List reports. */
export function pageReports(basePath: string, reports: ReportSummary[]): string {
  const breadcrumbs = navLinks(basePath);
  let list = '';
  for (const r of reports) {
    const href = pathTo(basePath, 'reports', encodeURIComponent(r.id));
    const formatLabel = r.hasHtml && r.hasJson ? 'HTML, JSON' : r.hasHtml ? 'HTML' : 'JSON';
    list += `
    <li class="dataset-item">
      <a href="${escapeHtml(href)}">${escapeHtml(r.id)}</a>
      <div class="dataset-meta">${formatLabel}</div>
    </li>`;
  }
  const empty =
    reports.length === 0
      ? '<p>No reports found in storage/reports. Run <code>crawlee-one llm compare</code> to generate reports.</p>'
      : '';
  return `${layoutStart('Reports', breadcrumbs)}
<h1>Reports</h1>
${empty}
<ul class="dataset-list">${list}</ul>
${layoutEnd}`;
}

/** List request queues. */
export function pageRequestQueues(
  basePath: string,
  queues: { id: string; requestCount: number }[]
): string {
  const breadcrumbs = navLinks(basePath);
  let list = '';
  for (const q of queues) {
    const href = pathTo(basePath, 'requests', encodeURIComponent(q.id));
    list += `
    <li class="dataset-item">
      <a href="${escapeHtml(href)}">${escapeHtml(q.id)}</a>
      <div class="dataset-meta">${q.requestCount} request${q.requestCount === 1 ? '' : 's'}</div>
    </li>`;
  }
  const empty =
    queues.length === 0
      ? '<p>No request queues found in storage/request_queues. Run a crawler to populate request queues.</p>'
      : '';
  return `${layoutStart('Requests', breadcrumbs)}
<h1>Requests</h1>
${empty}
<ul class="dataset-list">${list}</ul>
${layoutEnd}`;
}

/** List requests in a request queue. */
export function pageRequestQueueEntries(
  basePath: string,
  queueId: string,
  entries: Record<string, string | number | boolean | null>[],
  totalCount: number,
  page: number,
  pageSize: number,
  sortSpec: { path: string; dir: 'asc' | 'desc' }[] = [],
  filterValue = '',
  filterError: string | null = null,
  tab: 'table' | 'stats' = 'table',
  statsTimelineData: RequestTimelineEntry[] = []
): string {
  const queueEntryHref = pathTo(basePath, 'requests', encodeURIComponent(queueId));
  const breadcrumbs =
    navLinks(basePath) +
    ` <span>›</span> <a href="${escapeHtml(queueEntryHref)}">${escapeHtml(queueId)}</a>`;

  const currentSortParam = buildSortParam(sortSpec);
  const tableHref = `${queueEntryHref}${buildQuery(1, currentSortParam, filterValue)}`;
  const statsHref = `${queueEntryHref}${buildQuery(1, '', '', 'stats')}`;
  const tabsHtml = `
<div class="tabs">
  <a href="${escapeHtml(tableHref)}" class="tab-link${tab === 'table' ? ' active' : ''}">Table</a>
  <a href="${escapeHtml(statsHref)}" class="tab-link${tab === 'stats' ? ' active' : ''}">Stats</a>
</div>`;

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
    const requestId = String(entry['id'] ?? '');
    const detailHref = `${queueEntryHref}/${encodeURIComponent(requestId)}`;
    tableRows += '<tr>';
    tableRows += `<td><a href="${escapeHtml(detailHref)}">${escapeHtml(requestId)}</a></td>`;
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
    const href = `${queueEntryHref}${nextQuery}`;
    thead += `<th class="sort-header${sortClass}"><a href="${escapeHtml(href)}" style="text-decoration:none;color:inherit">${escapeHtml(col)}<span class="sort-icons"><span class="arrow-up">↑</span><span class="arrow-down">↓</span></span></a></th>`;
  }
  thead += '</tr>';

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  let pagination = '<div class="pagination">';
  if (page > 1) {
    const prevQuery = buildQuery(page - 1, currentSortParam, filterValue);
    pagination += `<a href="${escapeHtml(queueEntryHref)}${prevQuery}">Previous</a> `;
  }
  pagination += `Page ${page} of ${totalPages} (${totalCount} total)`;
  if (page < totalPages) {
    const nextQuery = buildQuery(page + 1, currentSortParam, filterValue);
    pagination += ` <a href="${escapeHtml(queueEntryHref)}${nextQuery}">Next</a>`;
  }
  pagination += '</div>';

  const filterForm =
    `<form class="filter-form" method="get" action="${escapeHtml(queueEntryHref)}">
  <textarea name="filter" placeholder="obj.url?.includes('example')  // JS expression, obj = request data">${escapeHtml(filterValue)}</textarea>
  <input type="hidden" name="sort" value="${escapeHtml(currentSortParam)}">
  <input type="hidden" name="page" value="1">
  <button type="submit">Apply filter</button>
  <p class="filter-warning">This script runs on the server. Never publish this preview page.</p>
</form>` +
    (filterError ? `<p class="filter-error">Filter error: ${escapeHtml(filterError)}</p>` : '');

  const tableContent =
    tab === 'table'
      ? `${filterForm}
<div class="table-scroll">
  <table>
    <thead>${thead}</thead>
    <tbody>${tableRows}</tbody>
  </table>
</div>
${pagination}`
      : renderWaterfallChart(statsTimelineData) + renderDurationHistogramChart(statsTimelineData);

  return `${layoutStart(`${queueId} — requests`, breadcrumbs)}
<h1>${escapeHtml(queueId)}</h1>
<p>${totalCount} request${totalCount === 1 ? '' : 's'}</p>
${tabsHtml}
${tableContent}
${layoutEnd}`;
}

/** Show a single request. */
export function pageRequestDetail(
  basePath: string,
  queueId: string,
  requestId: string,
  json: object
): string {
  const queueEntryHref = pathTo(basePath, 'requests', encodeURIComponent(queueId));
  const breadcrumbs =
    navLinks(basePath) +
    ` <span>›</span> <a href="${escapeHtml(queueEntryHref)}">${escapeHtml(queueId)}</a> <span>›</span> ` +
    escapeHtml(requestId);

  const pretty = JSON.stringify(json, null, 2);
  return `${layoutStart(`Request ${escapeHtml(requestId)}`, breadcrumbs)}
<h1>Request ${escapeHtml(requestId)}</h1>
<p><a href="${escapeHtml(queueEntryHref)}">← Back to requests</a></p>
<pre>${escapeHtml(pretty)}</pre>
${layoutEnd}`;
}

/** Show a report. Report HTML is embedded in an iframe. */
export function pageReportDetail(basePath: string, reportId: string, hasHtml: boolean): string {
  const breadcrumbs =
    navLinks(basePath) +
    ` <span>›</span> ` +
    `<a href="${escapeHtml(pathTo(basePath, 'reports', encodeURIComponent(reportId)))}">${escapeHtml(reportId)}</a>`;

  const contentUrl = pathTo(basePath, 'reports', encodeURIComponent(reportId), 'content');
  const iframeHtml = hasHtml
    ? `<iframe src="${escapeHtml(contentUrl)}" class="report-iframe" title="${escapeHtml(reportId)}"></iframe>`
    : '<p>No report.html found. Only JSON may be available.</p>';

  return `${layoutStart(`Report ${escapeHtml(reportId)}`, breadcrumbs)}
<h1>${escapeHtml(reportId)}</h1>
<p><a href="${escapeHtml(pathTo(basePath, 'reports'))}">← Back to reports</a></p>
<div class="report-embed">${iframeHtml}</div>
${layoutEnd}`;
}

/** Build query string preserving page, sort, filter, and tab. */
function buildQuery(
  page: number,
  sortParam: string,
  filterValue: string,
  tab?: 'table' | 'stats'
): string {
  const params = new URLSearchParams();
  if (page > 1) params.set('page', String(page));
  if (sortParam) params.set('sort', sortParam);
  if (filterValue) params.set('filter', filterValue);
  if (tab && tab !== 'table') params.set('tab', tab);
  const q = params.toString();
  return q ? `?${q}` : '';
}

/** List dataset entries. */
export function pageDatasetEntries(
  basePath: string,
  datasetId: string,
  entries: Record<string, string | number | boolean | null>[],
  totalCount: number,
  page: number,
  pageSize: number,
  sortSpec: { path: string; dir: 'asc' | 'desc' }[] = [],
  filterValue = '',
  filterError: string | null = null,
  tab: 'table' | 'stats' = 'table',
  statsTimelineData: RequestTimelineEntry[] = []
): string {
  const datasetEntryHref = pathTo(basePath, 'datasets', encodeURIComponent(datasetId));
  const breadcrumbs =
    navLinks(basePath) +
    ` <span>›</span> <a href="${escapeHtml(datasetEntryHref)}">${escapeHtml(datasetId)}</a>`;

  const currentSortParam = buildSortParam(sortSpec);
  const tableHref = `${datasetEntryHref}${buildQuery(1, currentSortParam, filterValue)}`;
  const statsHref = `${datasetEntryHref}${buildQuery(1, '', '', 'stats')}`;
  const tabsHtml = `
<div class="tabs">
  <a href="${escapeHtml(tableHref)}" class="tab-link${tab === 'table' ? ' active' : ''}">Table</a>
  <a href="${escapeHtml(statsHref)}" class="tab-link${tab === 'stats' ? ' active' : ''}">Stats</a>
</div>`;

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

  const tableContent =
    tab === 'table'
      ? `${filterForm}
<div class="table-scroll">
  <table>
    <thead>${thead}</thead>
    <tbody>${tableRows}</tbody>
  </table>
</div>
${pagination}`
      : renderWaterfallChart(statsTimelineData, {
          title: 'Dataset handling time',
          itemLabel: 'entry',
        }) +
        renderDurationHistogramChart(statsTimelineData, {
          title: 'Entry duration distribution',
          itemLabel: 'entry',
        });

  return `${layoutStart(`${datasetId} — entries`, breadcrumbs)}
<h1>${escapeHtml(datasetId)}</h1>
<p>${totalCount} entr${totalCount === 1 ? 'y' : 'ies'}</p>
${tabsHtml}
${tableContent}
${layoutEnd}`;
}

/** Show a single dataset entry. */
export function pageEntryDetail(
  basePath: string,
  datasetId: string,
  entryId: string,
  json: object
): string {
  const datasetEntryHref = pathTo(basePath, 'datasets', encodeURIComponent(datasetId));
  const breadcrumbs =
    navLinks(basePath) +
    ` <span>›</span> <a href="${escapeHtml(datasetEntryHref)}">${escapeHtml(datasetId)}</a> <span>›</span> ` +
    escapeHtml(entryId);

  const pretty = JSON.stringify(json, null, 2);
  return `${layoutStart(`Entry ${escapeHtml(entryId)}`, breadcrumbs)}
<h1>Entry ${escapeHtml(entryId)}</h1>
<p><a href="${escapeHtml(datasetEntryHref)}">← Back to dataset</a></p>
<pre>${escapeHtml(pretty)}</pre>
${layoutEnd}`;
}

/** Show an error page. */
export function pageError(message: string, basePath = ''): string {
  const breadcrumbs = navLinks(basePath);
  return `${layoutStart('Error', breadcrumbs)}
<h1>Error</h1>
<p>${escapeHtml(message)}</p>
${layoutEnd}`;
}
