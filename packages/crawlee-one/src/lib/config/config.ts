import { cosmiconfig } from 'cosmiconfig';
import { createJiti } from 'jiti';
import { z } from 'zod';

import { CRAWLER_TYPE } from '../../types.js';
import { getPackageJsonInfo } from '../../utils/package.js';
import type { LlmModelCompareConfig } from '../llmCompare/types.js';
import type {
  CrawleeOneConfig,
  CrawleeOneConfigActor,
  CrawleeOneConfigActorSpec,
  CrawleeOneConfigGenerate,
  CrawleeOneConfigReadme,
  CrawleeOneConfigSchema,
  CrawleeOneConfigSchemaCrawler,
  CrawleeOneConfigTypes,
  LlmCompareReportDefinition,
} from './types.js';

/** Pattern for a valid JS variable */
const varNamePattern = /^[a-z_][a-z0-9_]*$/i;

const configSchemaCrawlerSchema = z
  .object({
    type: z.enum(CRAWLER_TYPE),
    routes: z.array(z.string()).min(1),
    importPath: z.string().optional(),
    devImportPath: z.string().optional(),
    devInput: z.record(z.unknown()).optional(),
    input: z.record(z.unknown()).optional(),
  } satisfies Record<keyof CrawleeOneConfigSchemaCrawler, z.ZodType>)
  .strict();

const configSchemaSchema = z
  .object({
    crawlers: z.record(z.string().regex(varNamePattern), configSchemaCrawlerSchema),
  } satisfies Record<keyof CrawleeOneConfigSchema, z.ZodType>)
  .strict();

const configTypesSchema = z
  .object({
    outFile: z.string().min(1),
  } satisfies Record<keyof CrawleeOneConfigTypes, z.ZodType>)
  .strict();

const configActorSchema = z
  .object({
    config: z.record(z.string(), z.any()),
    outFile: z.string().min(1).optional(),
  } satisfies Record<keyof CrawleeOneConfigActor, z.ZodType>)
  .strict();

const configActorSpecSchema = z
  .object({
    outFile: z.string().min(1).optional(),
  } satisfies Record<keyof CrawleeOneConfigActorSpec, z.ZodType>)
  .strict();

const configReadmeSchema = z
  .object({
    outFile: z.string().min(1).optional(),
    renderer: z.function().optional(),
    input: z.any().optional(),
  } satisfies Record<keyof CrawleeOneConfigReadme, z.ZodType>)
  .strict();

const configGenerateSchema = z
  .object({
    types: configTypesSchema.optional(),
    actor: configActorSchema.optional(),
    actorspec: configActorSpecSchema.optional(),
    readme: configReadmeSchema.optional(),
  } satisfies Record<keyof CrawleeOneConfigGenerate, z.ZodType>)
  .strict();

const llmModelConfigSchema = z
  .object({
    id: z.string().min(1),
    provider: z.string().min(1),
    model: z.string().min(1),
    apiKey: z.string().optional(), // CLI fills from env at runtime when missing
    baseUrl: z.string().optional(),
    headers: z.record(z.string(), z.string()).optional(),
    label: z.string().optional(),
    priceInputPer1MToken: z.number().optional(),
    priceOutputPer1MToken: z.number().optional(),
  } satisfies Record<keyof LlmModelCompareConfig, z.ZodType>)
  .strict();

const llmCompareReportUrlSchema = z.union([
  z.string().min(1),
  z.record(z.string(), z.unknown()), // RequestOptions-like, no field validation
]);

const llmCompareReportSchema = z
  .object({
    models: z.array(llmModelConfigSchema).min(1),
    referenceModel: z.string().min(1),
    urls: z.array(llmCompareReportUrlSchema).min(1),
    schema: z.unknown(),
    systemPrompt: z.string().min(1),
  } satisfies Record<keyof LlmCompareReportDefinition, z.ZodType>)
  .strict();

const llmCompareReportsSchema = z.record(z.string().regex(varNamePattern), llmCompareReportSchema);

const configSchema = z
  .object({
    version: z.literal(1),
    schema: configSchemaSchema,
    metadata: z.any().optional(),
    generate: configGenerateSchema.optional(),
    llm: z
      .object({
        compare: z
          .object({
            reports: llmCompareReportsSchema.optional(),
          })
          .optional(),
      })
      .optional(),
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
 * Custom TS loader using jiti so that config files in ESM projects (with
 * `"type": "module"`) are loaded correctly. Cosmiconfig's built-in TS loader
 * transpiles to a temp `.mjs` file and then tries `import()` / `require()`,
 * which breaks on Node 23+ when the transpiled file contains TS-convention
 * import paths (e.g. `./foo.js` pointing at `./foo.ts`).
 */
const loadTsWithJiti = async (filepath: string) => {
  const jiti = createJiti(import.meta.url, { interopDefault: true });
  const loaded = await jiti.import(filepath);
  // If config is a default export, unwrap it so cosmiconfig gets the config
  if (loaded != null && typeof loaded === 'object' && 'default' in loaded) {
    return (loaded as { default: unknown }).default;
  } else {
    return loaded;
  }
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
  const explorer = cosmiconfig(pkgJson.name, {
    loaders: {
      '.ts': loadTsWithJiti,
    },
  });
  const result = configFilePath ? await explorer.load(configFilePath) : await explorer.search();
  const config = (result?.config ?? null) as CrawleeOneConfig | null;
  return config;
};
