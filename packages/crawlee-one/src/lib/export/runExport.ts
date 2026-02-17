import {
  exportDataset,
  resolveExportOutputPath,
  type ExportOptions as _ExportOptions,
  type ExportResult,
} from './exportDataset.js';
import { openDatasetForExport } from './exportIo.js';

export type { ExportResult };

/**
 * Options for the programmatic export API.
 * All types are "clean" — no string parsing; pass parsed/typed values.
 */
export interface ExportOptions extends Omit<_ExportOptions, 'outputPath'> {
  /** Output file path. Defaults to storage/exports/{datasetId}.{format} when omitted. */
  output?: string;
}

/**
 * Export a dataset to JSON or CSV files.
 *
 * Programmatic API with typed options. For CLI usage, the command parses
 * string inputs (e.g. `parseSize`, `parseFieldList`) and calls this function.
 *
 * **Formats:** JSON (compact) or CSV (RFC 4180, flattened).
 * **Splitting:** Use `maxSizeBytes` or `maxEntries` to split into multiple files.
 */
export async function runExport(options: ExportOptions): Promise<ExportResult> {
  const {
    datasetId,
    format,
    output,
    fields,
    fieldsOmit,
    maxSizeBytes,
    maxEntries,
    io = {
      openDataset: (id) => openDatasetForExport(id ?? datasetId),
    },
  } = options;

  const outputPath = resolveExportOutputPath({
    datasetId,
    format,
    outputOverride: output,
  });

  return exportDataset({
    datasetId,
    format,
    outputPath,
    fields: fields?.length ? fields : undefined,
    fieldsOmit: fieldsOmit?.length ? fieldsOmit : undefined,
    maxSizeBytes,
    maxEntries,
    io: io as any,
  });
}
