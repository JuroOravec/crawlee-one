/**
 * Shared logic for loading crawler modules from config.
 * Used by run, dev, and other commands that need to import crawler code.
 *
 * - .ts files: loaded with jiti
 * - .js files: loaded via dynamic import
 */

import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { createJiti } from 'jiti';

import { loadConfig } from './config.js';
import type { CrawleeOneConfigRun, CrawleeOneConfigSchemaCrawler } from './types.js';

/**
 * Load the crawler module at the given path (relative to configDir).
 * Use devImportPath for .ts source (no build); importPath for built .js output.
 *
 * Extracts and validates the default export. The module **must** have a default
 * export: the run function with shape `CrawleeOneConfigRun`.
 */
export async function loadCrawlerModule(
  configDir: string,
  importPath: string
): Promise<CrawleeOneConfigRun> {
  const resolvedPath = path.resolve(configDir, importPath);
  const isSource = resolvedPath.endsWith('.ts');
  const module_ = isSource
    ? await createJiti(import.meta.url, { interopDefault: true }).import(resolvedPath)
    : await import(pathToFileURL(resolvedPath).href);

  const m = module_ as { default?: CrawleeOneConfigRun };
  const run = typeof m.default === 'function' ? m.default : undefined;
  if (typeof run !== 'function') {
    throw new Error(
      `Module at ${importPath} must export a default function. Got: ${typeof m.default}`
    );
  }
  return run;
}

export interface LoadCrawlerContext {
  config: NonNullable<Awaited<ReturnType<typeof loadConfig>>>;
  configDir: string;
  crawlerName: string;
  crawlerDef: CrawleeOneConfigSchemaCrawler;
  importPath: string;
}

export interface CrawlersToProcess {
  config: NonNullable<Awaited<ReturnType<typeof loadConfig>>>;
  configDir: string;
  crawlers: Array<{ name: string; def: CrawleeOneConfigSchemaCrawler }>;
}

/**
 * Load config and resolve which crawlers to process.
 * When crawlerNames is empty, uses all crawlers. Otherwise validates each name exists.
 */
export async function getCrawlersToProcess(
  crawlerNames: string[],
  configFilePath?: string
): Promise<CrawlersToProcess> {
  const config = await loadConfig(configFilePath);
  if (!config?.schema?.crawlers) {
    throw new Error('No crawlee-one config found. Create a crawlee-one.config.ts file.');
  }

  const allCrawlerNames = Object.keys(config.schema.crawlers);
  const selected =
    crawlerNames.length > 0
      ? crawlerNames.filter((name) => {
          if (!allCrawlerNames.includes(name)) {
            throw new Error(
              `Crawler "${name}" not found in config.schema.crawlers. Available: ${allCrawlerNames.join(', ')}`
            );
          }
          return true;
        })
      : allCrawlerNames;

  const configDir = configFilePath ? path.dirname(path.resolve(configFilePath)) : process.cwd();

  return {
    config,
    configDir,
    crawlers: selected.map((name) => ({
      name,
      def: config.schema.crawlers[name]!,
    })),
  };
}

/** Options for getCrawlerContext */
export interface GetCrawlerContextOpts {
  crawlerName: string;
  configFilePath?: string;
  commandName?: string;
}

/**
 * Load config, validate crawler exists, and return context for loading the module.
 * Throws if config is missing, crawler not found, or importPath/devImportPath is missing.
 */
export async function getCrawlerContext(opts: GetCrawlerContextOpts): Promise<LoadCrawlerContext> {
  const { crawlerName, configFilePath, commandName = 'run' } = opts;
  const { config, configDir, crawlers } = await getCrawlersToProcess([crawlerName], configFilePath);
  const { name, def } = crawlers[0]!;

  if (!def.importPath && !def.devImportPath) {
    throw new Error(
      `Crawler "${name}" is missing importPath (or devImportPath). Add importPath to crawlee-one.config.ts schema.crawlers.${name} to enable ${commandName}.`
    );
  }

  return {
    config,
    configDir,
    crawlerName: name,
    crawlerDef: def,
    // Effective import path for dev/run: prefers devImportPath (no build needed),
    // otherwise uses importPath. Pass to loadCrawlerModule which handles resolution.
    importPath: def.devImportPath ?? def.importPath!,
  };
}
