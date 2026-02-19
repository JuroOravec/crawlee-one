import {
  RouterHandler,
  BasicCrawlerOptions,
  Router,
  Log,
  LogLevel,
  Request as CrawleeRequest,
} from 'crawlee';
import { omitBy, pick, defaults } from 'lodash-es';
import { gotScraping } from 'got-scraping';
import { z } from 'zod';

import type { CrawlerMeta, CrawlerType } from '../../types.js';
import { actorClassByType } from '../../constants.js';
import type { MaybePromise, PickPartial } from '../../utils/types.js';
import { createErrorHandler } from '../error/errorHandler.js';
import { type PushDataOptions, itemCacheKey, pushData } from '../io/pushData.js';
import { getColumnFromDataset } from '../io/dataset.js';
import { AddRequestsOptions, addRequests } from '../io/addRequests.js';
import type { CrawleeOneIO } from '../integrations/types.js';
import { apifyIO } from '../integrations/apify.js';
import { devContextStore } from '../dev/devContextStore.js';
import { registerHandlers, setupDefaultHandlers } from '../router/router.js';
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
  LlmActorInput,
} from '../input.js';
import { createExtractWithLlmForContext } from '../llmExtract/extractWithLlmScoped.js';
import { getLlmIds } from '../llmExtract/utils.js';
import { orchestrateWithLlm } from '../llmExtract/orchestrate.js';
import { logLevelHandlerWrapper, logLevelToCrawlee } from '../log.js';
import type {
  CrawleeOneContext,
  CrawleeOneInternalOptions,
  CrawleeOneHookCtx,
  CrawleeOneRouteHandlerCtxExtras,
  Metamorph,
  RunCrawler,
  CrawleeOneTypes,
  CrawleeOneHookFn,
  CrawleeOneInternalOptionsWithInput,
} from './types.js';
import type { CrawleeOneRouteHandler, CrawleeOneRoute } from '../router/types.js';

/** Options object passed to `crawleeOne` */
export interface CrawleeOneOptions<
  TType extends CrawlerType,
  T extends CrawleeOneTypes<CrawlerMeta<TType>['context']>
> {
  /** Type specifying the Crawlee crawler class, input options, and more. */
  type: CrawlerType;
  /** Unique name of the crawler instance. The name may be used in codegen and logging. */
  name?: string;

  /** Crawler configuration that is applied at the end and overrides `crawlerConfigDefaults` and `input` settings. */
  crawlerConfigOverrides?: Omit<CrawlerMeta<TType>['options'], 'requestHandler'>;
  /** Default crawler configuration that may be overriden via `input` and `crawlerConfigOverrides` */
  crawlerConfigDefaults?: Omit<CrawlerMeta<TType>['options'], 'requestHandler'>;

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
  mergeInput?: boolean | ((sources: {
    defaults: Partial<T['input']>;
    overrides: Partial<T['input']>;
    env: Partial<T['input']>;
  }) => MaybePromise<Partial<T['input']>>);
  /** Input configuration that CANNOT be overriden via `inputDefaults` and `io.getInput()` */
  input?: Partial<T['input']>;
  /** Input configuration that CAN be overriden via `input` and `io.getInput()` */
  inputDefaults?: Partial<T['input']>;
  /**
   * Field objects with embedded Zod schemas for input validation.
   * If provided, input is validated against these schemas automatically.
   */
  inputFields?: CrawleeOneInternalOptions<T>['inputFields'];

  // /////// Override services /////////
  /**
   * Configure the Crawlee proxy.
   *
   * See {@link ProxyConfiguration}
   */
  proxy?: CrawleeOneInternalOptions<T>['proxy'];
  /**
   * Provide a telemetry instance that is used for tracking errors.
   *
   * See {@link CrawleeOneTelemetry}
   */
  telemetry?: CrawleeOneInternalOptions<T>['telemetry'];
  /**
   * Provide an instance that is responsible for state management:
   * - Adding scraped data to datasets
   * - Adding and removing requests to/from queues
   * - Cache storage
   *
   * This is an API based on Apify's `Actor` utility class, which is also
   * the default.
   *
   * You don't need to override this in most of the cases.
   *
   * By default, the data is saved and kept locally in
   * `./storage` directory. And if the cralwer runs in Apify's platform
   * then it will use Apify's cloud for storage.
   *
   * See {@link CrawleeOneIO}
   */
  io?: CrawleeOneInternalOptions<T>['io'];
  /**
   * Provide a custom router instance.
   *
   * By default, router is created as:
   * ```ts
   * import { Router } from 'crawlee';
   * Router.create(),
   * ```
   *
   * See {@link Router}
   */
  router?: CrawleeOneInternalOptions<T>['router'];
  /** Routes that are used to redirect requests to the appropriate handler. */
  routes: Record<T['labels'], CrawleeOneRoute<T>>;

  hooks?: {
    validateInput?: (input: T['input'] | null) => MaybePromise<void>;
    onBeforeHandler?: CrawleeOneRouteHandler<T>;
    onAfterHandler?: CrawleeOneRouteHandler<T>;
  };

  // Meta options
  /**
   * When `true`, throw when a URL does not match any route.
   * 
   * If `false`, log an error and skip the URL.
   * 
   * Defaults to `false`.
   */
  strict?: boolean;
} // prettier-ignore

/**
 * Create and run an opinionated Crawlee crawler that uses router for handling requests,
 * and runs within Apify's `Actor.main()` context.
 *
 * Apify context can be replaced with custom implementation using the `io` option.
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
export const crawleeOne = <
  TType extends CrawlerType,
  T extends CrawleeOneTypes<CrawlerMeta<TType>['context']> = CrawleeOneTypes<
    CrawlerMeta<TType>['context']
  >,
>(
  opts: CrawleeOneOptions<TType, T>,
  onReady?: (context: CrawleeOneContext<T>) => MaybePromise<void>
): Promise<void> => {
  const io = opts.io ?? (apifyIO as any as T['io']);

  const hookHandlerWrapper = (handler: CrawleeOneRouteHandler<T>) => {
    const innerHandler = async (ctx: any) => {
      await opts.hooks?.onBeforeHandler?.(ctx as any);
      await handler(ctx);
      await opts.hooks?.onAfterHandler?.(ctx as any);
    };
    return innerHandler;
  };

  // This will become the Actor object that is passed to the user's onReady hook
  const actorConfig: CrawleeOneInternalOptions<T> = {
    strict: opts.strict,

    // Input
    input: opts.input,
    inputDefaults: opts.inputDefaults,
    mergeInput: opts.mergeInput,
    inputFields: opts.inputFields,
    validateInput: opts.hooks?.validateInput,

    // Router
    router: opts.router ?? Router.create<T['context']>(),
    routes: opts.routes,
    routeHandlerWrappers: ({ input }) => [
      logLevelHandlerWrapper(input?.logLevel ?? 'info'),
      hookHandlerWrapper,
    ],

    // Other services
    telemetry: opts.telemetry,
    proxy: opts.proxy,
    io,

    // Crawler
    createCrawler: defaultCreateCrawlerFactory({
      type: opts.type,
      io,
      // @ts-expect-error - type mismatch
      crawlerConfigDefaults: opts.crawlerConfigDefaults,
      // @ts-expect-error - type mismatch
      crawlerConfigOverrides: opts.crawlerConfigOverrides,
    }) as unknown as CrawleeOneInternalOptions<T>['createCrawler'],
  };

  // See docs:
  // - https://docs.apify.com/sdk/js/
  // - https://docs.apify.com/academy/deploying-your-code/inputs-outputs#accepting-input-with-the-apify-sdk
  // - https://docs.apify.com/sdk/js/docs/upgrading/upgrading-to-v3#apify-sdk
  return io.runInContext(
    async () => {
      // Run-specific queue and KV store for processing LLM extraction jobs.
      const { llmRequestQueueId, llmKeyValueStoreId } = getLlmIds(opts.input);

      // Create Crawlee's Crawler instance and CrawleeOne context.
      const context = await createCrawleeOne({
        config: actorConfig,
        llmRequestQueueId,
        llmKeyValueStoreId,
      });

      // In dev mode, devOnReady runs before user's onReady. It populates the
      // dev queue from context.routes and patches the crawler, so scrapers don't
      // need to export routes.
      const devCtx = devContextStore.getStore();
      if (devCtx?.devOnReady) {
        await devCtx.devOnReady(context);
      }

      // Run onReady while also starting up an LLMCrawler concurrently
      // to process deferred LLM extraction jobs from the LLM queue.
      await orchestrateWithLlm({
        context,
        llmRequestQueueId,
        llmKeyValueStoreId,
        llmQueueDrainCheckIntervalMs: (context.input as LlmActorInput | null)
          ?.llmQueueDrainCheckIntervalMs,
        run: async () => {
          if (onReady) {
            await onReady(context); // Call user's onReady
          } else {
            await context.crawler.run(); // Default
          }
        },
      });
    },
    { statusMessage: 'Crawling finished!' }
  );
};

/** Default implementation of `createCrawler` function. Used when `createCrawler` is not provided. */
function defaultCreateCrawlerFactory<
  TType extends CrawlerType,
  T extends CrawleeOneTypes<CrawlerMeta<TType>['context']>,
>(params: {
  type: TType;
  io: T['io'];
  crawlerConfigDefaults?: Omit<CrawlerMeta<TType>['options'], 'requestHandler'>;
  crawlerConfigOverrides?: Omit<CrawlerMeta<TType>['options'], 'requestHandler'>;
}): CrawleeOneInternalOptions<T>['createCrawler'] {
  const { type, io, crawlerConfigDefaults, crawlerConfigOverrides } = params;

  const createCrawler: CrawleeOneInternalOptions<T>['createCrawler'] = ({
    router,
    proxy,
    input,
    telemetry,
  }) => {
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

    // Get Crawler class based on the type, e.g. `'http'` -> `HttpCrawler`
    const CrawlerClass = actorClassByType[type] as any;
    return new CrawlerClass(options);
  };

  return createCrawler;
}

/**
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
const createCrawleeOne = async <T extends CrawleeOneTypes>(opts: {
  config: PickPartial<CrawleeOneInternalOptions<T>, 'io'>;
  llmRequestQueueId: string;
  llmKeyValueStoreId: string;
}): Promise<CrawleeOneContext<T>> => {
  const { config, llmRequestQueueId, llmKeyValueStoreId } = opts;
  const { io = apifyIO as any as T['io'] } = config;

  // Mutable state that is available to the actor hooks
  const state = {};

  // Initialize actor inputs
  const input = await createActorInput({ ...config, io }, state);

  // Auto-validate from Field schemas
  if (config.inputFields) {
    const fieldSchemas: Record<string, z.ZodType> = {};
    for (const [key, field] of Object.entries(config.inputFields)) {
      if (field.schema) fieldSchemas[key] = field.schema as z.ZodType;
    }
    z.object(fieldSchemas).parse(input);
  }

  // Then custom validation hook
  if (config.validateInput) await config.validateInput(input);

  const { logLevel } = (input ?? {}) as LoggingActorInput;
  const log = new Log({ level: logLevel ? logLevelToCrawlee[logLevel] : LogLevel.INFO });

  // This is context that is available to options that use initialization function
  const getConfig = () =>
    ({ ...config, input, state, io }) satisfies CrawleeOneInternalOptionsWithInput<T>;

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
  let oneCtx = {} as any;
  const oneCtxFactory = <Ctx extends Partial<CrawleeOneContext<T>>>(newCtx: Ctx) => {
    oneCtx = { ...newCtx };
    return (): Ctx => ({ ...oneCtx });
  };

  const getPreContextNoCrawler = oneCtxFactory({
    io,
    telemetry,
    router,
    routes,
    proxy,
    config,
    input,
    state,
    log,
    addRequests: createScopedAddRequests({ io, log, state, input }),
  } satisfies Omit<CrawleeOneContext<T>, 'crawler' | 'metamorph' | 'startUrls'>);

  // Create Crawlee crawler
  const crawler = await config.createCrawler(getPreContextNoCrawler());
  const getPreContext = oneCtxFactory({ ...getPreContextNoCrawler(), crawler });

  // Wrap `crawler.run()` with additional features: metamorph, transform/filter hooks, output cache, etc.
  const originalRun = crawler.run.bind(crawler);
  const wrappedRun = createScopedCrawlerRun(getPreContext, originalRun);
  crawler.run = wrappedRun;

  // Create CrawleeOne context (passed to route handlers as ctx.one and to onReady as context)
  const context: CrawleeOneContext<T> = {
    ...getPreContext(),
    metamorph: createScopedMetamorph(getPreContext),
    startUrls: await getStartUrlsFromInput(getPreContext()),
  };

  // Callback that builds handler context from crawling ctx.
  const getRouterContext = (
    ctx: T['context'] & { routeLabel?: string }
  ): CrawleeOneRouteHandlerCtxExtras<T> => ({
    one: context,
    metamorph: context.metamorph,
    _pushData: ctx.pushData,
    _addRequests: ctx.addRequests,
    addRequests: context.addRequests,
    // Use ctx-bound pushData to avoid "pushData outside context" when handlers run concurrently.
    pushData: createPushDataForContext(ctx, context),
    extractWithLLM: createExtractWithLlmForContext({
      ctx,
      context,
      llmRequestQueueId,
      llmKeyValueStoreId,
    }),
  });

  // Set up router
  await setupDefaultHandlers<T>({
    io,
    router,
    routeHandlerWrappers,
    getRouterContext,
    routes,
    input,
    strict: config.strict,
  });

  // Register labelled handlers
  await registerHandlers<T>({
    router,
    routes,
    getRouterContext,
    handlerWrappers: routeHandlerWrappers,
  });

  // Prepare telemetry
  const isEnabled = await context.io.isTelemetryEnabled();
  if (isEnabled) {
    await telemetry?.setup(context);
  }

  // Now that the context is ready, enqueue the URLs right away
  await context.addRequests(context.startUrls as CrawleeRequest[]);

  return context;
};

const createActorInput = async <T extends CrawleeOneTypes>(
  config: CrawleeOneInternalOptions<T>,
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
      : ({ defaults, overrides, env }: any) => ({ ...defaults, ...env, ...overrides })
    : config.input
      ? ({ defaults, overrides }: any) => ({ ...defaults, ...overrides })
      : ({ defaults, env }: any) => ({ ...defaults, ...env });

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
 * Create a function that wraps `crawler.run(requests, runOptions)` with additional
 * features:
 * - Automatically metamorph into another actor after the run finishes
 * - Support transformation and filtering of (scraped) entries, configured via Actor input.
 * - Support transformation and filtering of requests, configured via Actor input.
 * - Support caching of scraped entries, configured via Actor input.
 * - Support caching of requests, configured via Actor input.
 * - Support caching of scraped entries, configured via Actor input.
 */
const createScopedCrawlerRun = <T extends CrawleeOneTypes>(
  getContext: () => Omit<CrawleeOneContext<T>, 'metamorph' | 'startUrls'>,
  originalRun: RunCrawler
): RunCrawler => {
  const metamorph = createScopedMetamorph(getContext);

  const wrappedRun: RunCrawler = async (requests, options) => {
    const ctx = getContext();
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
    } = (ctx.input ?? {}) as OutputActorInput & RequestActorInput;

    // Clear cache if it was set from the input
    if (outputCacheStoreId && outputCacheActionOnResult === 'overwrite') {
      const store = await ctx.io.openKeyValueStore(outputCacheStoreId);
      await store.clear();
    }

    await genHookFn(ctx, outputTransformBefore, 'outputTransformBefore')?.(); // prettier-ignore
    await genHookFn(ctx, outputFilterBefore, 'outputFilterBefore')?.(); // prettier-ignore
    await genHookFn(ctx, requestTransformBefore, 'requestTransformBefore')?.(); // prettier-ignore
    await genHookFn(ctx, requestFilterBefore, 'requestFilterBefore')?.(); // prettier-ignore

    const runRes = await originalRun(requests, options);

    await genHookFn(ctx, outputTransformAfter, 'outputTransformAfter')?.(); // prettier-ignore
    await genHookFn(ctx, outputFilterAfter, 'outputFilterAfter')?.(); // prettier-ignore
    await genHookFn(ctx, requestTransformAfter, 'requestTransformAfter')?.(); // prettier-ignore
    await genHookFn(ctx, requestFilterAfter, 'requestFilterAfter')?.(); // prettier-ignore

    // Trigger metamorph if it was set from the input
    await metamorph();

    return runRes;
  };

  return wrappedRun;
};

/** Create a function that triggers metamorph, using CrawleeOne input as defaults. */
const createScopedMetamorph = <T extends CrawleeOneTypes>(
  getContext: () => Pick<CrawleeOneContext<T>, 'input' | 'io'>
) => {
  const metamorph: Metamorph = async (overrides?: MetamorphActorInput) => {
    const ctx = getContext();
    const {
      metamorphActorId,
      metamorphActorBuild,
      metamorphActorInput,
    } = defaults({}, overrides, ctx.input ?? {}); // prettier-ignore

    if (!metamorphActorId) return;

    await ctx.io.triggerDownstreamCrawler(metamorphActorId, metamorphActorInput, {
      build: metamorphActorBuild,
    });
  };

  return metamorph;
};

/** Build merged pushData options from CrawleeOne input */
const buildPushDataOptions = <T extends CrawleeOneTypes>(
  ctx: Pick<CrawleeOneContext<T>, 'input' | 'state' | 'io' | 'log'>,
  options?: PushDataOptions<object>
) => {
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
  } = (ctx.input ?? {}) as OutputActorInput & PrivacyActorInput & RequestActorInput;

  const transformFn = genHookFn(ctx, outputTransform, 'outputTransform');
  const filterFn = genHookFn(ctx, outputFilter, 'outputFilter');

  return {
    io: ctx.io,
    log: ctx.log,
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
  };
};

/**
 * Creates a pushData function bound to a specific crawling context.
 * Use this when handlers run concurrently to avoid "pushData outside context" errors
 * (the global handlerCtx gets cleared when any handler finishes).
 */
const createPushDataForContext = <T extends CrawleeOneTypes>(
  ctx: Parameters<typeof pushData>[0] & { routeLabel?: string },
  one: Pick<CrawleeOneContext<T>, 'input' | 'state' | 'io' | 'log'>
): CrawleeOneRouteHandlerCtxExtras<T>['pushData'] => {
  return async (entries, options) => {
    // When dev mode is active (`devContextStore` has `devDatasetIdPrefix`), datasetId is
    // overridden to `{devDatasetIdPrefix}-{routeLabel}` so each route writes to its own
    // dev dataset. Throws if `devDatasetIdPrefix` is set but `routeLabel` is missing from ctx.
    const devDatasetIdPrefix = devContextStore.getStore()?.devDatasetIdPrefix;
    let devDatasetOverride: { datasetId?: string } = {};
    if (devDatasetIdPrefix) {
      const routeLabel = ctx.routeLabel;
      if (routeLabel == null || routeLabel === '') {
        throw new Error(
          'devDatasetIdPrefix is set but routeLabel is missing from context. ' +
            'In dev mode, each route must have a label so pushData can be routed to dev-{crawler}-{route} dataset.'
        );
      }
      devDatasetOverride = { datasetId: `${devDatasetIdPrefix}-${routeLabel}` };
    }

    return pushData(
      ctx,
      entries,
      buildPushDataOptions(one, {
        ...options,
        ...devDatasetOverride,
      } as PushDataOptions<object>) as PushDataOptions<any>
    );
  };
};

/** addRequests wrapper that pre-populates options based on CrawleeOne input */
const createScopedAddRequests = <T extends CrawleeOneTypes>(
  ctx: Pick<CrawleeOneContext<T>, 'input' | 'state' | 'io' | 'log'>
) => {
  const scopedAddRequests: CrawleeOneRouteHandlerCtxExtras<T>['addRequests'] = async (
    entries,
    options
  ) => {
    const { requestQueueId, requestMaxEntries, requestTransform, requestFilter } = (ctx.input ??
      {}) as RequestActorInput;

    const transformFn = genHookFn(ctx, requestTransform, 'requestTransform');
    const filterFn = genHookFn(ctx, requestFilter, 'requestFilter');

    const mergedOptions = {
      io: ctx.io,
      log: ctx.log,
      maxCount: requestMaxEntries,
      transform: transformFn ?? undefined,
      filter: filterFn ?? undefined,
      requestQueueId,
      ...options,
    } satisfies AddRequestsOptions<any>;

    return addRequests<any>(entries, mergedOptions);
  };

  return scopedAddRequests;
};

/** Given the actor input, create common crawler options. */
export const createHttpCrawlerOptions = <
  T extends CrawleeOneTypes,
  TOpts extends BasicCrawlerOptions<T['context']>,
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

const getStartUrlsFromInput = async <T extends CrawleeOneTypes>(
  ctx: Pick<CrawleeOneContext<T>, 'input' | 'state' | 'io' | 'log'>
) => {
  const { startUrls, startUrlsFromDataset, startUrlsFromFunction } = (ctx.input ??
    {}) as StartUrlsActorInput;

  const urlsAgg = [...(startUrls ?? [])];

  if (startUrlsFromDataset) {
    ctx.log.debug(`Loading start URLs from Dataset ${startUrlsFromDataset}`);
    const [datasetId, field] = startUrlsFromDataset.split('#');
    const urlsFromDataset = await getColumnFromDataset<any>(datasetId, field, { io: ctx.io });
    urlsAgg.push(...urlsFromDataset);
  }

  if (startUrlsFromFunction) {
    ctx.log.debug(`Loading start URLs from function`);
    const urlsFromFn =
      (await genHookFn(ctx, startUrlsFromFunction, 'startUrlsFromFunction')?.()) ?? [];
    if (!Array.isArray(urlsFromFn)) {
      throw Error(
        `Hook "startUrlsFromFunction" must return an array of URLs or Requests, got ${urlsFromFn}`
      );
    }
    urlsAgg.push(...urlsFromFn);
  }

  return urlsAgg;
};

const isRouter = (r: any): r is RouterHandler<any> => {
  return !!((r as RouterHandler)?.addHandler && (r as RouterHandler)?.addDefaultHandler);
};

const isFunc = (f: any): f is (...args: any[]) => any => {
  return typeof f === 'function';
};

/** Run a function that was defined as a string via CrawleeOne input */
const genHookFn = <
  TArgs extends any[] = [],
  TReturn = unknown,
  T extends CrawleeOneTypes = CrawleeOneTypes,
>(
  ctx: Pick<CrawleeOneContext<T>, 'input' | 'state' | 'io'>,
  fnOrStr: string | CrawleeOneHookFn<TArgs, TReturn, T> | undefined | null,
  funcName: string
) => {
  if (!fnOrStr) return null;

  const hookCtx = {
    io: ctx.io,
    input: ctx.input,
    state: ctx.state,
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
