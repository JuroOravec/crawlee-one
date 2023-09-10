import {
  RouterHandler,
  BasicCrawlerOptions,
  Router,
  Log,
  Request as CrawleeRequest,
} from 'crawlee';
import { omitBy, pick, defaults } from 'lodash';
import { gotScraping } from 'got-scraping';

import type { CrawlerMeta, CrawlerType } from '../../types';
import { actorClassByType } from '../../constants';
import type { MaybePromise, PickPartial } from '../../utils/types';
import { createErrorHandler } from '../error/errorHandler';
import { type PushDataOptions, itemCacheKey, pushData } from '../io/pushData';
import { getColumnFromDataset } from '../io/dataset';
import { PushRequestsOptions, pushRequests } from '../io/pushRequests';
import type { CrawleeOneIO } from '../integrations/types';
import { apifyIO } from '../integrations/apify';
import { registerHandlers, setupDefaultHandlers } from '../router/router';
import {
  CrawlerConfigActorInput,
  OutputActorInput,
  MetamorphActorInput,
  PrivacyActorInput,
  crawlerInput,
  StartUrlsActorInput,
  InputActorInput,
  RequestActorInput,
  LoggingActorInput,
} from '../input';
import { logLevelHandlerWrapper, logLevelToCrawlee } from '../log';
import type {
  CrawleeOneActorInst,
  CrawleeOneActorDef,
  CrawleeOneHookCtx,
  CrawleeOneActorRouterCtx,
  Metamorph,
  RunCrawler,
  CrawleeOneCtx,
  CrawleeOneHookFn,
  CrawleeOneActorDefWithInput,
} from './types';

const isRouter = (r: any): r is RouterHandler<any> => {
  return !!((r as RouterHandler)?.addHandler && (r as RouterHandler)?.addDefaultHandler);
};

const isFunc = (f: any): f is (...args: any[]) => any => {
  return typeof f === 'function';
};

/** Run a function that was defined as a string via Actor input */
const genHookFn = <
  TArgs extends any[] = [],
  TReturn = unknown,
  T extends CrawleeOneCtx = CrawleeOneCtx
>(
  actor: Pick<CrawleeOneActorInst<T>, 'input' | 'state' | 'io'>,
  fnOrStr: string | CrawleeOneHookFn<TArgs, TReturn, T> | undefined | null,
  funcName: string
) => {
  if (!fnOrStr) return null;

  const hookCtx = {
    io: actor.io,
    input: actor.input,
    state: actor.state,
    itemCacheKey,
    sendRequest: gotScraping,
  } satisfies CrawleeOneHookCtx<T>;

  const hookFn = (typeof fnOrStr === 'function'
    ? fnOrStr
    : eval(fnOrStr) as unknown
  ) // prettier-ignore
  if (!hookFn) return null;
  if (typeof hookFn !== 'function') {
    throw Error(`Hook "${funcName}" is not a function, got ${typeof hookFn} instead: ${hookFn}`);
  }

  // NOTE: If eval didn't return func, but something else, we want to let the code fail
  //
  return async (...args: TArgs) =>
    (hookFn as CrawleeOneHookFn<TArgs, TReturn, T>)(...args, hookCtx);
};

/**
 * Options available when creating default configuration for an opinionated Crawlee actor,
 * which is then run within Apify's `Actor.main()` context.
 *
 * Apify context can be replaced with custom implementation using the `actorConfig.io` option.
 *
 * Read more about what this actor does at {@link createCrawleeOne}.
 */
export interface RunCrawleeOneOptions<
  TType extends CrawlerType,
  T extends CrawleeOneCtx<CrawlerMeta<TType>['context']>
> {
  /** String idetifying the actor class, e.g. `'cheerio'` */
  actorType: TType;
  actorName?: string;
  /** Config passed to the {@link createCrawleeOne} */
  actorConfig: PickPartial<CrawleeOneActorDef<T>, 'router' | 'createCrawler' | 'io' | 'telemetry'>;
  /**
   * If using default `createCrawler` implementation, these are crawler options
   * that may be overriden by user input.
   */
  crawlerConfigDefaults?: Omit<CrawlerMeta<TType>['options'], 'requestHandler'>;
  /**
   * If using default `createCrawler` implementation, these are crawler options
   * that will override user input.
   *
   * This is useful for testing env.
   */
  crawlerConfigOverrides?: Omit<CrawlerMeta<TType>['options'], 'requestHandler'>;
  /**
   * Callback with the created actor. The callback is called within
   * the `Actor.main()` context.
   */
  onReady?: (actor: CrawleeOneActorInst<T>) => MaybePromise<void>;
}

/**
 * Create opinionated Crawlee crawler that uses, and run it within Apify's `Actor.main()` context.
 *
 * Apify context can be replaced with custom implementation using the `actorConfig.io` option.
 *
 * This function does the following for you:
 *
 * 1) Full TypeScript coverage - Ensure all components use the same Crawler / CrawlerContext.
 *
 * 2) Get Actor input from `io.getInput()`, which by default
 * corresponds to Apify's `Actor.getInput()`.
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
export const runCrawleeOne = async <
  TType extends CrawlerType,
  T extends CrawleeOneCtx<CrawlerMeta<TType>['context']>
>(
  args: RunCrawleeOneOptions<TType, T>
): Promise<void> => {
  const { actorType, actorConfig, crawlerConfigDefaults, crawlerConfigOverrides, onReady } = args;

  const { io = apifyIO as any as T['io'] } = actorConfig;

  // See docs:
  // - https://docs.apify.com/sdk/js/
  // - https://docs.apify.com/academy/deploying-your-code/inputs-outputs#accepting-input-with-the-apify-sdk
  // - https://docs.apify.com/sdk/js/docs/upgrading/upgrading-to-v3#apify-sdk
  await io.runInContext(
    async () => {
      const actorDefaults: Pick<
        CrawleeOneActorDef<T>,
        'router' | 'routeHandlerWrappers' | 'createCrawler'
      > = {
        router: Router.create<T['context']>(),
        routeHandlerWrappers: ({ input }) => [logLevelHandlerWrapper(input?.logLevel ?? 'info')],
        createCrawler: ({ router, proxy, input, telemetry }) => {
          const options = createHttpCrawlerOptions({
            input,
            defaults: crawlerConfigDefaults as BasicCrawlerOptions<T['context']>,
            overrides: {
              requestHandler: router,
              proxyConfiguration: proxy,
              // Capture errors in a separate (Apify) Dataset and pass errors to telemetry
              failedRequestHandler: createErrorHandler({
                io,
                reportingDatasetId: input?.errorReportingDatasetId ?? 'REPORTING',
                sendToTelemetry: input?.errorTelemetry ?? true,
                onSendErrorToTelemetry: telemetry?.onSendErrorToTelemetry,
              }),
              ...crawlerConfigOverrides,
            } as BasicCrawlerOptions<T['context']>,
          });
          const CrawlerClass = actorClassByType[actorType] as any;
          return new CrawlerClass(options);
        },
      };

      const actor = await createCrawleeOne({
        ...actorConfig,
        io,
        router: actorConfig.router ?? (actorDefaults.router as any),
        routeHandlerWrappers:
          actorConfig.routeHandlerWrappers ?? (actorDefaults.routeHandlerWrappers as any),
        createCrawler: actorConfig.createCrawler ?? (actorDefaults.createCrawler as any),
      });

      await onReady?.(actor);
    },
    { statusMessage: 'Crawling finished!' }
  );
};

/**
 * NOTE: If you want to run a scraper, see {@link runCrawleeOne}. This is lower-level
 * function that should be used only if you want to override the default behaviour of runCrawleeOne.
 *
 * Create opinionated Crawlee crawler that uses router for handling requests.
 *
 * This is a quality-of-life function that does the following for you:
 *
 * 1) Full TypeScript coverage - Ensure all components use the same Crawler / CrawlerContext.
 *
 * 2) Get Actor input from `io.getInput()`, which by default
 * corresponds to Apify's `Actor.getInput()`.
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
const createCrawleeOne = async <T extends CrawleeOneCtx>(
  config: PickPartial<CrawleeOneActorDef<T>, 'io'>
): Promise<CrawleeOneActorInst<T>> => {
  const { io = apifyIO as any as T['io'] } = config;

  // Mutable state that is available to the actor hooks
  const state = {};

  // Initialize actor inputs
  const input = await createActorInput({ ...config, io }, state);

  if (config.validateInput) await config.validateInput(input);

  const { logLevel } = (input ?? {}) as LoggingActorInput;
  const log = new Log({ level: logLevel ? logLevelToCrawlee[logLevel] : undefined });

  // This is context that is available to options that use initialization function
  const getConfig = () =>
    ({ ...config, input, state, io } satisfies CrawleeOneActorDefWithInput<T>);

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
  const router: RouterHandler<T['context']> = isRouter(config.router)
    ? config.router
    : await (config.router as any)(getConfig());
  const routes = isFunc(config.routes) ? await config.routes(getConfig()) : config.routes; // prettier-ignore
  const routeHandlerWrappers = isFunc(config.routeHandlerWrappers) ? await config.routeHandlerWrappers(getConfig()) : config.routeHandlerWrappers; // prettier-ignore
  const telemetry = isFunc(config.telemetry) ? await config.telemetry(getConfig()) : config.telemetry; // prettier-ignore

  // NOTE: TypeScript workaround!
  // Issue - We need to initialize functions that themselves may become available via the "Actor Context"
  // Solution - We provide the "Actor Context" indirectly via getter, so the dependants can use
  //            the latest version of the object.
  // To do that, we store the latest version of the context and add fields to it as we go.
  // HOWEVER, TypeScript doesn't like that. So we use a "factory function" to declare what type
  // is made avaialble via the getter.
  let actorCtx = {} as any;
  const actorCtxFactory = <Ctx extends Partial<CrawleeOneActorInst<T>>>(newActorCtx: Ctx) => {
    actorCtx = { ...newActorCtx };
    return (): Ctx => ({ ...actorCtx });
  };

  const getPreActorNoCrawler = actorCtxFactory({
    io,
    telemetry,
    router,
    routes,
    proxy,
    config,
    input,
    state,
    log,
    handlerCtx: null,
  } satisfies Omit<CrawleeOneActorInst<T>, 'crawler' | 'runCrawler' | 'metamorph' | 'pushData' | 'pushRequests' | 'startUrls'>);

  // Create Crawlee crawler
  const crawler = await config.createCrawler(getPreActorNoCrawler());
  const getPreActor = actorCtxFactory({ ...getPreActorNoCrawler(), crawler });

  // Create actor (our custom entity)
  const actor: CrawleeOneActorInst<T> = {
    ...getPreActor(),
    runCrawler: createScopedCrawlerRun(getPreActor),
    metamorph: createScopedMetamorph(getPreActor),
    pushData: createScopedPushData(getPreActor),
    pushRequests: createScopedPushRequests(getPreActor),
    startUrls: await getStartUrlsFromInput(getPreActor()),
  };

  // Extra data that we make available to the route handlers
  const routerContext: CrawleeOneActorRouterCtx<T> = {
    actor,
    metamorph: actor.metamorph,
    pushData: actor.pushData,
    pushRequests: actor.pushRequests,
  };

  // Set up router
  await setupDefaultHandlers<T, CrawleeOneActorRouterCtx<T>>({
    onSetCtx: (ctx) => {
      actorCtx.handlerCtx = ctx;
    },
    io,
    router,
    routeHandlerWrappers,
    routerContext,
    routes,
    input,
  });

  // Register labelled handlers
  await registerHandlers<T, CrawleeOneActorRouterCtx<T>>(router, routes, {
    routerContext,
    handlerWrappers: routeHandlerWrappers,
    onSetCtx: (ctx) => {
      actorCtx.handlerCtx = ctx;
    },
  });

  // Prepare telemetry
  const isEnabled = await actor.io.isTelemetryEnabled();
  if (isEnabled) {
    await telemetry?.setup(actor);
  }

  // Now that the actor is ready, enqueue the URLs right away
  await actor.pushRequests(actor.startUrls as CrawleeRequest[]);

  return actor;
};

const createActorInput = async <T extends CrawleeOneCtx>(
  config: CrawleeOneActorDef<T>,
  state: Record<string, any>
) => {
  // Initialize actor inputs
  const rawInput = !config.input
    ? {}
    : isFunc(config.input)
    ? await config.input(config)
    : config.input;

  const rawInputDefaults = !config.inputDefaults
    ? {}
    : isFunc(config.inputDefaults)
    ? await config.inputDefaults(config)
    : config.inputDefaults;

  // This is equivalent to Apify's `Actor.getInput()` and it is used so that
  // input can be configured not only by scraper developers, but also scraper users,
  // e.g. via Apify platform.
  const inputFromIO =
    config.input && !config.mergeInput ? {} : await config.io.getInput<T['input']>();

  // Define whether to take input from the user (AKA from the env vars via `inputFromIO`)
  // or from the deeloper that called this scraper (AKA from the `input` argument).
  // NOTE: Uses both if `config.mergeInput` is truthy
  const inputMergeFn = config.mergeInput
    ? typeof config.mergeInput === 'function'
      ? config.mergeInput
      : ({ defaults, overrides, env }) => ({ ...defaults, ...env, ...overrides })
    : config.input
    ? ({ defaults, overrides }) => ({ ...defaults, ...overrides })
    : ({ defaults, env }) => ({ ...defaults, ...env });

  const mergedInput = inputMergeFn({ defaults: rawInputDefaults, env: inputFromIO ?? {}, overrides: rawInput ?? {} }); // prettier-ignore

  // Next, we allow to enrich the input we already have by downloading remote inputs
  // or generating it from a user-defined function.
  const input = Object.freeze(await resolveInput<T['input'] | null>(mergedInput, config.io, state));

  return input;
};

const resolveInput = async <T extends Record<string, any> | null>(
  input: object | null,
  io: CrawleeOneIO,
  state: Record<string, unknown>
) => {
  const { inputExtendUrl, inputExtendFromFunction } = (input ?? {}) as InputActorInput;

  const inputFromUrl = inputExtendUrl ? await gotScraping.get(inputExtendUrl).json<object>() : null;
  const inputFn = genHookFn({ state, input, io }, inputExtendFromFunction, 'inputExtendFromFunction'); // prettier-ignore
  const inputFromFunc = (await inputFn?.()) ?? null;
  const extendedInput = { ...inputFromUrl, ...inputFromFunc, ...input };

  return extendedInput as T;
};

/**
 * Create a function that wraps `crawler.run(requests, runOtions)` with additional
 * features like:
 * - Automatically metamorph into another actor after the run finishes
 */
const createScopedCrawlerRun = <T extends CrawleeOneCtx>(
  getActor: () => Omit<
    CrawleeOneActorInst<T>,
    'runCrawler' | 'metamorph' | 'pushData' | 'pushRequests' | 'startUrls'
  >
) => {
  const metamorph = createScopedMetamorph(getActor);

  const runCrawler: RunCrawler<T['context']> = async (requests, options) => {
    const actor = getActor();
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

    // Clear cache if it was set from the input
    if (outputCacheStoreId && outputCacheActionOnResult === 'overwrite') {
      const store = await actor.io.openKeyValueStore(outputCacheStoreId);
      await store.drop();
    }

    await genHookFn(actor, outputTransformBefore, 'outputTransformBefore')?.(); // prettier-ignore
    await genHookFn(actor, outputFilterBefore, 'outputFilterBefore')?.(); // prettier-ignore
    await genHookFn(actor, requestTransformBefore, 'requestTransformBefore')?.(); // prettier-ignore
    await genHookFn(actor, requestFilterBefore, 'requestFilterBefore')?.(); // prettier-ignore

    const runRes = await actor.crawler.run(requests, options);

    await genHookFn(actor, outputTransformAfter, 'outputTransformAfter')?.(); // prettier-ignore
    await genHookFn(actor, outputFilterAfter, 'outputFilterAfter')?.(); // prettier-ignore
    await genHookFn(actor, requestTransformAfter, 'requestTransformAfter')?.(); // prettier-ignore
    await genHookFn(actor, requestFilterAfter, 'requestFilterAfter')?.(); // prettier-ignore

    // Trigger metamorph if it was set from the input
    await metamorph();

    return runRes;
  };

  return runCrawler;
};

/** Create a function that triggers metamorph, using Actor's inputs as defaults. */
const createScopedMetamorph = <T extends CrawleeOneCtx>(
  getActor: () => Pick<CrawleeOneActorInst<T>, 'input' | 'io'>
) => {
  // Trigger metamorph if it was set from the input
  const metamorph: Metamorph = async (overrides?: MetamorphActorInput) => {
    const actor = getActor();
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
const createScopedPushData = <T extends CrawleeOneCtx>(
  getActor: () => Pick<CrawleeOneActorInst<T>, 'input' | 'state' | 'io' | 'log' | 'handlerCtx'>
) => {
  const scopedPushData: CrawleeOneActorInst<T>['pushData'] = async (entries, options) => {
    const actor = getActor();
    const handlerCtx = actor.handlerCtx;
    if (!handlerCtx) {
      throw Error(
        'Function pushData scoped to crawler instance was called outside of the crawling context'
      );
    }

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

    const transformFn = genHookFn(actor, outputTransform, 'outputTransform');
    const filterFn = genHookFn(actor, outputFilter, 'outputFilter');

    const mergedOptions = {
      io: actor.io,
      log: actor.log,
      showPrivate: includePersonalData,
      maxCount: outputMaxEntries,
      pickKeys: outputPickFields,
      remapKeys: outputRenameFields,
      transform: transformFn ?? undefined,
      filter: filterFn ?? undefined,
      datasetId: outputDatasetId,
      requestQueueId,
      cacheStoreId: outputCacheStoreId,
      cachePrimaryKeys: outputCachePrimaryKeys,
      cacheActionOnResult: outputCacheActionOnResult,
      ...options,
    } satisfies PushDataOptions<object>;

    return pushData(handlerCtx, entries, mergedOptions);
  };

  return scopedPushData;
};

/** pushRequests wrapper that pre-populates options based on actor input */
const createScopedPushRequests = <T extends CrawleeOneCtx>(
  getActor: () => Pick<CrawleeOneActorInst<T>, 'input' | 'state' | 'io' | 'log'>
) => {
  const scopedPushRequest: CrawleeOneActorInst<T>['pushRequests'] = async (entries, options) => {
    const actor = getActor();
    const { requestQueueId, requestMaxEntries, requestTransform, requestFilter } = (actor.input ??
      {}) as RequestActorInput;

    const transformFn = genHookFn(actor, requestTransform, 'requestTransform');
    const filterFn = genHookFn(actor, requestFilter, 'requestFilter');

    const mergedOptions = {
      io: actor.io,
      log: actor.log,
      maxCount: requestMaxEntries,
      transform: transformFn ?? undefined,
      filter: filterFn ?? undefined,
      requestQueueId,
      ...options,
    } satisfies PushRequestsOptions<any>;

    return pushRequests<any>(entries, mergedOptions);
  };

  return scopedPushRequest;
};

/** Given the actor input, create common crawler options. */
export const createHttpCrawlerOptions = <
  T extends CrawleeOneCtx,
  TOpts extends BasicCrawlerOptions<T['context']>
>({
  input,
  defaults,
  overrides,
}: {
  /** Actor input */
  input: T['input'] | null;
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

const getStartUrlsFromInput = async <T extends CrawleeOneCtx>(
  actor: Pick<CrawleeOneActorInst<T>, 'input' | 'state' | 'io' | 'log'>
) => {
  const { startUrls, startUrlsFromDataset, startUrlsFromFunction } = (actor.input ??
    {}) as StartUrlsActorInput;

  const urlsAgg = [...(startUrls ?? [])];

  if (startUrlsFromDataset) {
    actor.log.debug(`Loading start URLs from Dataset ${startUrlsFromDataset}`);
    const [datasetId, field] = startUrlsFromDataset.split('#');
    const urlsFromDataset = await getColumnFromDataset<any>(datasetId, field, { io: actor.io });
    urlsAgg.push(...urlsFromDataset);
  }

  if (startUrlsFromFunction) {
    actor.log.debug(`Loading start URLs from function`);
    const urlsFromFn =
      (await genHookFn(actor, startUrlsFromFunction, 'startUrlsFromFunction')?.()) ?? [];
    if (!Array.isArray(urlsFromFn)) {
      throw Error(
        `Hook "startUrlsFromFunction" must return an array of URLs or Requests, got ${urlsFromFn}`
      );
    }
    urlsAgg.push(...urlsFromFn);
  }

  return urlsAgg;
};
