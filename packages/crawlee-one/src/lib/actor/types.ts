import type {
  BasicCrawler,
  CheerioCrawler,
  CrawlingContext,
  HttpCrawler,
  InternalHttpCrawlingContext,
  JSDOMCrawler,
  Log,
  PlaywrightCrawler,
  ProxyConfiguration,
  PuppeteerCrawler,
  RouterHandler,
} from 'crawlee';
import type { gotScraping } from 'got-scraping';

import type { MaybeAsyncFn, MaybePromise, PickPartial } from '../../utils/types.js';
import type { CrawlerUrl } from '../../types/index.js';
import type { PushDataOptions, itemCacheKey } from '../io/pushData.js';
import type { PushRequestsOptions } from '../io/pushRequests.js';
import type {
  CrawleeOneRoute,
  CrawleeOneRouteHandler,
  CrawleeOneRouteWrapper,
} from '../router/types.js';
import type { MetamorphActorInput } from '../input.js';
import type { CrawleeOneIO } from '../integrations/types.js';
import type { CrawleeOneTelemetry } from '../telemetry/types.js';

type OrigRunCrawler<T extends CrawlingContext<any, any>> = BasicCrawler<T>['run'];

/** Extended type of `crawler.run()` function */
export type RunCrawler<Ctx extends CrawlingContext = CrawlingContext<BasicCrawler>> = (
  requests?: CrawlerUrl[],
  options?: Parameters<OrigRunCrawler<Ctx>>[1]
) => ReturnType<OrigRunCrawler<Ctx>>;

/** Trigger actor metamorph, using actor's inputs as defaults. */
export type Metamorph = (overrides?: MetamorphActorInput) => Promise<void>;

/**
 * Abstract type that holds all variable (generic) types used in CrawleeOne.
 *
 * This type is not constructed anywhere. It is simply a shorthand, so we don't
 * have to pass through many times, but only one that describes them all.
 */
export interface CrawleeOneCtx<
  Ctx extends CrawlingContext<
    | BasicCrawler
    | HttpCrawler<InternalHttpCrawlingContext>
    | JSDOMCrawler
    | CheerioCrawler
    | PlaywrightCrawler
    | PuppeteerCrawler
  > = CrawlingContext<
    | BasicCrawler
    | HttpCrawler<InternalHttpCrawlingContext>
    | JSDOMCrawler
    | CheerioCrawler
    | PlaywrightCrawler
    | PuppeteerCrawler
  >,
  Labels extends string = string,
  Input extends Record<string, any> = Record<string, any>,
  TIO extends CrawleeOneIO = CrawleeOneIO,
  Telem extends CrawleeOneTelemetry<any, any> = CrawleeOneTelemetry<any, any>,
> {
  context: Ctx;
  labels: Labels;
  input: Input;
  io: TIO;
  telemetry: Telem;
}

/** Context passed from actor to route handlers */
export type CrawleeOneActorRouterCtx<T extends CrawleeOneCtx> = {
  actor: CrawleeOneActorInst<T>;
  /** Trigger actor metamorph, using actor's inputs as defaults. */
  metamorph: Metamorph;
  /**
   * `Actor.pushData` with extra optional features:
   *
   * - Limit the number of entries pushed to the Dataset based on the Actor input
   * - Transform and filter entries via Actor input.
   * - Add metadata to entries before they are pushed to Dataset.
   * - Set which (nested) properties are personal data optionally redact them for privacy compliance.
   */
  pushData: <T extends Record<any, any> = Record<any, any>>(
    oneOrManyItems: T | T[],
    options: PushDataOptions<T>
  ) => Promise<any[]>;
  /**
   * Similar to `Actor.openRequestQueue().addRequests`, but with extra features:
   *
   * - Limit the max size of the RequestQueue. No requests are added when RequestQueue is at or above the limit.
   * - Transform and filter requests. Requests that did not pass the filter are not added to the RequestQueue.
   */
  pushRequests: <T extends Exclude<CrawlerUrl, string>>(
    oneOrManyItems: T | T[],
    options?: PushRequestsOptions<T>
  ) => Promise<any[]>;
};

/** Context passed to user-defined functions passed from input */
export type CrawleeOneHookCtx<T extends CrawleeOneCtx> = Pick<
  CrawleeOneActorInst<T>,
  'input' | 'state'
> & {
  /**
   * Instance of {@link CrawleeOneIO} that manages results (Dataset), Requests (RequestQueue), and cache (KeyValueStore).
   *
   * By default this is the Apify Actor class, see https://docs.apify.com/sdk/js/reference/class/Actor.
   */
  io: T['io'];
  /**
   * A function you can use to get cacheID for current `entry`.
   * It takes the entry itself, and a list of properties to be used for hashing.
   *
   * By default, you should pass `input.cachePrimaryKeys` to it.
   */
  itemCacheKey: typeof itemCacheKey;
  /**
   * Fetch remote data. Uses 'got-scraping', same as Apify's \`sendRequest\`.
   *
   * See https://crawlee.dev/docs/guides/got-scraping
   */
  sendRequest: typeof gotScraping;
};

export type CrawleeOneHookFn<
  TArgs extends any[] = [],
  TReturn = void,
  T extends CrawleeOneCtx = CrawleeOneCtx,
> = (...args: [...TArgs, CrawleeOneHookCtx<T>]) => MaybePromise<TReturn>;

/** All that's necessary to define a single CrawleeOne actor/crawler. */
export interface CrawleeOneActorDef<T extends CrawleeOneCtx> {
  /** Client for communicating with cloud/local storage. */
  io: T['io'];

  // Actor input
  /**
   * Supply actor input via this field instead of from `io.getInput()`.
   *
   * If `input` is NOT defined, the Actor input is obtained from `io.getInput()`,
   * which by default corresponds to Apify's `Actor.getInput()`.
   *
   * If `input` is defined, then `io.getInput()` is ignored.
   */
  input?: MaybeAsyncFn<T['input'], [CrawleeOneActorDef<T>]>;
  /** Default input that may be overriden by `input` and `io.getInput()`. */
  inputDefaults?: MaybeAsyncFn<T['input'], [CrawleeOneActorDef<T>]>;
  /**
   * If `mergeInput` is truthy, will merge input settings from `inputDefaults`, `input`,
   * and `io.getInput()`.
   *
   * ```js
   * { ...inputDefaults, ...io.getInput(), ...input }
   * ```
   *
   * If `mergeInput` is falsy, `io.getInput()` is ignored if `input` is provided. So the input is either:
   *
   * ```js
   * { ...inputDefaults, ...io.getInput() } // If `input` is not defined
   * ```
   *
   * OR
   *
   * ```js
   * { ...inputDefaults, ...input } // If `input` is defined
   * ```
   *
   * Alternatively, you can supply your own function that merges the sources:
   *
   * ```js
   * {
   *   // `mergeInput` can be also async
   *   mergeInput: ({ defaults, overrides, env }) => {
   *     // This is same as `mergeInput: true`
   *     return { ...defaults, ...env, ...overrides };
   *   },
   * }
   * ```
   */
  mergeInput?:
    | boolean
    | ((sources: {
        defaults: Partial<T['input']>;
        overrides: Partial<T['input']>;
        env: Partial<T['input']>;
      }) => MaybePromise<T['input']>);
  /** Validation for the actor input. Should throw error if validation fails. */
  validateInput?: (input: T['input'] | null) => MaybePromise<void>;

  // Router setup
  /**
   * Router instance that redirects the request to handlers.
   * @example
   * import { createCheerioRouter } from 'crawlee';
   *
   * ({
   *    ...
   *   router: createCheerioRouter(),
   * })
   */
  router: MaybeAsyncFn<RouterHandler<T['context']>, [CrawleeOneActorDefWithInput<T>]>;
  /**
   * Criteria that un-labelled requests are matched against.
   *
   * E.g. If `match` function returns truthy value,
   * the request is passed to the `action` function for processing.
   *
   * @example
   * ({
   *   ...
   *   routes: [{
   *     // If match returns true, the request is forwarded to handler
   *     // with label JOB_DETAIL.
   *     name: 'Job detail',
   *     label: routeLabels.JOB_DETAIL,
   *     match: (url) => isUrlOfJobOffer(url),
   *   }, {
   *     // Define custom action function:
   *     // If match returns true, we replace this request with new one
   *     // pointing to new domain.
   *     name: 'Main page',
   *     label: null,
   *     match: (url) => url.match(/example\.com\/?(?:[?#~]|$)/i),
   *     action: async (url, ctx, _, handlers) => {
   *       ctx.log.info(`Redirecting to https://www.new-domain.com`);
   *       await ctx.crawler.addRequests(['https://www.new-domain.com'], { forefront: true });
   *     },
   *   }],
   * })
   */
  routes: MaybeAsyncFn<
    Record<T['labels'], CrawleeOneRoute<T, CrawleeOneActorRouterCtx<T>>>,
    [CrawleeOneActorDefWithInput<T>]
  >;
  /**
   * Provides the option to modify or extend all router handlers by wrapping
   * them in these functions.
   *
   * Wrappers are applied from right to left. That means that wrappers `[A, B, C]`
   * will be applied like so `A( B( C( handler ) ) )`.
   *
   * Default `routeHandlerWrappers`:
   * ```js
   * {
   *   ...
   *   routeHandlerWrappers: ({ input }) => [
   *     logLevelHandlerWrapper<Ctx, any>(input?.logLevel ?? 'info'),
   *   ],
   * }
   * ```
   */
  routeHandlerWrappers?: MaybeAsyncFn<
    CrawleeOneRouteWrapper<T, CrawleeOneActorRouterCtx<T>>[],
    [CrawleeOneActorDefWithInput<T>]
  >; // prettier-ignore

  // Proxy setup
  proxy?: MaybeAsyncFn<
    ProxyConfiguration,
    [CrawleeOneActorDefWithInput<T>]
  >; // prettier-ignore

  /** Client for telemetry like tracking errors. */
  telemetry?: MaybeAsyncFn<T['telemetry'], [CrawleeOneActorDefWithInput<T>]>;

  // Crawler setup
  createCrawler: (
    actorCtx: Omit<
      CrawleeOneActorInst<T>,
      'crawler' | 'runCrawler' | 'metamorph' | 'pushData' | 'pushRequests' | 'startUrls'
    >
  ) => MaybePromise<T['context']['crawler']>;
}

/** CrawleeOneActorDef object where the input is already resolved */
export type CrawleeOneActorDefWithInput<T extends CrawleeOneCtx> = Omit<
  CrawleeOneActorDef<T>,
  'input'
> & {
  input: T['input'] | null;
  state: Record<string, unknown>;
};

/** Context available while creating a Crawlee crawler/actor */
export interface CrawleeOneActorInst<T extends CrawleeOneCtx> {
  /** The Crawlee crawler instance used by this instance of CrawleeOne  */
  crawler: T['context']['crawler'];
  /**
   * This function wraps `crawler.run(requests, runOtions)` with additional
   * features:
   * - Optionally metamorph into another actor after the run finishes
   */
  runCrawler: RunCrawler<T['context']>;
  /** Trigger actor metamorph, using actor's inputs as defaults. */
  metamorph: Metamorph;
  /**
   * `Actor.pushData` with extra optional features:
   *
   * - Limit the number of entries pushed to the Dataset based on the Actor input
   * - Transform and filter entries via Actor input.
   * - Add metadata to entries before they are pushed to Dataset.
   * - Set which (nested) properties are personal data optionally redact them for privacy compliance.
   */
  pushData: <T extends Record<any, any> = Record<any, any>>(
    oneOrManyItems: T | T[],
    options: PushDataOptions<T>
  ) => Promise<any[]>;
  /**
   * Similar to `Actor.openRequestQueue().addRequests`, but with extra features:
   *
   * - Limit the max size of the RequestQueue. No requests are added when RequestQueue is at or above the limit.
   * - Transform and filter requests. Requests that did not pass the filter are not added to the RequestQueue.
   */
  pushRequests: <T extends Exclude<CrawlerUrl, string>>(
    oneOrManyItems: T | T[],
    options?: PushRequestsOptions<T>
  ) => Promise<any[]>;
  /**
   * A list of resolved Requests to be scraped.
   *
   * This list is a combination of 3 Actor inputs:
   * - `startUrls` - Static list of URLs to scrape.
   * - `startUrlsFromDataset` - From a specific field from a Dataset (e.g. "dataset123#fieldName" - Dataset: "dataset123", field: "fieldName").
   * - `startUrlsFromFunction` - A function that is evaulated to generate the Requests.
   */
  startUrls: CrawlerUrl[];
  /* The resolved Crawlee proxy configuration */
  proxy?: ProxyConfiguration;
  /* The resolved Crawlee Router */
  router: RouterHandler<T['context']>;
  routes: Record<T['labels'], CrawleeOneRoute<T, CrawleeOneActorRouterCtx<T>>>;
  /** Original config from which this actor context was created */
  config: PickPartial<CrawleeOneActorDef<T>, 'io'>;
  /** Read-only inputs passed to the actor */
  input: T['input'] | null;
  /** Mutable state that is shared across setup and teardown hooks */
  state: Record<string, unknown>;
  /**
   * Instance managing communication with databases - storage & retrieval
   * (Dataset, RequestQueue, KeyValueStore).
   *
   * This is modelled and similar to Apify's `Actor` static class.
   */
  io: T['io'];
  /** Instance managing telemetry like tracking errors. */
  telemetry?: T['telemetry'];
  /** Crawlee Log instance. */
  log: Log;
  handlerCtx: null | Parameters<CrawleeOneRouteHandler<T, CrawleeOneActorRouterCtx<T>>>[0];
}
