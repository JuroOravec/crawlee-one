import { Actor } from 'apify';
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

import type { CrawlerMeta, CrawlerType } from '../../types';
import type { MaybePromise, PickPartial } from '../../utils/types';
import { registerHandlers, setupDefaultRoute } from '../router';
import {
  CrawlerConfigActorInput,
  OutputActorInput,
  MetamorphActorInput,
  PrivacyActorInput,
  crawlerInput,
  StartUrlsActorInput,
} from '../config';
import { createErrorHandler } from '../error/errorHandler';
import { setupSentry } from '../error/sentry';
import { logLevelHandlerWrapper } from '../log';
import { itemCacheKey, pushData } from '../io/pushData';
import type {
  ActorContext,
  ActorDefinition,
  ActorHookContext,
  ActorRouterContext,
  AllActorInputs,
  Metamorph,
  RunCrawler,
} from './types';
import { getColumnFromDataset } from '../io/dataset';

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
  Input extends Record<string, any> = Record<string, any>
>(
  actor: Pick<ActorContext<Ctx, Labels, Input>, 'input' | 'state'>,
  fnStr?: string
) => {
  if (!fnStr) return async () => {};

  const hookCtx = {
    Actor,
    input: actor.input,
    state: actor.state,
    itemCacheKey,
  } satisfies ActorHookContext;

  const hookFn = eval(fnStr);
  return async (...args) => hookFn(...args, hookCtx);
};

/**
 * Create default configuration for an opinionated Apify actor,
 * and run the actor within the `Actor.main()` context.
 *
 * Read more about what this actor does at {@link createApifyActor}.
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
  actorConfig: PickPartial<ActorDefinition<Ctx, Labels, Input>, 'router' | 'createCrawler'>;
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
      const actorDefaults: ActorDefinition<Ctx, Labels, Input & AllActorInputs> = {
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
        createCrawler: actorConfig.createCrawler ?? (actorDefaults.createCrawler as any),
      });

      await onActorReady?.(actor);
    },
    { statusMessage: 'Crawling finished!' }
  );
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
 *
 * 7) (Optional) Support transformation and filtering of (scraped) entries,
 * configured via Actor input.
 *
 * 8) (Optional) Support Actor metamorphing, configured via Actor input.
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
  const runCrawler = createScopedCrawlerRun(preActor);
  const metamorph = createScopedMetamorph(preActor);
  const scopedPushData = createScopedPushData(preActor);
  const startUrls = await getStartUrlsFromInput(preActor);

  const actor = {
    ...preActor,
    crawler,
    runCrawler,
    metamorph,
    pushData: scopedPushData,
    startUrls,
  } satisfies ActorContext<Ctx, Labels, Input>;

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

/** Create a function that triggers metamorph, using Actor's inputs as defaults. */
const createScopedMetamorph = (actor: Pick<ActorContext, 'input'>) => {
  // Trigger metamorph if it was set from the input
  const metamorph: Metamorph = async (overrides?: MetamorphActorInput) => {
    const {
      metamorphActorId,
      metamorphActorBuild,
      metamorphActorInput,
    } = defaults({}, overrides, actor.input ?? {}); // prettier-ignore

    if (!metamorphActorId) return;

    await Actor.metamorph(metamorphActorId, metamorphActorInput, { build: metamorphActorBuild });
  };

  return metamorph;
};

/** pushData wrapper that pre-populates options based on actor input */
const createScopedPushData = (actor: Pick<ActorContext, 'input' | 'state'>) => {
  const scopedPushData: typeof pushData = (entries, ctx, options) => {
    const {
      includePersonalData,
      outputTransform,
      outputFilter,
      outputDatasetIdOrName,
      outputPickFields,
      outputRenameFields,
      outputCacheStoreIdOrName,
      outputCachePrimaryKeys,
      outputCacheActionOnResult,
    } = (actor.input ?? {}) as OutputActorInput & PrivacyActorInput;

    const transformFn = genHookFn(actor, outputTransform);
    const filterFn = genHookFn(actor, outputFilter);

    const mergedOptions = {
      showPrivate: includePersonalData,
      pickKeys: outputPickFields,
      remapKeys: outputRenameFields,
      transform: outputTransform ? (item) => transformFn(item) : undefined,
      filter: outputFilter ? (item) => filterFn(item) : undefined,
      datasetIdOrName: outputDatasetIdOrName,
      cacheStoreIdOrName: outputCacheStoreIdOrName,
      cachePrimaryKeys: outputCachePrimaryKeys,
      cacheActionOnResult: outputCacheActionOnResult,
      ...options,
    };

    return pushData(entries, ctx, mergedOptions);
  };

  return scopedPushData;
};

/**
 * Create a function that wraps `crawler.run(requests, runOtions)` with additional
 * features like:
 * - Automatically metamorph into another actor after the run finishes
 */
const createScopedCrawlerRun = <
  Ctx extends CrawlingContext<any> = CrawlingContext<BasicCrawler>,
  Labels extends string = string,
  Input extends Record<string, any> = Record<string, any>
>(
  actor: Omit<
    ActorContext<Ctx, Labels, Input>,
    'runCrawler' | 'metamorph' | 'pushData' | 'startUrls'
  >
) => {
  const {
    outputTransformBefore,
    outputTransformAfter,
    outputFilterBefore,
    outputFilterAfter,
    outputCacheStoreIdOrName,
    outputCacheActionOnResult,
  } = (actor.input ?? {}) as OutputActorInput;

  const metamorph = createScopedMetamorph(actor);

  const runCrawler: RunCrawler<Ctx> = async (requests, options) => {
    // Clear cache if it was set from the input
    if (outputCacheStoreIdOrName && outputCacheActionOnResult === 'overwrite') {
      const store = await Actor.openKeyValueStore(outputCacheStoreIdOrName);
      await store.drop();
    }

    await genHookFn(actor, outputTransformBefore)();
    await genHookFn(actor, outputFilterBefore)();

    const runRes = await actor.crawler.run(requests, options);

    await genHookFn(actor, outputTransformAfter)();
    await genHookFn(actor, outputFilterAfter)();

    // Trigger metamorph if it was set from the input
    await metamorph();

    return runRes;
  };

  return runCrawler;
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

const getStartUrlsFromInput = async (actor: Pick<ActorContext, 'input' | 'state'>) => {
  const { startUrls, startUrlsFromDataset, startUrlsFromFunction } = (actor.input ??
    {}) as StartUrlsActorInput;

  const urlsAgg = [...(startUrls ?? [])];

  if (startUrlsFromDataset) {
    const [datasetId, field] = startUrlsFromDataset.split('#');
    const urlsFromDataset = await getColumnFromDataset(datasetId, field);
    urlsAgg.push(...urlsFromDataset);
  }

  if (startUrlsFromFunction) {
    const urlsFromFn = await genHookFn(actor, startUrlsFromFunction)();
    urlsAgg.push(...urlsFromFn);
  }

  return urlsAgg;
};
