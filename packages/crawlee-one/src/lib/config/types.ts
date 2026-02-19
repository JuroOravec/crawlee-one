import type { ActorSpec } from 'actor-spec';

import type { LlmModelCompareConfig } from '../llmCompare/types.js';
import type { CrawlerMeta, CrawlerType, CrawlerUrl } from '../../types.js';

// ---------------------------------------------------------------------------
// README renderer
// ---------------------------------------------------------------------------

/**
 * A README renderer function.
 *
 * Receives data and returns the rendered README as a string.
 *
 * The renderer does NOT interact with the filesystem -- crawlee-one
 * handles writing the output.
 *
 * @typeParam TInput - Shape of renderer-specific data (opaque to crawlee-one).
 *   Everything the renderer needs beyond `actorSpec` -- templates, helper
 *   functions, etc. -- is passed through this single object.
 */
export type ReadmeRenderer<TInput = unknown> = (args: {
  actorSpec?: ActorSpec;
  input?: TInput;
}) => string | Promise<string>;

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

/** Constraint for the crawlers object: record of crawler name → crawler config. */
export type CrawlersRecord = Record<string, CrawleeOneConfigSchemaCrawler<any>>;

/**
 * Settings for code generation (types, actor.json, actorspec.json, README).
 *
 * All fields are optional. Omitted sections are skipped.
 */
export interface CrawleeOneConfigGenerate<
  TRenderer extends ReadmeRenderer<any> = ReadmeRenderer<any>,
> {
  /** TypeScript type generation. If omitted, generation is skipped. */
  types?: CrawleeOneConfigTypes;
  /** Actor config generation (produces `actor.json`). If omitted, generation is skipped. */
  actor?: CrawleeOneConfigActor;
  /** Actor spec generation (produces `actorspec.json`). If omitted, generation is skipped. */
  actorspec?: CrawleeOneConfigActorSpec;
  /** README generation. If omitted, generation is skipped. */
  readme?: CrawleeOneConfigReadme<TRenderer>;
}

/** LLM compare report definition. Used in crawlee-one.config.ts `llm.compare.reports`. */
export interface LlmCompareReportDefinition {
  /** Model configs to compare */
  models: LlmModelCompareConfig[];
  /** ID of the model whose output is the reference for comparison */
  referenceModel: string;
  /** URLs or RequestOptions to fetch and extract (no function support) */
  urls: CrawlerUrl[];
  /** JSON schema or Zod schema for extraction output */
  schema: unknown;
  /** System prompt for LLM extraction */
  systemPrompt: string;
}

export interface CrawleeOneConfig<
  TCrawlers extends CrawlersRecord = CrawlersRecord,
  TRenderer extends ReadmeRenderer<any> = ReadmeRenderer<any>,
> {
  /** Version of the CrawleeOne config. */
  version: 1;
  /** Schema defining the crawlers in this project. This schema is used for code generation. */
  schema: CrawleeOneConfigSchema<TCrawlers>;
  /** Code generation settings. If omitted, all generation is skipped. */
  generate?: CrawleeOneConfigGenerate<TRenderer>;
  /** LLM-related settings */
  llm?: {
    compare?: {
      /**
       * Reports that compare different models against each other
       *
       * Run with `crawlee-one llm compare`
       */
      reports?: Record<string, LlmCompareReportDefinition>;
    };
  };
}

export interface CrawleeOneConfigTypes {
  /** Output file path for generated TypeScript types (relative to cwd). */
  outFile: string;
}

export interface CrawleeOneConfigActor {
  /**
   * The `ActorConfig` object to serialize.
   */
  config: unknown;
  /**
   * Output file path (relative to cwd).
   *
   * Defaults to `.actor/actor.json` if `.actor/` exists, otherwise `./actor.json`.
   */
  outFile?: string;
}

export interface CrawleeOneConfigActorSpec {
  /**
   * The `ActorSpec` object to serialize.
   */
  config: ActorSpec;
  /**
   * Output file path (relative to cwd).
   *
   * Defaults to `.actor/actorspec.json` if `.actor/` exists, otherwise `./actorspec.json`.
   */
  outFile?: string;
}

export interface CrawleeOneConfigReadme<
  TRenderer extends ReadmeRenderer<any> = ReadmeRenderer<unknown>,
> {
  /**
   * Output file path (relative to cwd).
   *
   * Defaults to `.actor/README.md` if `.actor/` exists, otherwise `./README.md`.
   */
  outFile?: string;
  /** The `ActorSpec` data passed to the renderer. */
  actorSpec?: ActorSpec;
  /**
   * The renderer function that produces the README string.
   *
   * Falls back to `defaultReadmeRenderer` if not provided.
   */
  renderer?: TRenderer;
  /**
   * Renderer-specific data. Shape depends on the renderer.
   *
   * Everything the renderer needs (templates, helper functions, etc.)
   * is passed through this single object.
   */
  input?: TRenderer extends ReadmeRenderer<infer I> ? I : unknown;
}

// ---------------------------------------------------------------------------
// defineCrawler and defineConfig helpers
// ---------------------------------------------------------------------------

/**
 * Type-safe crawler config helper.
 *
 * @typeParam TActorInput - Actor input shape. Use `Partial<ActorInput>` for config overrides.
 *
 * @example
 * ```ts
 * import { defineCrawler } from 'crawlee-one';
 * import type { ActorInput } from './src/config.js';
 *
 * defineCrawler<Partial<ActorInput>>({
 *   type: 'cheerio',
 *   routes: ['main'],
 *   input: { startUrls: [...] }, // typed as Partial<ActorInput>
 *   devInput: { startUrls: [] }, // typed as Partial<ActorInput>
 * });
 * ```
 */
export function defineCrawler<TActorInput extends Record<string, unknown>>(
  config: CrawleeOneConfigSchemaCrawler<Partial<TActorInput>>
): CrawleeOneConfigSchemaCrawler<Partial<TActorInput>> {
  return config;
}

/**
 * Type-safe config helper.
 *
 * Both type params are inferred from the config. Use `defineCrawler<Partial<ActorInput>>()`
 * for each crawler to type `input`/`devInput` per crawler.
 *
 * @typeParam TCrawlers - Inferred from `schema.crawlers`. Use `defineCrawler` for each entry.
 * @typeParam TRenderer - Inferred from `readme.renderer`.
 *
 * @example
 * ```ts
 * import { defineConfig, defineCrawler } from 'crawlee-one';
 * import type { ActorInput } from './src/config.js';
 *
 * export default defineConfig({
 *   version: 1,
 *   schema: {
 *     crawlers: {
 *       profesia: defineCrawler<Partial<ActorInput>>({
 *         type: 'cheerio',
 *         routes: ['main'],
 *         input: { startUrls: [...] },  // typed as Partial<ActorInput>
 *         devInput: { startUrls: [] },  // typed as Partial<ActorInput>
 *       }),
 *       another: defineCrawler<Partial<AnotherActorInput>>({
 *         type: 'playwright',
 *         routes: ['main'],
 *         input: { startUrls: [...] },  // typed as Partial<AnotherActorInput>
 *         devInput: { startUrls: [] },  // typed as Partial<AnotherActorInput>
 *       }),
 *     },
 *   },
 *   generate: {
 *     types: { outFile: './src/__generated__/crawler.ts' },
 *     actor: { config: actorConfig, outFile: '.actor/actor.json' },
 *     actorspec: { config: actorSpec, outFile: '.actor/actorspec.json' },
 *     readme: {
 *       outFile: '.actor/README.md',
 *       actorSpec,
 *       renderer: renderApifyReadme,
 *       input: { templates: ... },
 *     },
 *   },
 * });
 * ```
 */
export function defineConfig<
  TCrawlers extends CrawlersRecord,
  TRenderer extends ReadmeRenderer<any>,
>(config: CrawleeOneConfig<TCrawlers, TRenderer>): CrawleeOneConfig<TCrawlers, TRenderer> {
  return config;
}

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

/** Schema defining the crawlers in a project. This schema is used for code generation. */
export interface CrawleeOneConfigSchema<TCrawlers extends CrawlersRecord = CrawlersRecord> {
  /** Object holding crawler configurations. Each crawler is identified by its key.
   *
   * Use `defineCrawler<Partial<ActorInput>>({...})` for each entry to type input/devInput.
   *
   * E.g.
   *
   * ```js
   * crawlers: {
   *   profesia: defineCrawler<Partial<ActorInput>>({
   *    type: 'cheerio',
   *    routes: [...],
   *    input: { startUrls: [...] }, // typed as Partial<ActorInput>
   *    devInput: { startUrls: [] }, // typed as Partial<ActorInput>
   *   }),
   *   another: defineCrawler<Partial<AnotherActorInput>>({
   *    type: 'playwright',
   *    routes: [...],
   *    input: { startUrls: [...] }, // typed as Partial<AnotherActorInput>
   *    devInput: { startUrls: [] }, // typed as Partial<AnotherActorInput>
   *   }),
   * }
   * ```
   */
  crawlers: TCrawlers;
}

/** Part of the schema that defines a single crawler. */
export interface CrawleeOneConfigSchemaCrawler<TInput = Record<string, unknown>> {
  /**
   * Crawler type - Each type is linked to a different Crawlee crawler class.
   * Different classes may use different technologies / stack for scraping.
   *
   * E.g. type `cheerio` will use `CheerioCrawler` class.
   */
  type: CrawlerType;
  routes: string[];
  /**
   * Path to load crawler module. Required for `crawlee-one dev` and `run`.
   * Typically points to built output (e.g. `./dist/index.js`).
   *
   * The module **must** have a default export: the run function matching
   * `CrawleeOneConfigRun`.
   */
  importPath?: string;
  /**
   * Optional path to TS source for `crawlee-one dev` and `crawlee-one run`.
   *
   * When set, loads from this path (e.g. `./src/index.ts`) so no build is needed.
   * When omitted, dev/run use `importPath` (built output) — build required.
   *
   * The module **must** have a default export: the run function matching
   * `CrawleeOneConfigRun`.
   */
  devImportPath?: string;
  /**
   * Input overrides for `crawlee-one dev` commands.
   */
  devInput?: TInput;
  /**
   * Input overrides for `crawlee-one run` command.
   */
  input?: TInput;
}

/** Meta options passed via CrawleeOneOptions */
export interface CrawleeOneConfigRunMetaOptions {
  /** When `true`, throw when a URL does not match any route.
   *
   * If `false`, log an error and skip the URL.
   *
   * Defaults to `false`.
   */
  strict?: boolean;
}

/**
 * Options passed to the scraper's run function by `crawlee-one run` and `crawlee-one dev`.
 *
 * @typeParam TCrawlerType - Crawler type (e.g. 'cheerio', 'playwright'); derives `crawlerOptions`.
 * @typeParam TInput - Actor input shape; types the `input` field.
 */
export type CrawleeOneConfigRunOptions<
  TCrawlerType extends CrawlerType = CrawlerType,
  TInput extends Record<string, unknown> = Record<string, unknown>,
> = {
  crawlerOptions?: CrawlerMeta<TCrawlerType>['options'];
  input?: TInput;
  crawleeOneOptions?: CrawleeOneConfigRunMetaOptions;
};

/**
 * The scraper entry point. Must be the default export.
 *
 * Routes are defined inside the function and passed to the crawler config;
 * they are not exported (dev mode resolves them from actor.routes).
 *
 * @example
 * ```ts
 * const run = async (opts?: CrawleeOneConfigRunOptions<'cheerio', ActorInput>) => {
 *   const { crawlerOptions, input, crawleeOneOptions } = opts ?? {};
 *   await myCrawler({
 *     crawlerConfigOverrides: crawlerOptions,
 *     input,
 *     crawleeOneOptions,
 *     routes: { ... },
 *   });
 * };
 * export default run;
 * ```
 *
 * @typeParam TCrawlerType - Crawler type; passed through to run options.
 * @typeParam TInput - Actor input shape; passed through to run options.
 */
export type CrawleeOneConfigRun<
  TCrawlerType extends CrawlerType = CrawlerType,
  TInput extends Record<string, unknown> = Record<string, unknown>,
> = (opts?: CrawleeOneConfigRunOptions<TCrawlerType, TInput>) => Promise<void>;
