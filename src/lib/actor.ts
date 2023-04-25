import { Actor } from 'apify';
import type { BasicCrawler, CrawlingContext, RouterHandler } from 'crawlee';

import type { MaybePromise } from '../utils/types';
import {
  RouteHandler,
  RouteHandlerWrapper,
  RouteMatcher,
  registerHandlers,
  setupDefaultRoute,
} from './router';

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

  createCrawler: (actorCtx: ActorContext<Ctx, Labels, Input>) => MaybePromise<Ctx['crawler']>;
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
  router: RouterHandler<Ctx>;
  routes: RouteMatcher<Ctx, Labels>[];
  routeHandlers: Record<Labels, RouteHandler<Ctx>>;
  config: ActorDefinition<Ctx, Labels, Input>;
  input: Input | null;
}

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
) => {
  // Initialize config fields where we have initialization functions instead of the values themselves
  const input = config.input
    ? isFunc(config.input)
      ? await config.input({ ...config })
      : config.input
    : await Actor.getInput<Input>();

  if (config.validateInput) await config.validateInput(input);

  const getConfig = () => ({ ...config, input });

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

  const getActorCtx = () => ({ router, routes, routeHandlers, config, input });
  const crawler = await config.createCrawler(getActorCtx());

  return { crawler, ...getActorCtx() };
};
