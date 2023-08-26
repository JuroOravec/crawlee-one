import {
  BasicCrawler,
  CrawlingContext,
  RouterHandler,
  BasicCrawlerOptions,
  CheerioCrawler,
  Router,
  HttpCrawler,
  JSDOMCrawler,
  PlaywrightCrawler,
  PuppeteerCrawler,
} from 'crawlee';
import { omitBy, pick, defaults } from 'lodash';
import * as Sentry from '@sentry/node';
import { gotScraping } from 'got-scraping';

import type { CrawlerMeta, CrawlerType } from '../../types';
import type { MaybePromise, PickPartial } from '../../utils/types';
import { createErrorHandler } from '../error/errorHandler';
import { setupSentry } from '../error/sentry';
import { type PushDataOptions, itemCacheKey, pushData } from '../io/pushData';
import { getColumnFromDataset } from '../io/dataset';
import { PushRequestsOptions, pushRequests } from '../io/pushRequests';
import type { CrawleeOneIO } from '../integrations/types';
import { apifyIO } from '../integrations/apify';
import { registerHandlers, setupDefaultRoute } from '../router';
import {
  CrawlerConfigActorInput,
  OutputActorInput,
  MetamorphActorInput,
  PrivacyActorInput,
  crawlerInput,
  StartUrlsActorInput,
  InputActorInput,
  RequestActorInput,
  AllActorInputs,
} from '../config';
import { logLevelHandlerWrapper } from '../log';
import type {
  ActorContext,
  ActorDefinition,
  ActorHookContext,
  ActorRouterContext,
  Metamorph,
  RunCrawler,
} from './types';

const actorClassByType = {
  basic: BasicCrawler,
  http: HttpCrawler,
  cheerio: CheerioCrawler,
  jsdom: JSDOMCrawler,
  playwright: PlaywrightCrawler,
  puppeteer: PuppeteerCrawler,
} satisfies Record<CrawlerType, { new (options: Record<string, any>): any }>;

const isRouter = (r: any): r is RouterHandler<any> => {
  return !!((r as RouterHandler).addHandler && (r as RouterHandler).addDefaultHandler);
};
const isFunc = (f: any): f is (...args: any[]) => any => {
  return typeof f === 'function';
};

/** Run a function that was defined as a string via Actor input */
const genHookFn = <
  Ctx extends CrawlingContext<any> = CrawlingContext<BasicCrawler>,
  Labels extends string = string,
  Input extends Record<string, any> = Record<string, any>,
  TIO extends CrawleeOneIO = CrawleeOneIO
>(
  actor: Pick<ActorContext<Ctx, Labels, Input, TIO>, 'input' | 'state' | 'io'>,
  fnStr?: string
) => {
  if (!fnStr) return null;

  const hookCtx = {
    io: actor.io,
    input: actor.input,
    state: actor.state,
    itemCacheKey,
    sendRequest: gotScraping,
  } satisfies ActorHookContext<TIO>;

  const hookFn = eval(fnStr);
  if (!hookFn) return null;

  return async (...args) => hookFn(...args, hookCtx);
};

/**
 * Create default configuration for an opinionated Crawlee actor,
 * and run the actor within Apify's `Actor.main()` context.
 *
 * Apify context can be replaced with custom implementation using the `actorConfig.io` option.
 *
 * Read more about what this actor does at {@link createCrawleeOne}.
 */
export const createAndRunCrawleeOne = async <
  TCrawlerType extends CrawlerType,
  Ctx extends CrawlerMeta<TCrawlerType, any>['context'] = CrawlingContext<BasicCrawler>,
  Labels extends string = string,
  Input extends Record<string, any> = Record<string, any>,
  TIO extends CrawleeOneIO = CrawleeOneIO
>(input: {
  /** String idetifying the actor class, e.g. `'cheerio'` */
  actorType: TCrawlerType;
  actorName: string;
  /** Config passed to the {@link createCrawleeOne} */
  actorConfig: PickPartial<
    ActorDefinition<Ctx, Labels, Input, TIO>,
    'router' | 'createCrawler' | 'io'
  >;
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
  onActorReady?: (actor: ActorContext<Ctx, Labels, Input, TIO>) => MaybePromise<void>;
}): Promise<void> => {
  const {
    actorType,
    actorName,
    actorConfig,
    crawlerConfigDefaults,
    crawlerConfigOverrides,
    sentryOptions,
    onActorReady,
  } = input;

  const { io = apifyIO as any as TIO } = actorConfig;

  await setupSentry({ ...sentryOptions, serverName: actorName }, { io });

  // See docs:
  // - https://docs.apify.com/sdk/js/
  // - https://docs.apify.com/academy/deploying-your-code/inputs-outputs#accepting-input-with-the-apify-sdk
  // - https://docs.apify.com/sdk/js/docs/upgrading/upgrading-to-v3#apify-sdk
  await io.runInContext(
    async () => {
      const actorDefaults: ActorDefinition<Ctx, Labels, Input & AllActorInputs, TIO> = {
        io,
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
              // Capture errors in a separate (Apify) Dataset and pass errors to Sentry
              failedRequestHandler: createErrorHandler({
                io,
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

      const actor = await createCrawleeOne<Ctx, Labels, Input, TIO>({
        ...actorConfig,
        io,
        router: actorConfig.router ?? (actorDefaults.router as any),
        routerWrappers: actorConfig.routerWrappers ?? (actorDefaults.routerWrappers as any),
        createCrawler: actorConfig.createCrawler ?? (actorDefaults.createCrawler as any),
      });

      await onActorReady?.(actor);
    },
    { statusMessage: 'Crawling finished!' }
  );
};

/**
 * Create opinionated Crawlee crawler that uses router for handling requests.
 *
 * This is a quality-of-life function that does the following for you:
 *
 * 1) Full TypeScript coverage - Ensure all components use the same Crawler / CrawlerContext.
 *
 * 2) Get Actor input from `Actor.getInput` if not given.
 *
 * 3) (Optional) Validate Actor input
 *
 * 4) Set up router such that requests that reach default route are
 * redirected to labelled routes based on which item from "routes" they match.
 *
 * 5) Register all route handlers for you.
 *
 * 6) (Optional) Wrap all route handlers in a wrapper. Use this e.g.
 * if you want to add a field to the context object, or handle errors
 * from a single place.
 *
 * 7) (Optional) Support transformation and filtering of (scraped) entries,
 * configured via Actor input.
 *
 * 8) (Optional) Support Actor metamorphing, configured via Actor input.
 *
 * 9) Apify context (e.g. calling `Actor.getInput`) can be replaced with custom
 *  implementation using the `io` option.
 */
export const createCrawleeOne = async <
  Ctx extends CrawlingContext = CrawlingContext<BasicCrawler>,
  Labels extends string = string,
  Input extends Record<string, any> = Record<string, any>,
  TIO extends CrawleeOneIO = CrawleeOneIO
>(
  config: PickPartial<ActorDefinition<Ctx, Labels, Input, TIO>, 'io'>
): Promise<ActorContext<Ctx, Labels, Input, TIO>> => {
  const { io = apifyIO as any as TIO } = config;

  // Mutable state that is available to the actor hooks
  const state = {};

  // Initialize actor inputs
  const rawInput = config.input
    ? isFunc(config.input)
      ? await config.input({ ...config, io })
      : config.input
    : await io.getInput<Input>();
  const input = Object.freeze(await resolveInput<Input | null>(rawInput, state, { io }));

  if (config.validateInput) await config.validateInput(input);

  // This is context that is available to options that use initialization function
  const getConfig = () => ({ ...config, input, state, io });

  // Set up proxy
  const defaultProxy =
    config.proxy == null ? await io.createDefaultProxyConfiguration(input ?? undefined) : undefined;
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
  const getActorCtx = () => ({
    io,
    router,
    routes,
    routeHandlers,
    proxy,
    config,
    input,
    state,
  });
  const crawler = await config.createCrawler(getActorCtx());

  // Create actor (our custom entity)
  const preActor = { crawler, ...getActorCtx() };
  const runCrawler = createScopedCrawlerRun(preActor);
  const metamorph = createScopedMetamorph(preActor);
  const scopedPushData = createScopedPushData(preActor);
  const scopedPushRequest = createScopedPushRequests(preActor);
  const startUrls = await getStartUrlsFromInput(preActor);

  const actor = {
    ...preActor,
    crawler,
    runCrawler,
    metamorph,
    pushData: scopedPushData,
    pushRequests: scopedPushRequest,
    startUrls,
  } satisfies ActorContext<Ctx, Labels, Input, TIO>;

  // Extra data that we make available to the route handlers
  const routerContext = { actor, pushData: scopedPushData };

  // Set up router
  await setupDefaultRoute<Ctx, ActorRouterContext<Ctx, Labels, Input, TIO>, Labels, Input>({
    io,
    router,
    routerWrappers,
    routerContext,
    routes,
    routeHandlers,
    input,
  });
  await registerHandlers<Ctx, ActorRouterContext<Ctx, Labels, Input, TIO>, Labels>({
    router,
    routerWrappers,
    routerContext,
    routeHandlers,
  });

  return actor;
};

const resolveInput = async <T extends Record<string, any> | null>(
  input: object | null,
  state: Record<string, unknown>,
  options?: { io?: CrawleeOneIO }
) => {
  const { io = apifyIO as CrawleeOneIO } = options ?? {};
  const { inputExtendUrl, inputExtendFromFunction } = (input ?? {}) as InputActorInput;

  const inputFromUrl = inputExtendUrl ? await gotScraping.get(inputExtendUrl).json<object>() : null;
  const inputFn = genHookFn({ state, input, io }, inputExtendFromFunction);
  const inputFromFunc = (await inputFn?.()) ?? null;
  const extendedInput = { ...inputFromUrl, ...inputFromFunc, ...input };

  return extendedInput as T;
};

/**
 * Create a function that wraps `crawler.run(requests, runOtions)` with additional
 * features like:
 * - Automatically metamorph into another actor after the run finishes
 */
const createScopedCrawlerRun = <
  Ctx extends CrawlingContext<any> = CrawlingContext<BasicCrawler>,
  Labels extends string = string,
  Input extends Record<string, any> = Record<string, any>,
  TIO extends CrawleeOneIO = CrawleeOneIO
>(
  actor: Omit<
    ActorContext<Ctx, Labels, Input, TIO>,
    'runCrawler' | 'metamorph' | 'pushData' | 'pushRequests' | 'startUrls'
  >
) => {
  const {
    requestTransformBefore,
    requestTransformAfter,
    requestFilterBefore,
    requestFilterAfter,
    outputTransformBefore,
    outputTransformAfter,
    outputFilterBefore,
    outputFilterAfter,
    outputCacheStoreId,
    outputCacheActionOnResult,
  } = (actor.input ?? {}) as OutputActorInput & RequestActorInput;

  const metamorph = createScopedMetamorph(actor);

  const runCrawler: RunCrawler<Ctx> = async (requests, options) => {
    // Clear cache if it was set from the input
    if (outputCacheStoreId && outputCacheActionOnResult === 'overwrite') {
      const store = await actor.io.openKeyValueStore(outputCacheStoreId);
      await store.drop();
    }

    await genHookFn(actor, outputTransformBefore)?.();
    await genHookFn(actor, outputFilterBefore)?.();
    await genHookFn(actor, requestTransformBefore)?.();
    await genHookFn(actor, requestFilterBefore)?.();

    const runRes = await actor.crawler.run(requests, options);

    await genHookFn(actor, outputTransformAfter)?.();
    await genHookFn(actor, outputFilterAfter)?.();
    await genHookFn(actor, requestTransformAfter)?.();
    await genHookFn(actor, requestFilterAfter)?.();

    // Trigger metamorph if it was set from the input
    await metamorph();

    return runRes;
  };

  return runCrawler;
};

/** Create a function that triggers metamorph, using Actor's inputs as defaults. */
const createScopedMetamorph = (actor: Pick<ActorContext, 'input' | 'io'>) => {
  // Trigger metamorph if it was set from the input
  const metamorph: Metamorph = async (overrides?: MetamorphActorInput) => {
    const {
      metamorphActorId,
      metamorphActorBuild,
      metamorphActorInput,
    } = defaults({}, overrides, actor.input ?? {}); // prettier-ignore

    if (!metamorphActorId) return;

    await actor.io.triggerDownstreamCrawler(metamorphActorId, metamorphActorInput, {
      build: metamorphActorBuild,
    });
  };

  return metamorph;
};

/** pushData wrapper that pre-populates options based on actor input */
const createScopedPushData = (actor: Pick<ActorContext, 'input' | 'state' | 'io'>) => {
  const {
    includePersonalData,
    requestQueueId,
    outputMaxEntries,
    outputTransform,
    outputFilter,
    outputDatasetId,
    outputPickFields,
    outputRenameFields,
    outputCacheStoreId,
    outputCachePrimaryKeys,
    outputCacheActionOnResult,
  } = (actor.input ?? {}) as OutputActorInput & PrivacyActorInput & RequestActorInput;

  const scopedPushData: ActorContext['pushData'] = async (entries, ctx, options) => {
    const transformFn = genHookFn(actor, outputTransform);
    const filterFn = genHookFn(actor, outputFilter);

    const mergedOptions = {
      io: actor.io,
      showPrivate: includePersonalData,
      maxCount: outputMaxEntries,
      pickKeys: outputPickFields,
      remapKeys: outputRenameFields,
      transform: transformFn ? (item) => transformFn(item) : undefined,
      filter: filterFn ? (item) => filterFn(item) : undefined,
      datasetId: outputDatasetId,
      requestQueueId,
      cacheStoreId: outputCacheStoreId,
      cachePrimaryKeys: outputCachePrimaryKeys,
      cacheActionOnResult: outputCacheActionOnResult,
      ...options,
    } satisfies PushDataOptions<object>;

    return pushData(entries, ctx, mergedOptions);
  };

  return scopedPushData;
};

/** pushRequests wrapper that pre-populates options based on actor input */
const createScopedPushRequests = (actor: Pick<ActorContext, 'input' | 'state' | 'io'>) => {
  const { requestQueueId, requestMaxEntries, requestTransform, requestFilter } = (actor.input ??
    {}) as RequestActorInput;

  const scopedPushRequest: ActorContext['pushRequests'] = async (entries, ctx, options) => {
    const transformFn = genHookFn(actor, requestTransform);
    const filterFn = genHookFn(actor, requestFilter);

    const mergedOptions = {
      io: actor.io,
      maxCount: requestMaxEntries,
      transform: transformFn ? (item) => transformFn(item) : undefined,
      filter: filterFn ? (item) => filterFn(item) : undefined,
      requestQueueId,
      ...options,
    } satisfies PushRequestsOptions<any>;

    return pushRequests(entries, ctx, mergedOptions);
  };

  return scopedPushRequest;
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

const getStartUrlsFromInput = async (actor: Pick<ActorContext, 'input' | 'state' | 'io'>) => {
  const { startUrls, startUrlsFromDataset, startUrlsFromFunction } = (actor.input ??
    {}) as StartUrlsActorInput;

  const urlsAgg = [...(startUrls ?? [])];

  if (startUrlsFromDataset) {
    const [datasetId, field] = startUrlsFromDataset.split('#');
    const urlsFromDataset = await getColumnFromDataset<any>(datasetId, field, { io: actor.io });
    urlsAgg.push(...urlsFromDataset);
  }

  if (startUrlsFromFunction) {
    const urlsFromFn = await genHookFn(actor, startUrlsFromFunction)?.();
    urlsAgg.push(...urlsFromFn);
  }

  return urlsAgg;
};
