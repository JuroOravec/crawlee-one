import path from 'node:path';

import { Command } from 'commander';

import { startPreviewServer } from '../../lib/preview/server.js';
import { getStorageDir } from '../../lib/preview/storage.js';

export function createPreviewCommand(): Command {
  return new Command('preview')
    .description(
      'Start a local web server to preview scraped datasets. Serves datasets from storage/datasets (or APIFY_LOCAL_STORAGE_DIR).'
    )
    .option('-p --port <port>', 'port to listen on', (v) => parseInt(v, 10) || 3000, 3000)
    .option('-c --config-dir <dir>', 'directory containing crawlee-one config (uses its storage/)')
    .addHelpText(
      'after',
      `
Examples:
  $ crawlee-one preview
  $ crawlee-one preview -p 3000
  $ crawlee-one preview -c ./scrapers/my-scraper
  $ APIFY_LOCAL_STORAGE_DIR=./storage crawlee-one preview
`
    )
    .action(async (opts: { port?: number; configDir?: string }) => {
      try {
        await runPreviewCommand(opts);
      } catch (err) {
        console.error(err instanceof Error ? err.message : err);
        process.exit(1);
      }
    });
}

async function runPreviewCommand(opts: { port?: number; configDir?: string }): Promise<void> {
  if (opts.configDir) {
    process.env.APIFY_LOCAL_STORAGE_DIR = path.join(path.resolve(opts.configDir), 'storage');
  } else if (!process.env.APIFY_LOCAL_STORAGE_DIR) {
    process.env.APIFY_LOCAL_STORAGE_DIR = path.join(process.cwd(), 'storage');
  }

  const storageDir = getStorageDir();

  const { url } = await startPreviewServer({
    storageDir,
    port: opts.port ?? 3000,
  });

  console.log(`Preview server running at ${url}`);
  console.log(`Open ${url}/datasets in your browser to view datasets.`);
  console.log('Press Ctrl+C to stop.');
}
