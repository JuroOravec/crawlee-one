import type { Actor } from 'apify';
import type { BasicCrawler, CrawlingContext, ProxyConfiguration, RouterHandler } from 'crawlee';

import type { MaybePromise } from '../../utils/types';
import type { CrawlerUrl } from '../../types';
import type { itemCacheKey, pushData } from '../io/pushData';
import type { RouteHandler, RouteMatcher, CrawlerRouterWrapper } from '../router';
import type {
  CrawlerConfigActorInput,
  LoggingActorInput,
  OutputActorInput,
  MetamorphActorInput,
  PrivacyActorInput,
  ProxyActorInput,
  StartUrlsActorInput,
} from '../config';

type MaybeAsyncFn<R, Args extends any[]> = R | ((...args: Args) => MaybePromise<R>);

type OrigRunCrawler<T extends CrawlingContext<any, any>> = BasicCrawler<T>['run'];

export type AllActorInputs = CrawlerConfigActorInput &
  StartUrlsActorInput &
  LoggingActorInput &
  ProxyActorInput &
  PrivacyActorInput &
  OutputActorInput &
  MetamorphActorInput;

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
  Input extends Record<string, any> = Record<string, any>
> = {
  actor: ActorContext<Ctx, Labels, Input>;
};

/** Context passed to user-defined functions passed from input */
export type ActorHookContext = Pick<ActorContext, 'input' | 'state'> & {
  Actor: typeof Actor;
  itemCacheKey: typeof itemCacheKey;
};

export interface ActorDefinition<
  Ctx extends CrawlingContext = CrawlingContext<BasicCrawler>,
  Labels extends string = string,
  Input extends Record<string, any> = Record<string, any>
> {
  // Actor input
  /**
   * Actor input which you can get e.g. via `Actor.getInput()`
   *
   * Input is automatically retrieved if undefined.
   */
  input?: MaybeAsyncFn<Input, [ActorDefinition<Ctx, Labels, Input>]>;
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
  router: MaybeAsyncFn<RouterHandler<Ctx>, [ActorDefinitionWithInput<Ctx, Labels, Input>]>;
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
    RouteMatcher<Ctx, ActorRouterContext<Ctx, Labels, Input>, Labels>[],
    [ActorDefinitionWithInput<Ctx, Labels, Input>]
  >;
  /** Handlers for the labelled requests. The object keys are the labels. */
  routeHandlers: MaybeAsyncFn<Record<Labels, RouteHandler<Ctx, ActorRouterContext<Ctx, Labels, Input>>>, [ActorDefinitionWithInput<Ctx, Labels, Input>]>; // prettier-ignore
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
  routerWrappers?: MaybeAsyncFn<CrawlerRouterWrapper<Ctx, ActorRouterContext<Ctx, Labels, Input>>[], [ActorDefinitionWithInput<Ctx, Labels, Input>]>; // prettier-ignore

  // Proxy setup
  proxy?: MaybeAsyncFn<ProxyConfiguration, [ActorDefinitionWithInput<Ctx, Labels, Input>]>; // prettier-ignore

  // Crawler setup
  createCrawler: (
    actorCtx: Omit<
      ActorContext<Ctx, Labels, Input>,
      'crawler' | 'runCrawler' | 'metamorph' | 'pushData' | 'startUrls'
    >
  ) => MaybePromise<Ctx['crawler']>;
}

/** ActorDefinition object where the input is already resolved */
export type ActorDefinitionWithInput<
  Ctx extends CrawlingContext = CrawlingContext<BasicCrawler>,
  Labels extends string = string,
  Input extends Record<string, any> = Record<string, any>
> = Omit<ActorDefinition<Ctx, Labels, Input>, 'input'> & {
  input: Input | null;
  state: Record<string, unknown>;
};

/** Context available while creating an Apify/Crawlee crawler */
export interface ActorContext<
  Ctx extends CrawlingContext = CrawlingContext<BasicCrawler>,
  Labels extends string = string,
  Input extends Record<string, any> = Record<string, any>
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
   * A list of resolved Requests to be scraped.
   *
   * This list is a combination of 3 Actor inputs:
   * - `startUrls` - Static list of URLs to scrape.
   * - `startUrlsFromDataset` - From a specific field from an Apify Dataset (e.g. "dataset123#fieldName" - Dataset: "dataset123", field: "fieldName").
   * - `startUrlsFromFunction` - A function that is evaulated to generate the Requests.
   */
  startUrls: CrawlerUrl[];
  proxy?: ProxyConfiguration;
  router: RouterHandler<Ctx>;
  routes: RouteMatcher<Ctx, ActorRouterContext<Ctx, Labels, Input>, Labels>[];
  routeHandlers: Record<Labels, RouteHandler<Ctx, ActorRouterContext<Ctx, Labels, Input>>>;
  /** Original config from which this actor context was created */
  config: ActorDefinition<Ctx, Labels, Input>;
  /** Read-only inputs passed to the actor */
  input: Input | null;
  /** Mutable state that is shared across setup and teardown hooks */
  state: Record<string, unknown>;
}
