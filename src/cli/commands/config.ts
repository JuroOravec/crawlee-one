import { cosmiconfig } from 'cosmiconfig';
import Joi from 'joi';

import { getPackageJsonInfo } from '../../utils/package';
import type {
  CrawleeOneConfig,
  CrawleeOneConfigSchema,
  CrawleeOneConfigSchemaCrawler,
} from '../../types/config';
import { CRAWLER_TYPE } from '../../types';

/** Pattern for a valid JS variable */
const varNamePattern = /^[a-z_][a-z0-9_]*$/i;

const configSchemaCrawlerJoiSchema = Joi.object({
  type: Joi.string().allow(...CRAWLER_TYPE).required(),
  routes: Joi.array().items(Joi.string().required()).required(),
} satisfies Record<keyof CrawleeOneConfigSchemaCrawler, Joi.Schema>)
  .required().unknown(false); // prettier-ignore

const configSchemaJoiSchema = Joi.object({
  crawlers: Joi.object()
    .pattern(Joi.string().pattern(varNamePattern), configSchemaCrawlerJoiSchema)
    .required().unknown(false),
} satisfies Record<keyof CrawleeOneConfigSchema, Joi.Schema>)
  .required().unknown(false); // prettier-ignore

const configJoiSchema = Joi.object({
  version: Joi.number().allow(1).required(),
  schema: configSchemaJoiSchema,
} satisfies Record<keyof CrawleeOneConfig, Joi.Schema>)
  .required().unknown(false); // prettier-ignore

/**
 * Validate given CrawleeOne config.
 *
 * Config can be passed directly, or you can specify the path to the config file.
 * For the latter, the config will be loaded using {@link loadConfig}.
 */
export const validateConfig = (config: unknown | string) => {
  Joi.assert(config, configJoiSchema);
};

/**
 * Load CrawleeOne config file. Config will be searched for using CosmicConfig.
 *
 * Optionally, you can supply path to the config file.
 *
 * Learn more: https://github.com/cosmiconfig/cosmiconfig
 */
export const loadConfig = async (configFilePath?: string) => {
  const pkgJson = getPackageJsonInfo(module, ['name']);

  // See https://github.com/cosmiconfig/cosmiconfig#usage-for-tooling-developers
  const explorer = cosmiconfig(pkgJson.name);
  const result = configFilePath ? await explorer.load(configFilePath) : await explorer.search();
  const config = (result?.config ?? null) as CrawleeOneConfig | null;
  return config;
};
