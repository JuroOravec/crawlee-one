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
  RouteHandlerWrapper,
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

type MaybeAsyncFn<R, Args extends any[]> = R | ((...args: Args) => MaybePromise<R>);

const isRouter = (r: any): r is RouterHandler<any> => {
  return !!((r as RouterHandler).addHandler && (r as RouterHandler).addDefaultHandler);
};
const isFunc = (f: any): f is (...args: any[]) => any => {
  return typeof f === 'function';
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
  routes: MaybeAsyncFn<RouteMatcher<Ctx, Labels>[], [ActorDefinitionWithInput<Ctx, Labels, Input>]>;
  /** Handlers for the labelled requests. The object keys are the labels. */
  routeHandlers: MaybeAsyncFn<Record<Labels, RouteHandler<Ctx>>, [ActorDefinitionWithInput<Ctx, Labels, Input>]>; // prettier-ignore
  /**
   * Provides the option to modify or extend all router handlers by wrapping
   * them in these functions.
   *
   * Wrappers are applied from right to left. That means that wrappers `[A, B, C]`
   * will be applied like so `A( B( C( handler ) ) )`.
   */
  handlerWrappers?: MaybeAsyncFn<RouteHandlerWrapper<Ctx>[], [ActorDefinitionWithInput<Ctx, Labels, Input>]>; // prettier-ignore

  // Proxy setup
  proxy?: MaybeAsyncFn<ProxyConfiguration, [ActorDefinitionWithInput<Ctx, Labels, Input>]>; // prettier-ignore

  // Crawler setup
  createCrawler: (
    actorCtx: Omit<ActorContext<Ctx, Labels, Input>, 'crawler' | 'runActor'>
  ) => MaybePromise<Ctx['crawler']>;
}

export type ActorDefinitionWithInput<
  Ctx extends CrawlingContext = CrawlingContext<BasicCrawler>,
  Labels extends string = string,
  Input extends Record<string, any> = Record<string, any>
> = Omit<ActorDefinition<Ctx, Labels, Input>, 'input'> & { input: Input | null };

/** Context available while creating an Apify/Crawlee crawler */
export interface ActorContext<
  Ctx extends CrawlingContext = CrawlingContext<BasicCrawler>,
  Labels extends string = string,
  Input extends Record<string, any> = Record<string, any>
> {
  crawler: Ctx['crawler'];
  /**
   * This function that wraps `crawler.run(requests, runOtions)` with additional
   * features like:
   * - Automatically metamorph into another actor after the run finishes
   */
  runActor: RunActor<Ctx>;
  proxy?: ProxyConfiguration;
  router: RouterHandler<Ctx>;
  routes: RouteMatcher<Ctx, Labels>[];
  routeHandlers: Record<Labels, RouteHandler<Ctx>>;
  config: ActorDefinition<Ctx, Labels, Input>;
  input: Input | null;
}

type OrigRunActor<T extends CrawlingContext<any, any>> = BasicCrawler<T>['run'];

interface MetamorphInputOverrides {
  /** Override this if the metamorph actor ID is under different input field than 'metamorphActorId' */
  actorMetamorphIdKey?: string;
  /** Override this if the metamorph actor ID is under different input field than 'metamorphActorBuild' */
  actorMetamorphBuildKey?: string;
  /** Override this if the metamorph actor ID is under different input field than 'metamorphActorInput' */
  actorMetamorphInputKey?: string;
}

/** Extended type of `crawler.run()` function */
export type RunActor<Ctx extends CrawlingContext = CrawlingContext<BasicCrawler>> = (
  requests?: Parameters<OrigRunActor<Ctx>>[0],
  options?: Parameters<OrigRunActor<Ctx>>[1] & MetamorphInputOverrides
) => ReturnType<OrigRunActor<Ctx>>;

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
  // Initialize config fields where we have initialization functions instead of the values themselves
  const input = config.input
    ? isFunc(config.input)
      ? await config.input({ ...config })
      : config.input
    : await Actor.getInput<Input>();

  if (config.validateInput) await config.validateInput(input);

  const getConfig = () => ({ ...config, input });

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

  const router: RouterHandler<Ctx> = isRouter(config.router)
    ? config.router
    : await (config.router as any)(getConfig());
  const routes = isFunc(config.routes) ? await config.routes(getConfig()) : config.routes; // prettier-ignore
  const routeHandlers = isFunc(config.routeHandlers) ? await config.routeHandlers(getConfig()) : config.routeHandlers; // prettier-ignore
  const handlerWrappers = isFunc(config.handlerWrappers) ? await config.handlerWrappers(getConfig()) : config.handlerWrappers; // prettier-ignore

  // Set up router
  await setupDefaultRoute<Ctx, Labels>({
    router,
    routes,
    handlers: routeHandlers,
    handlerWrappers,
  });
  await registerHandlers<Ctx, Labels>({ router, handlers: routeHandlers, handlerWrappers });

  const getActorCtx = () => ({ router, routes, routeHandlers, proxy, config, input });
  const crawler = await config.createCrawler(getActorCtx());

  const actor = { crawler, ...getActorCtx() };
  const runActor = createActorRunner<Ctx, Labels, Input>(actor);

  return { crawler, ...getActorCtx(), runActor };
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
  const runActor: RunActor<Ctx> = async (requests, options) => {
    const {
      actorMetamorphIdKey = 'metamorphActorId',
      actorMetamorphBuildKey = 'metamorphActorBuild',
      actorMetamorphInputKey = 'metamorphActorInput',
      ...runOtions
    } = options || {};

    const runRes = await actor.crawler.run(requests, runOtions);

    // Trigger metamorph if it was set from the input
    const targetActorId = actor.input?.[actorMetamorphIdKey];
    const targetActorBuild = actor.input?.[actorMetamorphBuildKey];
    const targetActorInput = actor.input?.[actorMetamorphInputKey];
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
  actorType: TCrawlerType;
  actorName: string;
  actorConfig: Omit<ActorDefinition<Ctx, Labels, Input>, 'router' | 'createCrawler'> &
    Partial<Pick<ActorDefinition<Ctx, Labels, Input>, 'router' | 'createCrawler'>>;
  crawlerConfigDefaults?: CrawlerMeta<TCrawlerType, any>['options'];
  crawlerConfigOverrides?: CrawlerMeta<TCrawlerType, any>['options'];
  sentryOptions?: Sentry.NodeOptions;
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
        handlerWrappers: ({ input }) => [logLevelHandlerWrapper<Ctx>(input?.logLevel ?? 'info')],
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
        router: actorConfig.router ?? actorDefaults.router,
        handlerWrappers: actorConfig.handlerWrappers ?? actorDefaults.handlerWrappers,
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
