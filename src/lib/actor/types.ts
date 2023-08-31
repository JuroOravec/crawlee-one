import type {
  BasicCrawler,
  CrawlingContext,
  Log,
  ProxyConfiguration,
  RouterHandler,
} from 'crawlee';
import type { gotScraping } from 'got-scraping';

import type { MaybePromise, PickPartial } from '../../utils/types';
import type { CrawlerUrl } from '../../types';
import type { itemCacheKey, pushData } from '../io/pushData';
import type { pushRequests } from '../io/pushRequests';
import type {
  CrawleeOneRouteHandler,
  CrawleeOneRoute,
  CrawleeOneRouteWrapper,
} from '../router/types';
import type { MetamorphActorInput } from '../config';
import type { CrawleeOneIO } from '../integrations/types';
import type { CrawleeOneTelemetry } from '../telemetry/types';

type MaybeAsyncFn<R, Args extends any[]> = R | ((...args: Args) => MaybePromise<R>);

type OrigRunCrawler<T extends CrawlingContext<any, any>> = BasicCrawler<T>['run'];

/** Extended type of `crawler.run()` function */
export type RunCrawler<Ctx extends CrawlingContext = CrawlingContext<BasicCrawler>> = (
  requests?: CrawlerUrl[],
  options?: Parameters<OrigRunCrawler<Ctx>>[1]
) => ReturnType<OrigRunCrawler<Ctx>>;

/** Trigger actor metamorph, using actor's inputs as defaults. */
export type Metamorph = (overrides?: MetamorphActorInput) => Promise<void>;

/** Context passed from actor to route handlers */
export type CrawleeOneActorRouterCtx<
  Ctx extends CrawlingContext = CrawlingContext<BasicCrawler>,
  Labels extends string = string,
  Input extends Record<string, any> = Record<string, any>,
  TIO extends CrawleeOneIO = CrawleeOneIO,
  Telem extends CrawleeOneTelemetry<any, any> = CrawleeOneTelemetry<any, any>
> = {
  actor: CrawleeOneActorCtx<Labels, Input, TIO, Telem, Ctx>;
};

/** Context passed to user-defined functions passed from input */
export type CrawleeOneHookCtx<
  Input extends Record<string, any> = Record<string, any>,
  TIO extends CrawleeOneIO = CrawleeOneIO
> = Pick<CrawleeOneActorCtx<any, Input>, 'input' | 'state'> & {
  io: TIO;
  itemCacheKey: typeof itemCacheKey;
  sendRequest: typeof gotScraping;
};

/** All that's necessary to define a single CrawleeOne actor/crawler. */
export interface CrawleeOneActorDef<
  Labels extends string = string,
  Input extends Record<string, any> = Record<string, any>,
  TIO extends CrawleeOneIO = CrawleeOneIO,
  Telem extends CrawleeOneTelemetry<any, any> = CrawleeOneTelemetry<any, any>,
  Ctx extends CrawlingContext = CrawlingContext<BasicCrawler>
> {
  /** Client for communicating with cloud/local storage. */
  io: TIO;
  /** Client for telemetry like tracking errors. */
  telemetry?: Telem;

  // Actor input
  /**
   * Actor input which you can get e.g. via `Actor.getInput()`
   *
   * Input is automatically retrieved if undefined.
   */
  input?: MaybeAsyncFn<Input, [CrawleeOneActorDef<Labels, Input, TIO, Telem, Ctx>]>;
  /** Validation for the actor input. Should throw error if validation fails. */
  validateInput?: (input: Input | null) => MaybePromise<void>;

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
  router: MaybeAsyncFn<
    RouterHandler<Ctx>,
    [CrawleeOneActorDefWithInput<Labels, Input, TIO, Telem, Ctx>]
  >;
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
   *     handlerLabel: routeLabels.JOB_DETAIL,
   *     match: (url) => isUrlOfJobOffer(url),
   *   }, {
   *     // Define custom action function:
   *     // If match returns true, we replace this request with new one
   *     // pointing to new domain.
   *     name: 'Main page',
   *     handlerLabel: null,
   *     match: (url) => url.match(/example\.com\/?(?:[?#~]|$)/i),
   *     action: async (url, ctx, _, handlers) => {
   *       ctx.log.info(`Redirecting to https://www.new-domain.com`);
   *       await ctx.crawler.addRequests(['https://www.new-domain.com'], { forefront: true });
   *     },
   *   }],
   * })
   */
  routes: MaybeAsyncFn<
    CrawleeOneRoute<Labels, CrawleeOneActorRouterCtx<Ctx, Labels, Input, TIO, Telem>, Ctx>[],
    [CrawleeOneActorDefWithInput<Labels, Input, TIO, Telem, Ctx>]
  >;
  /** Handlers for the labelled requests. The object keys are the labels. */
  routeHandlers: MaybeAsyncFn<
    Record<Labels, CrawleeOneRouteHandler<Ctx, CrawleeOneActorRouterCtx<Ctx, Labels, Input, TIO, Telem>>>,
    [CrawleeOneActorDefWithInput<Labels, Input, TIO, Telem, Ctx>]
  >; // prettier-ignore
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
    CrawleeOneRouteWrapper<Ctx, CrawleeOneActorRouterCtx<Ctx, Labels, Input, TIO, Telem>>[],
    [CrawleeOneActorDefWithInput<Labels, Input, TIO, Telem, Ctx>]
  >; // prettier-ignore

  // Proxy setup
  proxy?: MaybeAsyncFn<
    ProxyConfiguration,
    [CrawleeOneActorDefWithInput<Labels, Input, TIO, Telem, Ctx>]
  >; // prettier-ignore

  // Crawler setup
  createCrawler: (
    actorCtx: Omit<
      CrawleeOneActorCtx<Labels, Input, TIO, Telem, Ctx>,
      'crawler' | 'runCrawler' | 'metamorph' | 'pushData' | 'pushRequests' | 'startUrls'
    >
  ) => MaybePromise<Ctx['crawler']>;
}

/** CrawleeOneActorDef object where the input is already resolved */
export type CrawleeOneActorDefWithInput<
  Labels extends string = string,
  Input extends Record<string, any> = Record<string, any>,
  TIO extends CrawleeOneIO = CrawleeOneIO,
  Telem extends CrawleeOneTelemetry<any, any> = CrawleeOneTelemetry<any, any>,
  Ctx extends CrawlingContext = CrawlingContext<BasicCrawler>
> = Omit<CrawleeOneActorDef<Labels, Input, TIO, Telem, Ctx>, 'input'> & {
  input: Input | null;
  state: Record<string, unknown>;
};

/** Context available while creating a Crawlee crawler/actor */
export interface CrawleeOneActorCtx<
  Labels extends string = string,
  Input extends Record<string, any> = Record<string, any>,
  TIO extends CrawleeOneIO = CrawleeOneIO,
  Telem extends CrawleeOneTelemetry<any, any> = CrawleeOneTelemetry<any, any>,
  Ctx extends CrawlingContext = CrawlingContext<BasicCrawler>
> {
  crawler: Ctx['crawler'];
  /**
   * This function wraps `crawler.run(requests, runOtions)` with additional
   * features:
   * - Automatically metamorph into another actor after the run finishes
   */
  runCrawler: RunCrawler<Ctx>;
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
  pushData: typeof pushData;
  /**
   * Similar to `Actor.openRequestQueue().addRequests`, but with extra features:
   *
   * - Limit the max size of the RequestQueue. No requests are added when RequestQueue is at or above the limit.
   * - Transform and filter requests. Requests that did not pass the filter are not added to the RequestQueue.
   */
  pushRequests: typeof pushRequests;
  /**
   * A list of resolved Requests to be scraped.
   *
   * This list is a combination of 3 Actor inputs:
   * - `startUrls` - Static list of URLs to scrape.
   * - `startUrlsFromDataset` - From a specific field from a Dataset (e.g. "dataset123#fieldName" - Dataset: "dataset123", field: "fieldName").
   * - `startUrlsFromFunction` - A function that is evaulated to generate the Requests.
   */
  startUrls: CrawlerUrl[];
  proxy?: ProxyConfiguration;
  router: RouterHandler<Ctx>;
  routes: CrawleeOneRoute<Labels, CrawleeOneActorRouterCtx<Ctx, Labels, Input, TIO, Telem>, Ctx>[];
  routeHandlers: Record<
    Labels,
    CrawleeOneRouteHandler<Ctx, CrawleeOneActorRouterCtx<Ctx, Labels, Input, TIO, Telem>>
  >;
  /** Original config from which this actor context was created */
  config: PickPartial<CrawleeOneActorDef<Labels, Input, TIO, Telem, Ctx>, 'io'>;
  /** Read-only inputs passed to the actor */
  input: Input | null;
  /** Mutable state that is shared across setup and teardown hooks */
  state: Record<string, unknown>;
  /**
   * Instance managing communication with databases - storage & retrieval
   * (Dataset, RequestQueue, KeyValueStore).
   *
   * This is modelled and similar to Apify's `Actor` static class.
   */
  io: TIO;
  /** Instance managing telemetry like tracking errors. */
  telemetry?: Telem;
  /** Crawlee Log instance. */
  log: Log;
}
