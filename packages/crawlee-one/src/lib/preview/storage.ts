import path from 'node:path';

import get from 'lodash-es/get.js';
import fsp from 'node:fs/promises';

export type SortDir = 'asc' | 'desc';

export interface SortSpec {
  path: string;
  dir: SortDir;
}

/**
 * Parse sort param string. Format: "field1,-field2" (comma-sep, - = desc).
 * First field is primary sort.
 */
export function parseSortParam(param: string | undefined): SortSpec[] {
  if (!param || typeof param !== 'string') return [];
  return param
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => ({
      path: s.startsWith('-') ? s.slice(1) : s,
      dir: s.startsWith('-') ? ('desc' as const) : ('asc' as const),
    }));
}

/**
 * Build sort param string from spec.
 */
export function buildSortParam(spec: SortSpec[]): string {
  return spec.map((s) => (s.dir === 'desc' ? `-${s.path}` : s.path)).join(',');
}

/** Compare two values for sorting (null/undefined last). */
function compareValues(a: unknown, b: unknown): number {
  const aNull = a === null || a === undefined;
  const bNull = b === null || b === undefined;
  if (aNull && bNull) return 0;
  if (aNull) return 1;
  if (bNull) return -1;
  const ta = typeof a;
  const tb = typeof b;
  if (ta === 'number' && tb === 'number') return (a as number) - (b as number);
  if (ta === 'boolean' && tb === 'boolean')
    return (a as boolean) === (b as boolean) ? 0 : (a as boolean) ? 1 : -1;
  const sa = String(a);
  const sb = String(b);
  return sa.localeCompare(sb, undefined, { numeric: true });
}

export interface DatasetSummary {
  id: string;
  itemCount: number;
}

export function getStorageDir(): string {
  const baseDir = process.cwd();
  return process.env.APIFY_LOCAL_STORAGE_DIR
    ? path.resolve(process.env.APIFY_LOCAL_STORAGE_DIR)
    : path.join(baseDir, 'storage');
}

/**
 * List all datasets in local storage. Returns dataset IDs with item counts.
 * Only supports local storage (filesystem scan of storage/datasets).
 */
export async function listDatasets(storageDir: string): Promise<DatasetSummary[]> {
  const datasetsDir = path.join(storageDir, 'datasets');
  const exists = await fsp.stat(datasetsDir).catch(() => null);
  if (!exists || !exists.isDirectory()) {
    return [];
  }

  const entries = await fsp.readdir(datasetsDir, { withFileTypes: true });
  const summaries: DatasetSummary[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const datasetPath = path.join(datasetsDir, entry.name);
    const files = await fsp.readdir(datasetPath);
    const jsonFiles = files.filter((f) => /^\d+\.json$/.test(f));
    summaries.push({ id: entry.name, itemCount: jsonFiles.length });
  }

  summaries.sort((a, b) => a.id.localeCompare(b.id));
  return summaries;
}

export interface ReportSummary {
  id: string;
  hasHtml: boolean;
  hasJson: boolean;
}

/**
 * List all reports in storage/reports. Each report is a directory (e.g. llm-compare--jobDetail)
 * that may contain report.html and/or report.json.
 */
export async function listReports(storageDir: string): Promise<ReportSummary[]> {
  const reportsDir = path.join(storageDir, 'reports');
  const exists = await fsp.stat(reportsDir).catch(() => null);
  if (!exists || !exists.isDirectory()) {
    return [];
  }

  const entries = await fsp.readdir(reportsDir, { withFileTypes: true });
  const summaries: ReportSummary[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const reportPath = path.join(reportsDir, entry.name);
    const files: string[] = await fsp.readdir(reportPath).catch(() => []);
    const hasHtml = files.includes('report.html');
    const hasJson = files.includes('report.json');
    if (hasHtml || hasJson) {
      summaries.push({ id: entry.name, hasHtml, hasJson });
    }
  }

  summaries.sort((a, b) => a.id.localeCompare(b.id));
  return summaries;
}

/**
 * Read report HTML from storage/reports/{reportId}/report.html.
 */
export async function readReportHtml(storageDir: string, reportId: string): Promise<string | null> {
  const filePath = path.join(storageDir, 'reports', reportId, 'report.html');
  try {
    return await fsp.readFile(filePath, 'utf-8');
  } catch {
    return null;
  }
}

/**
 * List entry IDs (filename stems) for a dataset, sorted lexicographically.
 * E.g. ["000000001", "000000002", ...]
 */
export async function listEntryIds(storageDir: string, datasetId: string): Promise<string[]> {
  const datasetPath = path.join(storageDir, 'datasets', datasetId);
  const exists = await fsp.stat(datasetPath).catch(() => null);
  if (!exists || !exists.isDirectory()) return [];

  const files = await fsp.readdir(datasetPath);
  const ids = files.filter((f) => /^\d+\.json$/.test(f)).map((f) => f.replace(/\.json$/, ''));
  ids.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  return ids;
}

/**
 * Get a page of entries (id + parsed JSON). Uses actual file names for IDs.
 */
export async function getEntriesPage(
  storageDir: string,
  datasetId: string,
  offset: number,
  limit: number
): Promise<{ id: string; data: object }[]> {
  const ids = await listEntryIds(storageDir, datasetId);
  const pageIds = ids.slice(offset, offset + limit);
  const result: { id: string; data: object }[] = [];

  for (const id of pageIds) {
    const data = await readEntry(storageDir, datasetId, id);
    if (data !== null) result.push({ id, data });
  }

  return result;
}

export type EntryFilterFn = (entry: { id: string; data: object }) => boolean;

export interface EntriesPageResult {
  entries: { id: string; data: object }[];
  totalCount: number;
}

/**
 * Get a page of entries with optional sort and filter. Loads full dataset, filters,
 * sorts, then paginates. Supports nested paths via dot notation (e.g. "metadata.actorRunUrl").
 */
export async function getEntriesPageWithSort(
  storageDir: string,
  datasetId: string,
  offset: number,
  limit: number,
  sortSpec: SortSpec[],
  filterFn?: EntryFilterFn
): Promise<EntriesPageResult> {
  const ids = await listEntryIds(storageDir, datasetId);
  let allEntries: { id: string; data: object }[] = [];

  for (const id of ids) {
    const data = await readEntry(storageDir, datasetId, id);
    if (data !== null) allEntries.push({ id, data });
  }

  if (filterFn) {
    allEntries = allEntries.filter(filterFn);
  }

  const totalCount = allEntries.length;

  if (sortSpec.length > 0) {
    allEntries.sort((a, b) => {
      for (const { path: p, dir } of sortSpec) {
        const va = get(a.data, p);
        const vb = get(b.data, p);
        const cmp = compareValues(va, vb);
        if (cmp !== 0) return dir === 'asc' ? cmp : -cmp;
      }
      return 0;
    });
  }

  const entries = allEntries.slice(offset, offset + limit);
  return { entries, totalCount };
}

/**
 * Read a single dataset entry by ID (filename stem without .json).
 * E.g. readEntry(..., "dev-foo", "000000001") reads 000000001.json.
 */
export async function readEntry(
  storageDir: string,
  datasetId: string,
  entryId: string
): Promise<object | null> {
  if (!/^\d+$/.test(entryId)) return null;
  const filePath = path.join(storageDir, 'datasets', datasetId, `${entryId}.json`);
  try {
    const content = await fsp.readFile(filePath, 'utf-8');
    return JSON.parse(content) as object;
  } catch {
    return null;
  }
}

export interface RequestQueueSummary {
  id: string;
  requestCount: number;
}

/**
 * Request queue dirs may contain extra files like `xxx.response.json` (used by `crawlee-one dev`
 * to cache responses). Only treat `xxx.json` as request files, exclude `*.response.json` files.
 */
async function readRequestQueueFiles(queuePath: string): Promise<string[]> {
  const files = await fsp.readdir(queuePath);
  return files.filter((f) => f.endsWith('.json') && !f.endsWith('.response.json'));
}

/**
 * List all request queues in storage/request_queues.
 */
export async function listRequestQueues(storageDir: string): Promise<RequestQueueSummary[]> {
  const queuesDir = path.join(storageDir, 'request_queues');
  const exists = await fsp.stat(queuesDir).catch(() => null);
  if (!exists || !exists.isDirectory()) {
    return [];
  }

  const entries = await fsp.readdir(queuesDir, { withFileTypes: true });
  const summaries: RequestQueueSummary[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const queuePath = path.join(queuesDir, entry.name);
    const requestFiles = await readRequestQueueFiles(queuePath);
    if (requestFiles.length > 0) {
      summaries.push({ id: entry.name, requestCount: requestFiles.length });
    }
  }

  summaries.sort((a, b) => a.id.localeCompare(b.id));
  return summaries;
}

/**
 * List request IDs for a queue. Only includes *.json, excludes *.response.json.
 */
export async function listRequestIds(storageDir: string, queueId: string): Promise<string[]> {
  const queuePath = path.join(storageDir, 'request_queues', queueId);
  const exists = await fsp.stat(queuePath).catch(() => null);
  if (!exists || !exists.isDirectory()) return [];

  const requestFiles = await readRequestQueueFiles(queuePath);
  const ids = requestFiles.map((f) => f.replace(/\.json$/, ''));
  ids.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  return ids;
}

/**
 * Read a single request by ID.
 */
export async function readRequest(
  storageDir: string,
  queueId: string,
  requestId: string
): Promise<object | null> {
  const filePath = path.join(storageDir, 'request_queues', queueId, `${requestId}.json`);
  try {
    const content = await fsp.readFile(filePath, 'utf-8');
    return JSON.parse(content) as object;
  } catch {
    return null;
  }
}

/**
 * Get a page of requests from a queue.
 */
export async function getRequestsPage(
  storageDir: string,
  queueId: string,
  offset: number,
  limit: number
): Promise<{ id: string; data: object }[]> {
  const ids = await listRequestIds(storageDir, queueId);
  const pageIds = ids.slice(offset, offset + limit);
  const result: { id: string; data: object }[] = [];

  for (const id of pageIds) {
    const data = await readRequest(storageDir, queueId, id);
    if (data !== null) result.push({ id, data });
  }

  return result;
}

export type RequestFilterFn = (entry: { id: string; data: object }) => boolean;

export interface RequestsPageResult {
  entries: { id: string; data: object }[];
  totalCount: number;
}

/**
 * Get a page of requests with optional sort and filter.
 */
export async function getRequestsPageWithSort(
  storageDir: string,
  queueId: string,
  offset: number,
  limit: number,
  sortSpec: SortSpec[],
  filterFn?: RequestFilterFn
): Promise<RequestsPageResult> {
  const ids = await listRequestIds(storageDir, queueId);
  let allEntries: { id: string; data: object }[] = [];

  for (const id of ids) {
    const data = await readRequest(storageDir, queueId, id);
    if (data !== null) allEntries.push({ id, data });
  }

  if (filterFn) {
    allEntries = allEntries.filter(filterFn);
  }

  const totalCount = allEntries.length;

  if (sortSpec.length > 0) {
    allEntries.sort((a, b) => {
      for (const { path: p, dir } of sortSpec) {
        const va = get(a.data, p);
        const vb = get(b.data, p);
        const cmp = compareValues(va, vb);
        if (cmp !== 0) return dir === 'asc' ? cmp : -cmp;
      }
      return 0;
    });
  }

  const entries = allEntries.slice(offset, offset + limit);
  return { entries, totalCount };
}
