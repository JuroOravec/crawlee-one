import path from 'node:path';

import { Command } from 'commander';

import { getCrawlersToProcess, loadCrawlerModule } from '../../lib/config/loader.js';
import { clearDevStorage } from '../../lib/dev/clearDevStorage.js';
import { runDev } from '../../lib/dev/runDev.js';

export function createDevCommand(): Command {
  return new Command('dev')
    .argument('[crawlers...]', 'crawler names to run (empty = all from config)')
    .description(
      'Local development: run crawler with dev queue (caches responses). Use --fetch to pre-populate cache only; without --fetch, runs with real handlers.'
    )
    .option(
      '--fetch',
      'Pre-fetch sample URLs into dev queue (no-op handlers). Run without --fetch to process cached HTML with real handlers.'
    )
    .option(
      '--clear',
      'Remove dev-{crawler}-* datasets and dev-{crawler} request queue before running. Use to reset cache and queue state.'
    )
    .option('--strict', 'Throw when a URL matches no route instead of logging and skipping.')
    .option('-c --config [config-file]', 'path to config file')
    .addHelpText(
      'after',
      `
Examples:
  $ crawlee-one dev                      # run all crawlers with real handlers, cache responses
  $ crawlee-one dev profesia another      # run only profesia and another
  $ crawlee-one dev -c ./crawlee-one.config.ts
  $ crawlee-one dev --fetch              # pre-fetch sample URLs for all crawlers (populate cache only)
  $ crawlee-one dev --fetch profesia     # pre-fetch for profesia only
  $ crawlee-one dev --clear              # clear dev cache/queue, then run
  $ crawlee-one dev --strict             # throw when URL matches no route
  $ crawlee-one dev --fetch -c path/to/config.ts
`
    )
    .action(
      async (
        crawlerNames: string[] = [],
        opts: { fetch?: boolean; clear?: boolean; strict?: boolean; config?: string }
      ) => {
        try {
          await runDevCommand({
            crawlerNames,
            configFilePath: opts.config,
            fetchOnly: opts.fetch ?? false,
            clear: opts.clear ?? false,
            strict: opts.strict ?? false,
          });
        } catch (err) {
          console.error(err instanceof Error ? err.message : err);
          process.exit(1);
        }
      }
    );
}

/** Options for runDevCommand */
interface RunDevCommandOpts {
  crawlerNames: string[];
  configFilePath?: string;
  fetchOnly?: boolean;
  clear?: boolean;
  strict?: boolean;
}

/**
 * Run crawlers with a dev RequestQueue that caches responses.
 *
 * **Opts:**
 * - `crawlerNames` — Names of crawlers to run. Empty = all from config.
 * - `configFilePath` — Path to config file (default: cosmiconfig resolution).
 * - `fetchOnly` — If true, only populate cache; don't run handlers.
 * - `clear` — If true, remove dev datasets and request queue before running.
 * - `strict` — If true, throw when a URL matches no route (default: log and skip).
 *
 * **Usage (via CLI):**
 * ```sh
 * npx crawlee-one dev                      # all crawlers, real handlers
 * npx crawlee-one dev profesia another      # specific crawlers only
 * npx crawlee-one dev --fetch               # pre-fetch for all crawlers
 * npx crawlee-one dev --fetch profesia      # pre-fetch for one crawler
 * npx crawlee-one dev --strict              # throw on unmatched URLs
 * npx crawlee-one dev -c ./crawlee-one.config.ts
 * ```
 */
async function runDevCommand(opts: RunDevCommandOpts): Promise<void> {
  const { crawlerNames, configFilePath, fetchOnly = false, clear = false, strict = false } = opts;
  const { configDir, crawlers } = await getCrawlersToProcess(crawlerNames, configFilePath);

  const prevStorageDir = process.env.APIFY_LOCAL_STORAGE_DIR;
  if (configDir && !process.env.APIFY_LOCAL_STORAGE_DIR) {
    process.env.APIFY_LOCAL_STORAGE_DIR = path.join(configDir, 'storage');
  }

  const storageDir = configDir
    ? path.join(configDir, 'storage')
    : process.env.APIFY_LOCAL_STORAGE_DIR
      ? path.resolve(process.env.APIFY_LOCAL_STORAGE_DIR)
      : path.join(process.cwd(), 'storage');

  try {
    if (clear && crawlers.length > 0) {
      clearDevStorage(
        storageDir,
        crawlers.map((c) => c.name)
      );
    }

    for (const { name: crawlerName, def: crawlerDef } of crawlers) {
      const importPath = crawlerDef.devImportPath ?? crawlerDef.importPath;
      if (!importPath) {
        throw new Error(
          `Crawler "${crawlerName}" is missing importPath (or devImportPath). Add importPath to crawlee-one.config.ts schema.crawlers.${crawlerName} to enable dev.`
        );
      }

      const run = await loadCrawlerModule(configDir, importPath);

      console.log(
        fetchOnly ? `Fetching crawler: ${crawlerName}` : `Running crawler: ${crawlerName}`
      );
      await runDev({
        crawlerName,
        run,
        crawlerType: crawlerDef.type,
        configDir,
        devInput: crawlerDef.devInput,
        fetchOnly,
        strict,
      });
    }
  } finally {
    if (prevStorageDir !== undefined) {
      process.env.APIFY_LOCAL_STORAGE_DIR = prevStorageDir;
    } else {
      delete process.env.APIFY_LOCAL_STORAGE_DIR;
    }
  }
}
