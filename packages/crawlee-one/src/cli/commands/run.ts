import { Command } from 'commander';

import { getCrawlerContext, loadCrawlerModule } from '../../lib/config/loader.js';

export function createRunCommand(): Command {
  return new Command('run')
    .argument('<crawler>', 'crawler name as defined in config.schema.crawlers')
    .description('Run the crawler')
    .option('-c --config [config-file]', 'path to config file')
    .addHelpText(
      'after',
      `
Example:
  $ crawlee-one run profesia
  $ crawlee-one run profesia -c ./crawlee-one.config.ts
`
    )
    .action(async (crawlerName: string, opts: { config?: string }) => {
      try {
        await runRunCommand(crawlerName, opts.config);
      } catch (err) {
        console.error(err instanceof Error ? err.message : err);
        process.exit(1);
      }
    });
}

/**
 * Load the crawler module from config and execute its `run` function.
 *
 * Uses input from config (for prod/local testing).
 *
 * @param crawlerName - Name of the crawler as defined in `config.schema.crawlers`.
 * @param configFilePath - Optional path to the config file (e.g. `./crawlee-one.config.ts`).
 *   If omitted, config is resolved via `loadConfig()` (typically `crawlee-one.config.ts` in cwd).
 *
 * @example Via CLI
 * ```bash
 * crawlee-one run profesia
 * crawlee-one run profesia -c ./crawlee-one.config.ts
 * ```
 */
async function runRunCommand(crawlerName: string, configFilePath?: string): Promise<void> {
  const { configDir, importPath, crawlerDef } = await getCrawlerContext(
    crawlerName,
    configFilePath,
    'run'
  );

  const run = await loadCrawlerModule(configDir, importPath);

  await run({ input: crawlerDef.input });
}
