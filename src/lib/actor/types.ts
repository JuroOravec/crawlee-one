import type { BasicCrawler, CrawlingContext, ProxyConfiguration, RouterHandler } from 'crawlee';
import type { gotScraping } from 'got-scraping';

import type { MaybePromise, PickPartial } from '../../utils/types';
import type { CrawlerUrl } from '../../types';
import type { itemCacheKey, pushData } from '../io/pushData';
import type { pushRequests } from '../io/pushRequests';
import type { RouteHandler, RouteMatcher, CrawlerRouterWrapper } from '../router';
import type { MetamorphActorInput } from '../config';
import type { CrawleeOneIO } from '../integrations/types';

type MaybeAsyncFn<R, Args extends any[]> = R | ((...args: Args) => MaybePromise<R>);

type OrigRunCrawler<T extends CrawlingContext<any, any>> = BasicCrawler<T>['run'];

/** Extended type of `crawler.run()` function */
export type RunCrawler<Ctx extends CrawlingContext = CrawlingContext<BasicCrawler>> = (
  requests?: CrawlerUrl[],
  options?: Parameters<OrigRunCrawler<Ctx>>[1]
) => ReturnType<OrigRunCrawler<Ctx>>;

/** Trigger actor metamorph, using actor's inputs as defaults. */
export type Metamorph = (overrides?: MetamorphActorInput) => Promise<void>;

/** Context passed to route handlers */
export type ActorRouterContext<
  Ctx extends CrawlingContext = CrawlingContext<BasicCrawler>,
  Labels extends string = string,
  Input extends Record<string, any> = Record<string, any>,
  TIO extends CrawleeOneIO = CrawleeOneIO
> = {
  actor: ActorContext<Ctx, Labels, Input, TIO>;
};

/** Context passed to user-defined functions passed from input */
export type ActorHookContext<TIO extends CrawleeOneIO> = Pick<ActorContext, 'input' | 'state'> & {
  io: TIO;
  itemCacheKey: typeof itemCacheKey;
  sendRequest: typeof gotScraping;
};

export interface ActorDefinition<
  Ctx extends CrawlingContext = CrawlingContext<BasicCrawler>,
  Labels extends string = string,
  Input extends Record<string, any> = Record<string, any>,
  TIO extends CrawleeOneIO = CrawleeOneIO
> {
  /** Client for communicating with cloud/local storage. */
  io: TIO;

  // Actor input
  /**
   * Actor input which you can get e.g. via `Actor.getInput()`
   *
   * Input is automatically retrieved if undefined.
   */
  input?: MaybeAsyncFn<Input, [ActorDefinition<Ctx, Labels, Input, TIO>]>;
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
  router: MaybeAsyncFn<RouterHandler<Ctx>, [ActorDefinitionWithInput<Ctx, Labels, Input, TIO>]>;
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
    RouteMatcher<Ctx, ActorRouterContext<Ctx, Labels, Input, TIO>, Labels>[],
    [ActorDefinitionWithInput<Ctx, Labels, Input, TIO>]
  >;
  /** Handlers for the labelled requests. The object keys are the labels. */
  routeHandlers: MaybeAsyncFn<Record<Labels, RouteHandler<Ctx, ActorRouterContext<Ctx, Labels, Input, TIO>>>, [ActorDefinitionWithInput<Ctx, Labels, Input, TIO>]>; // prettier-ignore
  /**
   * Provides the option to modify or extend all router handlers by wrapping
   * them in these functions.
   *
   * Wrappers are applied from right to left. That means that wrappers `[A, B, C]`
   * will be applied like so `A( B( C( handler ) ) )`.
   *
   * Default `routerWrappers`:
   * ```js
   * {
   *   ...
   *   routerWrappers: ({ input }) => [
   *     logLevelHandlerWrapper<Ctx, any>(input?.logLevel ?? 'info'),
   *   ],
   * }
   * ```
   */
  routerWrappers?: MaybeAsyncFn<CrawlerRouterWrapper<Ctx, ActorRouterContext<Ctx, Labels, Input, TIO>>[], [ActorDefinitionWithInput<Ctx, Labels, Input, TIO>]>; // prettier-ignore

  // Proxy setup
  proxy?: MaybeAsyncFn<ProxyConfiguration, [ActorDefinitionWithInput<Ctx, Labels, Input, TIO>]>; // prettier-ignore

  // Crawler setup
  createCrawler: (
    actorCtx: Omit<
      ActorContext<Ctx, Labels, Input, TIO>,
      'crawler' | 'runCrawler' | 'metamorph' | 'pushData' | 'pushRequests' | 'startUrls'
    >
  ) => MaybePromise<Ctx['crawler']>;
}

/** ActorDefinition object where the input is already resolved */
export type ActorDefinitionWithInput<
  Ctx extends CrawlingContext = CrawlingContext<BasicCrawler>,
  Labels extends string = string,
  Input extends Record<string, any> = Record<string, any>,
  TIO extends CrawleeOneIO = CrawleeOneIO
> = Omit<ActorDefinition<Ctx, Labels, Input, TIO>, 'input'> & {
  input: Input | null;
  state: Record<string, unknown>;
};

/** Context available while creating a Crawlee crawler/actor */
export interface ActorContext<
  Ctx extends CrawlingContext = CrawlingContext<BasicCrawler>,
  Labels extends string = string,
  Input extends Record<string, any> = Record<string, any>,
  TIO extends CrawleeOneIO = CrawleeOneIO
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
  routes: RouteMatcher<Ctx, ActorRouterContext<Ctx, Labels, Input, TIO>, Labels>[];
  routeHandlers: Record<Labels, RouteHandler<Ctx, ActorRouterContext<Ctx, Labels, Input, TIO>>>;
  /** Original config from which this actor context was created */
  config: PickPartial<ActorDefinition<Ctx, Labels, Input, TIO>, 'io'>;
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
}
