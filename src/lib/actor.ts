import { Actor } from 'apify';
import {
  BasicCrawler,
  CrawlingContext,
  RouterHandler,
  ProxyConfiguration,
  BasicCrawlerOptions,
  CheerioCrawler,
  Router,
  HttpCrawler,
  JSDOMCrawler,
  PlaywrightCrawler,
  PuppeteerCrawler,
} from 'crawlee';
import { omitBy, pick } from 'lodash';
import * as Sentry from '@sentry/node';

import type { CrawlerMeta, CrawlerType } from '../types';
import type { MaybePromise } from '../utils/types';
import {
  RouteHandler,
  CrawlerRouterWrapper,
  RouteMatcher,
  registerHandlers,
  setupDefaultRoute,
} from './router';
import {
  CrawlerConfigActorInput,
  LoggingActorInput,
  OutputActorInput,
  PrivacyActorInput,
  ProxyActorInput,
  crawlerInput,
} from './config';
import { createErrorHandler } from './error/errorHandler';
import { setupSentry } from './error/sentry';
import { logLevelHandlerWrapper } from './log';
import { itemCacheKey, pushData } from './dataset/pushData';

type MaybeAsyncFn<R, Args extends any[]> = R | ((...args: Args) => MaybePromise<R>);

const isRouter = (r: any): r is RouterHandler<any> => {
  return !!((r as RouterHandler).addHandler && (r as RouterHandler).addDefaultHandler);
};
const isFunc = (f: any): f is (...args: any[]) => any => {
  return typeof f === 'function';
};

/** Run a function that was defined as a string via Actor input */
const evalInputHook = async <
  Ctx extends CrawlingContext<any> = CrawlingContext<BasicCrawler>,
  Labels extends string = string,
  Input extends Record<string, any> = Record<string, any>
>(
  actor: Pick<ActorContext<Ctx, Labels, Input>, 'input' | 'state'>,
  fnStr?: string,
  args: any[] = []
) => {
  if (!fnStr) return;

  const hookCtx = {
    Actor,
    input: actor.input,
    state: actor.state,
    itemCacheKey,
  } satisfies ActorHookContext;

  const hookFn = eval(fnStr);
  await hookFn(...args, hookCtx);
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
   */
  routerWrappers?: MaybeAsyncFn<CrawlerRouterWrapper<Ctx, ActorRouterContext<Ctx, Labels, Input>>[], [ActorDefinitionWithInput<Ctx, Labels, Input>]>; // prettier-ignore

  // Proxy setup
  proxy?: MaybeAsyncFn<ProxyConfiguration, [ActorDefinitionWithInput<Ctx, Labels, Input>]>; // prettier-ignore

  // Crawler setup
  createCrawler: (
    actorCtx: Omit<ActorContext<Ctx, Labels, Input>, 'crawler' | 'runActor'>
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
  runActor: RunActor<Ctx>;
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

type OrigRunActor<T extends CrawlingContext<any, any>> = BasicCrawler<T>['run'];

/** Extended type of `crawler.run()` function */
export type RunActor<Ctx extends CrawlingContext = CrawlingContext<BasicCrawler>> = (
  requests?: Parameters<OrigRunActor<Ctx>>[0],
  options?: Parameters<OrigRunActor<Ctx>>[1]
) => ReturnType<OrigRunActor<Ctx>>;

/** Context passed to user-defined functions passed from input */
export type ActorHookContext = Pick<ActorContext, 'input' | 'state'> & {
  Actor: typeof Actor;
  itemCacheKey: typeof itemCacheKey;
};

/** Context passed to route handlers */
export type ActorRouterContext<
  Ctx extends CrawlingContext = CrawlingContext<BasicCrawler>,
  Labels extends string = string,
  Input extends Record<string, any> = Record<string, any>
> = {
  actor: ActorContext<Ctx, Labels, Input>;
  pushData: typeof pushData;
};

/**
 * Create opinionated Apify crawler that uses router for handling requests.
 *
 * This is a quality-of-life function that does the following for you:
 *
 * 1) TypeScript - Ensure all components use the same Crawler / CrawlerContext.
 *
 * 2) Get Actor input from `Actor.getInput` if not given.
 *
 * 3) (Optional) Validate Actor input
 *
 * 4) Set up router such that requests that reach default route are
 * redirected to labelled routes based on the "routes" items.
 *
 * 5) Register all route handlers for you.
 *
 * 6) (Optional) Wrap all route handlers in a wrapper. Use this e.g.
 * if you want to add a field to the context object, or handle errors
 * from a single place.
 */
export const createApifyActor = async <
  Ctx extends CrawlingContext = CrawlingContext<BasicCrawler>,
  Labels extends string = string,
  Input extends Record<string, any> = Record<string, any>
>(
  config: ActorDefinition<Ctx, Labels, Input>
): Promise<ActorContext<Ctx, Labels, Input>> => {
  // Initialize actor inputs
  const input = Object.freeze(
    config.input
      ? isFunc(config.input)
        ? await config.input({ ...config })
        : config.input
      : await Actor.getInput<Input>()
  );

  if (config.validateInput) await config.validateInput(input);

  // Mutable state that is available to the actor hooks
  const state = {};

  // This is context that is available to options that use initialization function
  const getConfig = () => ({ ...config, input, state });

  // Set up proxy
  const defaultProxy =
    config.proxy == null && process.env.APIFY_IS_AT_HOME
      ? await Actor.createProxyConfiguration(input?.proxy)
      : undefined;
  const proxy =
    config.proxy == null
      ? defaultProxy
      : isFunc(config.proxy)
      ? await config.proxy(getConfig())
      : config.proxy;

  // Run initialization functions
  const router: RouterHandler<Ctx> = isRouter(config.router)
    ? config.router
    : await (config.router as any)(getConfig());
  const routes = isFunc(config.routes) ? await config.routes(getConfig()) : config.routes; // prettier-ignore
  const routeHandlers = isFunc(config.routeHandlers) ? await config.routeHandlers(getConfig()) : config.routeHandlers; // prettier-ignore
  const routerWrappers = isFunc(config.routerWrappers) ? await config.routerWrappers(getConfig()) : config.routerWrappers; // prettier-ignore

  // Create Crawlee crawler
  const getActorCtx = () => ({ router, routes, routeHandlers, proxy, config, input, state });
  const crawler = await config.createCrawler(getActorCtx());

  // Create actor (our custom entity)
  const preActor = { crawler, ...getActorCtx() };
  const runActor = createActorRunner<Ctx, Labels, Input>({ ...preActor });
  const actor = { ...preActor, runActor, crawler } satisfies ActorContext<Ctx, Labels, Input>;

  /** pushData wrapper that pre-populates options based on actor input */
  const scopedPushData: typeof pushData = (entries, ctx, options) => {
    const { outputTransform, outputFilter } = (actor.input ?? {}) as OutputActorInput;

    const mergedOptions = {
      showPrivate: input?.includePersonalData,
      pickKeys: input?.outputPickFields,
      remapKeys: input?.outputRenameFields,
      transform: outputTransform ? ((item) => evalInputHook(actor, outputTransform, [item])) : undefined, // prettier-ignore
      filter: outputFilter ? ((item) => evalInputHook(actor, outputFilter, [item])) : undefined, // prettier-ignore
      datasetIdOrName: input?.outputDatasetIdOrName,
      cacheStoreIdOrName: input?.outputCacheStoreIdOrName,
      cachePrimaryKeys: input?.outputCachePrimaryKeys,
      cacheActionOnResult: input?.outputCacheActionOnResult,
      ...options,
    };
    return pushData(entries, ctx, mergedOptions);
  };

  // Extra data that we make available to the route handlers
  const routerContext = { actor, pushData: scopedPushData };

  // Set up router
  await setupDefaultRoute<Ctx, ActorRouterContext<Ctx, Labels, Input>, Labels>({
    router,
    routerWrappers,
    routerContext,
    routes,
    routeHandlers,
  });
  await registerHandlers<Ctx, ActorRouterContext<Ctx, Labels, Input>, Labels>({
    router,
    routerWrappers,
    routerContext,
    routeHandlers,
  });

  return actor;
};

/**
 * Create a function that wraps `crawler.run(requests, runOtions)` with additional
 * features like:
 * - Automatically metamorph into another actor after the run finishes
 */
const createActorRunner = <
  Ctx extends CrawlingContext<any> = CrawlingContext<BasicCrawler>,
  Labels extends string = string,
  Input extends Record<string, any> = Record<string, any>
>(
  actor: Omit<ActorContext<Ctx, Labels, Input>, 'runActor'>
) => {
  const {
    outputTransformBefore,
    outputTransformAfter,
    outputFilterBefore,
    outputFilterAfter,
    outputCacheStoreIdOrName,
    outputCacheActionOnResult,
    metamorphActorId,
    metamorphActorBuild,
    metamorphActorInput,
  } = (actor.input ?? {}) as OutputActorInput;

  const runActor: RunActor<Ctx> = async (requests, options) => {
    // Clear cache if it was set from the input
    if (outputCacheStoreIdOrName && outputCacheActionOnResult === 'overwrite') {
      const store = await Actor.openKeyValueStore(outputCacheStoreIdOrName);
      await store.drop();
    }

    await evalInputHook(actor, outputTransformBefore);
    await evalInputHook(actor, outputFilterBefore);

    const runRes = await actor.crawler.run(requests, options);

    await evalInputHook(actor, outputTransformAfter);
    await evalInputHook(actor, outputFilterAfter);

    // Trigger metamorph if it was set from the input
    const targetActorId = metamorphActorId;
    const targetActorBuild = metamorphActorBuild;
    const targetActorInput = metamorphActorInput;
    if (targetActorId) {
      await Actor.metamorph(targetActorId, targetActorInput, { build: targetActorBuild });
    }

    return runRes;
  };

  return runActor;
};

const actorClassByType = {
  basic: BasicCrawler,
  http: HttpCrawler,
  cheerio: CheerioCrawler,
  jsdom: JSDOMCrawler,
  playwright: PlaywrightCrawler,
  puppeteer: PuppeteerCrawler,
} satisfies Record<CrawlerType, { new (options: Record<string, any>): any }>;

type AllInputs = CrawlerConfigActorInput &
  LoggingActorInput &
  ProxyActorInput &
  PrivacyActorInput &
  OutputActorInput;

/**
 * Create default configuration for an Apify actor
 * and run the actor within the `Actor.main()` context.
 */
export const createAndRunApifyActor = async <
  TCrawlerType extends CrawlerType,
  Ctx extends CrawlerMeta<TCrawlerType, any>['context'] = CrawlingContext<BasicCrawler>,
  Labels extends string = string,
  Input extends Record<string, any> = Record<string, any>
>({
  actorType,
  actorName,
  actorConfig,
  crawlerConfigDefaults,
  crawlerConfigOverrides,
  sentryOptions,
  onActorReady,
}: {
  /** String idetifying the actor class, e.g. `'cheerio'` */
  actorType: TCrawlerType;
  actorName: string;
  /** Config passed to the {@link createApifyActor} */
  actorConfig: Omit<ActorDefinition<Ctx, Labels, Input>, 'router' | 'createCrawler'> &
    Partial<Pick<ActorDefinition<Ctx, Labels, Input>, 'router' | 'createCrawler'>>;
  /**
   * If using default `createCrawler` implementation, these are crawler options
   * that may be overriden by user input.
   */
  crawlerConfigDefaults?: CrawlerMeta<TCrawlerType, any>['options'];
  /**
   * If using default `createCrawler` implementation, these are crawler options
   * that will override user input.
   *
   * This is useful for testing env.
   */
  crawlerConfigOverrides?: CrawlerMeta<TCrawlerType, any>['options'];
  /**
   * Sentry configuration. If using default `createCrawler` implementation,
   * failed requests are optionally reported to Sentry.
   *
   * To disable Sentry, set `"enabled": false`.
   */
  sentryOptions?: Sentry.NodeOptions;
  /**
   * Callback with the created actor. The callback is called within
   * the `Actor.main()` context.
   */
  onActorReady?: (actor: ActorContext<Ctx, Labels, Input>) => MaybePromise<void>;
}): Promise<void> => {
  setupSentry({ ...sentryOptions, serverName: actorName });

  // See docs:
  // - https://docs.apify.com/sdk/js/
  // - https://docs.apify.com/academy/deploying-your-code/inputs-outputs#accepting-input-with-the-apify-sdk
  // - https://docs.apify.com/sdk/js/docs/upgrading/upgrading-to-v3#apify-sdk
  await Actor.main(
    async () => {
      const actorDefaults: ActorDefinition<Ctx, Labels, Input & AllInputs> = {
        router: Router.create<Ctx>(),
        routerWrappers: ({ input }) => [
          logLevelHandlerWrapper<Ctx, any>(input?.logLevel ?? 'info'),
        ],
        createCrawler: ({ router, proxy, input }) => {
          const options = createHttpCrawlerOptions<
            CrawlerMeta<TCrawlerType, any>['options'],
            Input
          >({
            input,
            defaults: crawlerConfigDefaults,
            overrides: {
              requestHandler: router,
              proxyConfiguration: proxy,
              // Capture errors as a separate Apify/Actor dataset and pass errors to Sentry
              failedRequestHandler: createErrorHandler({
                reportingDatasetId: input?.errorReportingDatasetId ?? 'REPORTING',
                sendToSentry: input?.errorSendToSentry ?? true,
              }),
              ...crawlerConfigOverrides,
            },
          });
          const CrawlerClass = actorClassByType[actorType] as any;
          return new CrawlerClass(options);
        },
        routes: [],
        routeHandlers: {} as any,
      };

      const actor = await createApifyActor<Ctx, Labels, Input>({
        ...actorConfig,
        router: actorConfig.router ?? (actorDefaults.router as any),
        routerWrappers: actorConfig.routerWrappers ?? (actorDefaults.routerWrappers as any),
        createCrawler: actorConfig.createCrawler ?? actorDefaults.createCrawler,
      });

      await onActorReady?.(actor);
    },
    { statusMessage: 'Crawling finished!' }
  );
};

/** Given the actor input, create common crawler options. */
export const createHttpCrawlerOptions = <
  TOpts extends BasicCrawlerOptions<any> = BasicCrawlerOptions,
  Input extends Record<string, any> = Record<string, any>
>({
  input,
  defaults,
  overrides,
}: {
  /** Actor input */
  input: Input | null;
  /**
   * Default config options set by us. These may be overriden
   * by values from actor input (set by user).
   */
  defaults?: TOpts;
  /**
   * These config options will overwrite both the default and user
   * options. This is useful for hard-setting values e.g. in tests.
   */
  overrides?: TOpts;
}) => {
  const pickCrawlerInputFields = <T extends CrawlerConfigActorInput>(config: T) =>
    pick(config, Object.keys(crawlerInput));

  return {
    // ----- 1. DEFAULTS -----
    ...omitBy(defaults ?? ({} as TOpts), (field) => field === undefined),
    // ----- 2. CONFIG FROM INPUT -----
    ...omitBy(pickCrawlerInputFields(input ?? {}), (field) => field === undefined),
    // ----- 3. OVERRIDES - E.G. TEST CONFIG -----
    ...omitBy(overrides ?? ({} as TOpts), (field) => field === undefined),
  } satisfies Partial<TOpts>;
};
