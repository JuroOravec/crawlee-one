import { cosmiconfig } from 'cosmiconfig';
import { z } from 'zod';

import { getPackageJsonInfo } from '../../utils/package.js';
import type {
  CrawleeOneConfig,
  CrawleeOneConfigSchema,
  CrawleeOneConfigSchemaCrawler,
} from '../../types/config.js';
import { CRAWLER_TYPE } from '../../types/index.js';

/** Pattern for a valid JS variable */
const varNamePattern = /^[a-z_][a-z0-9_]*$/i;

const configSchemaCrawlerSchema = z
  .object({
    type: z.enum(CRAWLER_TYPE),
    routes: z.array(z.string()).min(1),
  } satisfies Record<keyof CrawleeOneConfigSchemaCrawler, z.ZodType>)
  .strict();

const configSchemaSchema = z
  .object({
    crawlers: z.record(z.string().regex(varNamePattern), configSchemaCrawlerSchema),
  } satisfies Record<keyof CrawleeOneConfigSchema, z.ZodType>)
  .strict();

const configSchema = z
  .object({
    version: z.literal(1),
    schema: configSchemaSchema,
  } satisfies Record<keyof CrawleeOneConfig, z.ZodType>)
  .strict();

/**
 * Validate given CrawleeOne config.
 *
 * Config can be passed directly, or you can specify the path to the config file.
 * For the latter, the config will be loaded using {@link loadConfig}.
 */
export const validateConfig = (config: unknown | string) => {
  configSchema.parse(config);
};

/**
 * Load CrawleeOne config file. Config will be searched for using CosmicConfig.
 *
 * Optionally, you can supply path to the config file.
 *
 * Learn more: https://github.com/cosmiconfig/cosmiconfig
 */
export const loadConfig = async (configFilePath?: string) => {
  const pkgJson = getPackageJsonInfo(import.meta.url, ['name']);

  // See https://github.com/cosmiconfig/cosmiconfig#usage-for-tooling-developers
  const explorer = cosmiconfig(pkgJson.name);
  const result = configFilePath ? await explorer.load(configFilePath) : await explorer.search();
  const config = (result?.config ?? null) as CrawleeOneConfig | null;
  return config;
};
