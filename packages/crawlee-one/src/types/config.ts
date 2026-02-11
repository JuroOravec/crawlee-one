import type { ActorSpec } from 'actor-spec';

import type { CrawlerType } from './index.js';

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
  actorSpec: unknown;
  input?: TInput;
}) => string | Promise<string>;

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

export interface CrawleeOneConfig {
  /** Version of the CrawleeOne config. */
  version: 1;
  /** Schema defining the crawlers in this project. This schema is used for code generation. */
  schema: CrawleeOneConfigSchema;
  /**
   * Type generation settings.
   *
   * If omitted, type generation is skipped.
   */
  types?: CrawleeOneConfigTypes;
  /**
   * Actor config generation settings (produces `actor.json`).
   *
   * If omitted, `actor.json` generation is skipped.
   */
  actor?: CrawleeOneConfigActor;
  /**
   * Actor spec generation settings (produces `actorspec.json`).
   *
   * If omitted, `actorspec.json` generation is skipped.
   */
  actorspec?: CrawleeOneConfigActorSpec;
  /**
   * `README.md` generation settings.
   *
   * If omitted, `README.md` generation is skipped.
   */
  readme?: CrawleeOneConfigReadme;
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

export interface CrawleeOneConfigReadme {
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
  renderer?: ReadmeRenderer<any>;
  /**
   * Renderer-specific data. Shape depends on the renderer.
   *
   * Everything the renderer needs (templates, helper functions, etc.)
   * is passed through this single object.
   */
  input?: unknown;
}

// ---------------------------------------------------------------------------
// defineConfig helper (provides generic inference for renderer -> input)
// ---------------------------------------------------------------------------

/** Input type for {@link defineConfig} with full generic inference. */
interface DefineConfigInput<TRenderer extends ReadmeRenderer<any>> {
  version: 1;
  schema: CrawleeOneConfigSchema;
  types?: CrawleeOneConfigTypes;
  actor?: CrawleeOneConfigActor;
  actorspec?: CrawleeOneConfigActorSpec;
  readme?: {
    outFile?: string;
    actorSpec?: unknown;
    renderer?: TRenderer;
    input?: TRenderer extends ReadmeRenderer<infer I> ? I : unknown;
  };
}

/**
 * Type-safe config helper.
 *
 * When a `renderer` is provided, TypeScript infers the expected shape of
 * `input` from the `renderer`'s generic parameter.
 *
 * @example
 * ```ts
 * import { defineConfig } from 'crawlee-one';
 * import { renderApifyReadme } from './src/readme.js';
 *
 * export default defineConfig({
 *   version: 1,
 *   schema: {
 *     crawlers: {
 *       myCrawler: {
 *         type: 'cheerio',
 *         routes: ['main'],
 *       },
 *     },
 *   },
 *   readme: {
 *     renderer: renderApifyReadme,
 *     input: {
 *       templates: { ... }, // autocompleted from ApifyReadmeInput
 *     },
 *   },
 * });
 * ```
 */
export function defineConfig<TRenderer extends ReadmeRenderer<any> = ReadmeRenderer>(
  config: DefineConfigInput<TRenderer>
): CrawleeOneConfig {
  return config as CrawleeOneConfig;
}

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

/** Schema defining the crawlers in a project. This schema is used for code generation. */
export interface CrawleeOneConfigSchema {
  /** Object holding crawler configurations. Each crawler is identified by its key.
   *
   * E.g.
   *
   * ```js
   * {
   *   myCrawler: {
   *     type: 'cheerio',
   *     routes: [...],
   *   }
   * }
   * ```
   */
  crawlers: Record<string, CrawleeOneConfigSchemaCrawler>;
}

/** Part of the schema that defines a single crawler. */
export interface CrawleeOneConfigSchemaCrawler {
  /**
   * Crawler type - Each type is linked to a different Crawlee crawler class.
   * Different classes may use different technologies / stack for scraping.
   *
   * E.g. type `cheerio` will use `CheerioCrawler` class.
   */
  type: CrawlerType;
  routes: string[];
}
