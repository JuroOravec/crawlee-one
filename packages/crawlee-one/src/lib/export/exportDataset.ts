import fsp from 'node:fs/promises';
import path from 'node:path';

import type { CrawleeOneIO } from '../integrations/types.js';
import { apifyIO } from '../integrations/apify.js';
import { applyFieldFilter } from './fieldFilter.js';
import { flattenForCsv } from './flattenForCsv.js';
import { rowToCsv } from './csvStringify.js';

const FETCH_BATCH_SIZE = 500;

/**
 * Options for the programmatic export API.
 * All types are "clean" — no string parsing; pass parsed/typed values.
 */
export interface ExportOptions {
  /** Dataset ID to export. */
  datasetId: string;
  /** Output format. */
  format: 'json' | 'csv';
  /** Output file path. Defaults to `storage/exports/{datasetId}.{format}` when omitted. */
  outputPath: string;
  /** Fields to include (dot notation, e.g. nested.prop). */
  fields?: string[];
  /** Fields to exclude. */
  fieldsOmit?: string[];
  /** Max size per file in bytes (splits into multiple files when exceeded). */
  maxSizeBytes?: number;
  /** Max entries per file (splits into multiple files when exceeded). */
  maxEntries?: number;
  /** IO for opening the dataset. Defaults to Crawlee local/cloud storage. */
  io?: CrawleeOneIO;
}

export interface ExportResult {
  filesWritten: string[];
  totalEntries: number;
}

/**
 * Export a dataset to JSON or CSV files.
 *
 * **Formats:** JSON (compact) or CSV (RFC 4180). CSV flattens nested objects with
 * dot notation and serializes arrays as JSON strings (no `data[0].name` columns).
 *
 * **Field filtering:** Use `fields` to include only specific fields (dot notation
 * for nested), or `fieldsOmit` to exclude fields.
 *
 * **Splitting:** Optionally split output into multiple files via `maxEntries` or
 * `maxSizeBytes`. Single file → `base.json`; multiple parts → `base-0.json`,
 * `base-1.json`, etc.
 *
 * **Empty dataset:** Returns `{ filesWritten: [], totalEntries: 0 }` without
 * writing files.
 */
export async function exportDataset(options: ExportOptions): Promise<ExportResult> {
  const {
    datasetId,
    format,
    outputPath,
    fields,
    fieldsOmit,
    maxSizeBytes,
    maxEntries,
    io = apifyIO,
  } = options;

  const dataset = await io.openDataset(datasetId);
  const totalCount = await dataset.getItemCount();

  if (totalCount === 0 || totalCount === null) {
    return { filesWritten: [], totalEntries: 0 };
  }

  const pickPaths = fields?.length ? fields : undefined;
  const omitPaths = fieldsOmit?.length ? fieldsOmit : undefined;

  const { dir, baseNoExt, ext } = resolveOutputPath(outputPath, format);
  await fsp.mkdir(dir, { recursive: true });

  const filesWritten: string[] = [];
  let totalExported = 0;
  let partIndex = 0;
  let batch: object[] = [];
  let batchSizeBytes = 0;
  let csvHeaders: string[] | null = null;
  let firstFileWritten = false;

  let offset = 0;
  const effectiveMaxEntries =
    maxEntries != null && Number.isFinite(maxEntries) && maxEntries > 0 ? maxEntries : undefined;
  const effectiveMaxSize =
    maxSizeBytes != null && Number.isFinite(maxSizeBytes) && maxSizeBytes > 0
      ? maxSizeBytes
      : undefined;
  const hasLimit = effectiveMaxEntries != null || effectiveMaxSize != null;

  while (offset < totalCount) {
    const limit = Math.min(FETCH_BATCH_SIZE, totalCount - offset);
    const items = await dataset.getItems({ offset, limit });
    offset += items.length;

    const isLastBatch = offset >= totalCount;
    for (let i = 0; i < items.length; i++) {
      const item = items[i] as object;
      const isLastItemInBatch = i === items.length - 1;

      const filtered = applyFieldFilter(item, pickPaths, omitPaths);

      if (format === 'json') {
        batch.push(filtered);
        batchSizeBytes += JSON.stringify(filtered).length + 2;
      } else {
        const flat = flattenForCsv(filtered as Record<string, unknown>);
        if (csvHeaders === null) {
          csvHeaders = [...Object.keys(flat)];
        } else {
          for (const k of Object.keys(flat)) {
            if (!csvHeaders.includes(k)) csvHeaders.push(k);
          }
        }
        batch.push(flat);
        batchSizeBytes += rowToCsv(flat, csvHeaders).length + 1;
      }

      totalExported++;

      const effectiveMaxEntriesVal = effectiveMaxEntries ?? Infinity;
      const effectiveMaxSizeVal = effectiveMaxSize ?? Infinity;
      const shouldFlush =
        hasLimit &&
        (batch.length >= effectiveMaxEntriesVal || batchSizeBytes >= effectiveMaxSizeVal);
      const isEndOfDataset = isLastBatch && isLastItemInBatch;

      if (shouldFlush || isEndOfDataset) {
        const writeNow = batch.length > 0;
        if (writeNow) {
          const willBeOnlyFile = writeNow && isEndOfDataset && !firstFileWritten;
          const partId = willBeOnlyFile ? null : partIndex;

          const filePath = formatPartPath(dir, baseNoExt, ext, partId);
          const content =
            format === 'json'
              ? JSON.stringify(batch, null, 0)
              : [
                  csvHeaders!.join(','),
                  ...(batch as Record<string, string | number | boolean | null>[]).map((r) =>
                    rowToCsv(r, csvHeaders!)
                  ),
                ].join('\n');

          await fsp.writeFile(filePath, content, 'utf-8');
          filesWritten.push(filePath);
          firstFileWritten = true;
          partIndex++;
        }
        batch = [];
        batchSizeBytes = 0;
      }
    }
  }

  // Flush any remaining batch (e.g. when last fetch returned 0 items)
  if (batch.length > 0) {
    const willBeOnlyFile = !firstFileWritten;
    const partId = willBeOnlyFile ? null : partIndex;
    const filePath = formatPartPath(dir, baseNoExt, ext, partId);
    const content =
      format === 'json'
        ? JSON.stringify(batch, null, 0)
        : [
            csvHeaders!.join(','),
            ...(batch as Record<string, string | number | boolean | null>[]).map((r) =>
              rowToCsv(r, csvHeaders!)
            ),
          ].join('\n');
    await fsp.writeFile(filePath, content, 'utf-8');
    filesWritten.push(filePath);
  }

  return { filesWritten, totalEntries: totalExported };
}

export interface ResolveExportOutputOptions {
  datasetId: string;
  format: 'json' | 'csv';
  outputOverride?: string;
}

/**
 * Resolve the export output path. Default: storage/exports/{dataset}.{format}
 */
export function resolveExportOutputPath(options: ResolveExportOutputOptions): string {
  const { datasetId, format, outputOverride } = options;
  if (outputOverride) {
    return path.resolve(outputOverride);
  }
  const storageDir = getStorageDir();
  const ext = format === 'json' ? '.json' : '.csv';
  return path.join(storageDir, 'exports', `${datasetId}${ext}`);
}

function getStorageDir(): string {
  const baseDir = process.cwd();
  return process.env.APIFY_LOCAL_STORAGE_DIR
    ? path.resolve(process.env.APIFY_LOCAL_STORAGE_DIR)
    : path.join(baseDir, 'storage');
}

/**
 * Resolve output path and extension.
 * Returns { dir, baseNoExt, ext } so we can build base-N.ext for parts.
 */
function resolveOutputPath(
  outputPath: string,
  format: 'json' | 'csv'
): { dir: string; baseNoExt: string; ext: string } {
  const ext = format === 'json' ? '.json' : '.csv';
  const resolved = path.resolve(outputPath);
  const dir = path.dirname(resolved);
  const basename = path.basename(resolved);
  const extMatch = basename.match(/\.(json|csv)$/i);
  const baseNoExt = extMatch ? basename.slice(0, -extMatch[0].length) : basename;
  return { dir, baseNoExt, ext };
}

function formatPartPath(
  dir: string,
  baseNoExt: string,
  ext: string,
  partIndex: number | null
): string {
  const filename = partIndex !== null ? `${baseNoExt}-${partIndex}${ext}` : `${baseNoExt}${ext}`;
  return path.join(dir, filename);
}
