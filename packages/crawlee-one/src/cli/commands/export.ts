import path from 'node:path';

import { Command } from 'commander';

import { parseFieldList } from '../../lib/export/fieldFilter.js';
import { parseSize } from '../../lib/export/parseSize.js';
import { runExport } from '../../lib/export/runExport.js';

export function createExportCommand(): Command {
  return new Command('export')
    .argument('<dataset>', 'dataset ID to export')
    .description(
      'Export dataset to JSON or CSV. Output goes to storage/exports/{dataset}.{format} by default.'
    )
    .option('-f --format <format>', 'output format: json or csv', 'json')
    .option('-o --output <path>', 'output file path (default: storage/exports/{dataset}.{format})')
    .option(
      '--fields <list>',
      'comma-separated fields to include (dot notation for nested, e.g. nested.prop)'
    )
    .option('--fields-omit <list>', 'comma-separated fields to exclude')
    .option('--max-size <size>', 'max size per file (e.g. 30MB, 4GB)')
    .option('--max-entries <n>', 'max entries per file', (v) =>
      v != null ? parseInt(v, 10) : undefined
    )
    .addHelpText(
      'after',
      `
Examples:
  $ crawlee-one export dev-profesia-partners
  $ crawlee-one export dev-profesia-partners -f csv
  $ crawlee-one export dev-profesia-partners --fields name,id,nested.prop
  $ crawlee-one export dev-profesia-partners --fields-omit attempts --max-entries 1000
  $ crawlee-one export dev-profesia-partners -o ./out.json
`
    )
    .action(
      async (
        datasetId: string,
        opts: {
          format?: string;
          output?: string;
          fields?: string;
          fieldsOmit?: string;
          maxSize?: string;
          maxEntries?: number;
        }
      ) => {
        const format = (opts.format?.toLowerCase() ?? 'json') as 'json' | 'csv';
        if (format !== 'json' && format !== 'csv') {
          console.error('Format must be "json" or "csv".');
          process.exit(1);
        }
        try {
          await runExportCommand({
            datasetId,
            format,
            output: opts.output,
            fields: opts.fields,
            fieldsOmit: opts.fieldsOmit,
            maxSize: opts.maxSize,
            maxEntries: opts.maxEntries,
          });
        } catch (err) {
          console.error(err instanceof Error ? err.message : err);
          process.exit(1);
        }
      }
    );
}

interface ExportCommandOptions {
  datasetId: string;
  format: 'json' | 'csv';
  output?: string;
  fields?: string;
  fieldsOmit?: string;
  maxSize?: string;
  maxEntries?: number;
}

/**
 * Export a dataset to JSON or CSV.
 * Parses CLI string inputs and delegates to runExport.
 *
 * @example Via CLI
 * ```bash
 * crawlee-one export dev-profesia-partners
 * crawlee-one export dev-profesia-partners -f csv
 * crawlee-one export dev-profesia-partners --fields name,id,nested.prop
 * crawlee-one export dev-profesia-partners --fields-omit attempts --max-entries 1000
 * crawlee-one export dev-profesia-partners --max-size 30MB
 * crawlee-one export dev-profesia-partners -o ./out/export.json
 * ```
 */
async function runExportCommand(options: ExportCommandOptions): Promise<void> {
  const { datasetId, format, output, fields, fieldsOmit, maxSize, maxEntries } = options;

  const maxSizeBytes = parseSize(maxSize ?? '') ?? undefined;
  const fieldsList = parseFieldList(fields);
  const fieldsOmitList = parseFieldList(fieldsOmit);

  const storageDir = getStorageDir();
  const prevStorage = process.env.APIFY_LOCAL_STORAGE_DIR;
  if (!process.env.APIFY_LOCAL_STORAGE_DIR) {
    process.env.APIFY_LOCAL_STORAGE_DIR = storageDir;
  }

  try {
    const result = await runExport({
      datasetId,
      format,
      output,
      fields: fieldsList.length ? fieldsList : undefined,
      fieldsOmit: fieldsOmitList.length ? fieldsOmitList : undefined,
      maxSizeBytes,
      maxEntries,
    });

    if (result.totalEntries === 0) {
      console.log(`Dataset "${datasetId}" is empty. Nothing to export.`);
      return;
    }

    for (const file of result.filesWritten) {
      console.log(`Exported to ${file}`);
    }
    console.log(`Total entries: ${result.totalEntries}`);
  } finally {
    if (prevStorage !== undefined) {
      process.env.APIFY_LOCAL_STORAGE_DIR = prevStorage;
    } else {
      delete process.env.APIFY_LOCAL_STORAGE_DIR;
    }
  }
}

function getStorageDir(): string {
  const baseDir = process.cwd();
  return process.env.APIFY_LOCAL_STORAGE_DIR
    ? path.resolve(process.env.APIFY_LOCAL_STORAGE_DIR)
    : path.join(baseDir, 'storage');
}
