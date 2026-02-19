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
import { PushRequestsOptions, pushRequests } from '../io/pushRequests.js';
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
  CrawleeOneActorInst,
  CrawleeOneActorDef,
  CrawleeOneHookCtx,
  CrawleeOneActorRouterCtx,
  Metamorph,
  RunCrawler,
  CrawleeOneCtx,
  CrawleeOneHookFn,
  CrawleeOneActorDefWithInput,
} from './types.js';
import type { CrawleeOneRouteHandler, CrawleeOneRoute } from '../router/types.js';

/** Options object passed to `crawleeOne` */
export interface CrawleeOneOptions<
  TType extends CrawlerType,
  T extends CrawleeOneCtx<CrawlerMeta<TType>['context']>
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
  inputFields?: CrawleeOneActorDef<T>['inputFields'];

  // /////// Override services /////////
  /**
   * Configure the Crawlee proxy.
   *
   * See {@link ProxyConfiguration}
   */
  proxy?: CrawleeOneActorDef<T>['proxy'];
  /**
   * Provide a telemetry instance that is used for tracking errors.
   *
   * See {@link CrawleeOneTelemetry}
   */
  telemetry?: CrawleeOneActorDef<T>['telemetry'];
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
  io?: CrawleeOneActorDef<T>['io'];
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
  router?: CrawleeOneActorDef<T>['router'];
  /** Routes that are used to redirect requests to the appropriate handler. */
  routes: Record<T['labels'], CrawleeOneRoute<T, CrawleeOneActorRouterCtx<T>>>;

  hooks?: {
    validateInput?: (input: T['input'] | null) => MaybePromise<void>;
    onBeforeHandler?: CrawleeOneRouteHandler<T, CrawleeOneActorRouterCtx<T>>;
    onAfterHandler?: CrawleeOneRouteHandler<T, CrawleeOneActorRouterCtx<T>>;
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
export const crawleeOne = <
  TType extends CrawlerType,
  T extends CrawleeOneCtx<CrawlerMeta<TType>['context']> = CrawleeOneCtx<
    CrawlerMeta<TType>['context']
  >,
>(
  opts: CrawleeOneOptions<TType, T>,
  onReady?: (actor: CrawleeOneActorInst<T>) => MaybePromise<void>
): Promise<void> => {
  const io = opts.io ?? (apifyIO as any as T['io']);

  const hookHandlerWrapper = (handler: CrawleeOneRouteHandler<T, CrawleeOneActorRouterCtx<T>>) => {
    const innerHandler = async (ctx: any) => {
      await opts.hooks?.onBeforeHandler?.(ctx as any);
      await handler(ctx);
      await opts.hooks?.onAfterHandler?.(ctx as any);
    };
    return innerHandler;
  };

  // This will become the Actor object that is passed to the user's onReady hook
  const actorConfig: CrawleeOneActorDef<T> = {
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
    }) as unknown as CrawleeOneActorDef<T>['createCrawler'],
  };

  // See docs:
  // - https://docs.apify.com/sdk/js/
  // - https://docs.apify.com/academy/deploying-your-code/inputs-outputs#accepting-input-with-the-apify-sdk
  // - https://docs.apify.com/sdk/js/docs/upgrading/upgrading-to-v3#apify-sdk
  return io.runInContext(
    async () => {
      // Run-specific queue and KV store for processing LLM extraction jobs.
      const { llmRequestQueueId, llmKeyValueStoreId } = getLlmIds(opts.input);

      // Create Crawlee's Crawler instance, as well our custom "actor" object that
      // wraps it and provides additional functionality.
      const actor = await createCrawleeOne({
        config: actorConfig,
        llmRequestQueueId,
        llmKeyValueStoreId,
      });

      // In dev mode, devOnReady runs before user's onReady. It populates the
      // dev queue from actor.routes and patches the crawler, so scrapers don't
      // need to export routes.
      const devCtx = devContextStore.getStore();
      if (devCtx?.devOnReady) {
        await devCtx.devOnReady(actor);
      }

      // Run onReady while also starting up an LLMCrawler concurrently
      // to process deferred LLM extraction jobs from the LLM queue.
      await orchestrateWithLlm({
        actor,
        llmRequestQueueId,
        llmKeyValueStoreId,
        llmQueueDrainCheckIntervalMs: (actor.input as LlmActorInput | null)
          ?.llmQueueDrainCheckIntervalMs,
        run: async () => {
          if (onReady) {
            await onReady(actor); // Call user's onReady
          } else {
            await actor.runCrawler(); // Default
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
  T extends CrawleeOneCtx<CrawlerMeta<TType>['context']>,
>(params: {
  type: TType;
  io: T['io'];
  crawlerConfigDefaults?: Omit<CrawlerMeta<TType>['options'], 'requestHandler'>;
  crawlerConfigOverrides?: Omit<CrawlerMeta<TType>['options'], 'requestHandler'>;
}): CrawleeOneActorDef<T>['createCrawler'] {
  const { type, io, crawlerConfigDefaults, crawlerConfigOverrides } = params;

  const createCrawler: CrawleeOneActorDef<T>['createCrawler'] = ({
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
const createCrawleeOne = async <T extends CrawleeOneCtx>(opts: {
  config: PickPartial<CrawleeOneActorDef<T>, 'io'>;
  llmRequestQueueId: string;
  llmKeyValueStoreId: string;
}): Promise<CrawleeOneActorInst<T>> => {
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
    ({ ...config, input, state, io }) satisfies CrawleeOneActorDefWithInput<T>;

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
    pushRequests: createScopedPushRequests({ io, log, state, input }),
  } satisfies Omit<CrawleeOneActorInst<T>, 'crawler' | 'runCrawler' | 'metamorph' | 'startUrls'>);

  // Create Crawlee crawler
  const crawler = await config.createCrawler(getPreActorNoCrawler());
  const getPreActor = actorCtxFactory({ ...getPreActorNoCrawler(), crawler });

  // Create actor (our custom entity)
  const actor: CrawleeOneActorInst<T> = {
    ...getPreActor(),
    runCrawler: createScopedCrawlerRun(getPreActor),
    metamorph: createScopedMetamorph(getPreActor),
    startUrls: await getStartUrlsFromInput(getPreActor()),
  };

  // Callback that builds handler context from crawling ctx.
  const getRouterContext = (
    ctx: T['context'] & { routeLabel?: string }
  ): CrawleeOneActorRouterCtx<T> => ({
    actor,
    metamorph: actor.metamorph,
    pushRequests: actor.pushRequests,
    // Use ctx-bound pushData to avoid "pushData outside context" when handlers run concurrently.
    pushData: createPushDataForContext(ctx, actor),
    extractWithLLM: createExtractWithLlmForContext({
      ctx,
      actor,
      llmRequestQueueId,
      llmKeyValueStoreId,
    }),
  });

  // Set up router
  await setupDefaultHandlers<T, CrawleeOneActorRouterCtx<T>>({
    io,
    router,
    routeHandlerWrappers,
    getRouterContext,
    routes,
    input,
    strict: config.strict,
  });

  // Register labelled handlers
  await registerHandlers<T, CrawleeOneActorRouterCtx<T>>({
    router,
    routes,
    getRouterContext,
    handlerWrappers: routeHandlerWrappers,
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
 * Create a function that wraps `crawler.run(requests, runOtions)` with additional
 * features:
 * - Automatically metamorph into another actor after the run finishes
 * - Support transformation and filtering of (scraped) entries, configured via Actor input.
 * - Support transformation and filtering of requests, configured via Actor input.
 * - Support caching of scraped entries, configured via Actor input.
 * - Support caching of requests, configured via Actor input.
 * - Support caching of scraped entries, configured via Actor input.
 */
const createScopedCrawlerRun = <T extends CrawleeOneCtx>(
  getActor: () => Omit<CrawleeOneActorInst<T>, 'runCrawler' | 'metamorph' | 'startUrls'>
) => {
  const metamorph = createScopedMetamorph(getActor);

  const runCrawler: RunCrawler = async (requests, options) => {
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
      await store.clear();
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

/** Build merged pushData options from actor input */
const buildPushDataOptions = <T extends CrawleeOneCtx>(
  actor: Pick<CrawleeOneActorInst<T>, 'input' | 'state' | 'io' | 'log'>,
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
  } = (actor.input ?? {}) as OutputActorInput & PrivacyActorInput & RequestActorInput;

  const transformFn = genHookFn(actor, outputTransform, 'outputTransform');
  const filterFn = genHookFn(actor, outputFilter, 'outputFilter');

  return {
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
  };
};

/**
 * Creates a pushData function bound to a specific crawling context.
 * Use this when handlers run concurrently to avoid "pushData outside context" errors
 * (the global handlerCtx gets cleared when any handler finishes).
 */
const createPushDataForContext = <T extends CrawleeOneCtx>(
  ctx: Parameters<typeof pushData>[0] & { routeLabel?: string },
  actor: Pick<CrawleeOneActorInst<T>, 'input' | 'state' | 'io' | 'log'>
): CrawleeOneActorRouterCtx<T>['pushData'] => {
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
      buildPushDataOptions(actor, {
        ...options,
        ...devDatasetOverride,
      } as PushDataOptions<object>) as PushDataOptions<any>
    );
  };
};

/** pushRequests wrapper that pre-populates options based on actor input */
const createScopedPushRequests = <T extends CrawleeOneCtx>(
  actor: Pick<CrawleeOneActorInst<T>, 'input' | 'state' | 'io' | 'log'>
) => {
  const scopedPushRequest: CrawleeOneActorRouterCtx<T>['pushRequests'] = async (
    entries,
    options
  ) => {
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
  T extends CrawleeOneCtx = CrawleeOneCtx,
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
