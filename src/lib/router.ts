import type {
  BasicCrawler,
  BasicCrawlingContext,
  CheerioCrawlingContext,
  CrawlingContext,
  HttpCrawlingContext,
  JSDOMCrawlingContext,
  PlaywrightCrawlingContext,
  PuppeteerCrawlingContext,
  RouterHandler as CrawlerRouter,
  Request as CrawlerRequest,
} from 'crawlee';
import type { CommonPage } from '@crawlee/browser-pool';
import { Actor } from 'apify';

import type { MaybePromise } from '../utils/types';
import { serialAsyncFind, serialAsyncMap } from '../utils/async';
import type { PerfActorInput } from './config';

// Read about router on https://docs.apify.com/academy/expert-scraping-with-apify/solutions/using-storage-creating-tasks

/** Context object provided in CrawlerRouter */
export type RouterHandlerCtx<CrawlerCtx extends CrawlingContext> = Parameters<
  Parameters<CrawlerRouter<CrawlerCtx>['addHandler']>[1]
>[0];

/** Function that's passed to `router.addHandler(label, handler)` */
export type RouteHandler<
  CrawlerCtx extends CrawlingContext = CrawlingContext<BasicCrawler>,
  RouterCtx extends Record<string, any> = Record<string, any>,
> = Parameters<CrawlerRouter<RouterHandlerCtx<CrawlerCtx & RouterCtx>>['addHandler']>[1]; // prettier-ignore

/** Wrapper that modifies behavior of RouteHandler */
export type CrawlerRouterWrapper<
  CrawlerCtx extends CrawlingContext = CrawlingContext<BasicCrawler>,
  RouterCtx extends Record<string, any> = Record<string, any>
> = (
  handler: (ctx: RouterHandlerCtx<CrawlerCtx & RouterCtx>) => Promise<void>
) => (ctx: RouterHandlerCtx<CrawlerCtx & RouterCtx>) => Promise<void>;

/**
 * Criteria that un-labelled requests are matched against.
 *
 * E.g. If `match` function returns truthy value,
 * the request is passed to the `action` function for processing.
 */
export interface RouteMatcher<
  CrawlerCtx extends CrawlingContext = CrawlingContext<BasicCrawler>,
  RouterCtx extends Record<string, any> = Record<string, any>,
  Labels extends string = string
> {
  /** Human readable name */
  name: string;
  /**
   * Label of the handler registered with `router.addHandler(label, handler)`
   * that will process this request.
   *
   * NOTE: This value is used by the default `action` function. If you override
   * the `action` function, `handlerLabel` is ignored and you have to process it yourself.
   */
  handlerLabel: Labels | null;
  /**
   * Function that decides whether the request will processed by this `action` function.
   *
   * @example
   * [{
   *   // If match returns true, the request is forwarded to handler
   *   // with label JOB_DETAIL.
   *   name: 'Job detail',
   *   match: (url, ctx, route, handlers) => isUrlOfJobOffer(url),
   *   handlerLabel: routeLabels.JOB_DETAIL,
   * }]
   */
  match: (
    url: string,
    ctx: RouterHandlerCtx<CrawlerCtx & RouterCtx>,
    route: RouteMatcher<CrawlerCtx, RouterCtx, Labels>,
    handlers: Record<Labels, RouteHandler<CrawlerCtx, RouterCtx>>
  ) => unknown;
  /**
   * Request is passed to this function if `match` returned truthy value.
   *
   * @example
   * [{
   *   // If match returns true, the request is forwarded to handler
   *   // with label JOB_DETAIL.
   *   name: 'Job detail',
   *   match: (url, ctx, route, handlers) => isUrlOfJobOffer(url),
   *   handlerLabel: routeLabels.JOB_DETAIL,
   * }]
   */
  action?: (
    url: string,
    ctx: RouterHandlerCtx<CrawlerCtx>,
    route: RouteMatcher<CrawlerCtx, RouterCtx, Labels>,
    handlers: Record<Labels, RouteHandler<CrawlerCtx, RouterCtx>>
  ) => MaybePromise<void>;
}

export const createRouteMatchers = <
  CrawlerCtx extends CrawlingContext = CrawlingContext<BasicCrawler>,
  RouterCtx extends Record<string, any> = Record<string, any>,
  Labels extends string = string
>(matchers: RouteMatcher<CrawlerCtx, RouterCtx, Labels>[]) => matchers; // prettier-ignore

// Context-specific variants
export const createBasicRouteMatchers = <
  CrawlerCtx extends BasicCrawlingContext = BasicCrawlingContext,
  RouterCtx extends Record<string, any> = Record<string, any>,
  Labels extends string = string
>(matchers: RouteMatcher<CrawlerCtx, RouterCtx, Labels>[]) => matchers; // prettier-ignore
export const createHttpRouteMatchers = <
  CrawlerCtx extends HttpCrawlingContext = HttpCrawlingContext,
  RouterCtx extends Record<string, any> = Record<string, any>,
  Labels extends string = string
>(matchers: RouteMatcher<CrawlerCtx, RouterCtx, Labels>[]) => matchers; // prettier-ignore
export const createJsdomRouteMatchers = <
  CrawlerCtx extends JSDOMCrawlingContext = JSDOMCrawlingContext,
  RouterCtx extends Record<string, any> = Record<string, any>,
  Labels extends string = string
>(matchers: RouteMatcher<CrawlerCtx, RouterCtx, Labels>[]) => matchers; // prettier-ignore
export const createCheerioRouteMatchers = <
CrawlerCtx extends CheerioCrawlingContext = CheerioCrawlingContext,
  RouterCtx extends Record<string, any> = Record<string, any>,
  Labels extends string = string
>(matchers: RouteMatcher<CrawlerCtx, RouterCtx, Labels>[]) => matchers; // prettier-ignore
export const createPlaywrightRouteMatchers = <
  CrawlerCtx extends PlaywrightCrawlingContext = PlaywrightCrawlingContext,
  RouterCtx extends Record<string, any> = Record<string, any>,
  Labels extends string = string
>(matchers: RouteMatcher<CrawlerCtx, RouterCtx, Labels>[]) => matchers; // prettier-ignore
export const createPuppeteerRouteMatchers = <
  CrawlerCtx extends PuppeteerCrawlingContext = PuppeteerCrawlingContext,
  RouterCtx extends Record<string, any> = Record<string, any>,
  Labels extends string = string
>(matchers: RouteMatcher<CrawlerCtx, RouterCtx, Labels>[]) => matchers; // prettier-ignore

export const registerHandlers = async <
  CrawlerCtx extends CrawlingContext,
  RouterCtx extends Record<string, any> = Record<string, any>,
  Labels extends string = string
>({
  router,
  routerWrappers,
  routerContext,
  routeHandlers,
}: {
  router: CrawlerRouter<CrawlerCtx>;
  routerWrappers?: CrawlerRouterWrapper<CrawlerCtx, RouterCtx>[];
  routerContext?: RouterCtx;
  routeHandlers: Record<Labels, RouteHandler<CrawlerCtx, RouterCtx>>;
}) => {
  await serialAsyncMap(Object.entries(routeHandlers), async ([key, handler]) => {
    const wrappedHandler = (routerWrappers ?? []).reduceRight(
      (fn, wrapper) => wrapper((ctx) => fn(ctx)),
      handler as (ctx: RouterHandlerCtx<CrawlerCtx & RouterCtx>) => Promise<void>
    );
    await router.addHandler<CrawlerCtx>(key, async (ctx) =>
      wrappedHandler({ ...routerContext, ...ctx } as any)
    );
  });
};

/**
 * Configures the default router handler to redirect URLs to labelled route handlers
 * based on which route the URL matches first.
 *
 * NOTE: This does mean that the URLs passed to this default handler will be fetched
 * twice (as the URL will be requeued to the correct handler). We recommend to use this
 * function only in the scenarios where there is a small number of startUrls, yet these
 * may need various ways of processing based on different paths or etc.
 *
 * @example
 *
 * const routeLabels = {
 *   MAIN_PAGE: 'MAIN_PAGE',
 *   JOB_LISTING: 'JOB_LISTING',
 *   JOB_DETAIL: 'JOB_DETAIL',
 *   JOB_RELATED_LIST: 'JOB_RELATED_LIST',
 *   PARTNERS: 'PARTNERS',
 * } as const;
 *
 * const router = createPlaywrightRouter();
 *
 * const routes = createPlaywrightRouteMatchers<typeof routeLabels>([
 *  // URLs that match this route are redirected to router.addHandler(routeLabels.MAIN_PAGE)
 *  {
 *     route: routeLabels.MAIN_PAGE,
 *     // Check for main page like https://www.profesia.sk/?#
 *     match: (url) => url.match(/[\W]profesia\.sk\/?(?:[?#~]|$)/i),
 *   },
 *
 *  // Optionally override the logic that assigns the URL to the route by specifying the `action` prop
 *  {
 *     route: routeLabels.MAIN_PAGE,
 *     // Check for main page like https://www.profesia.sk/?#
 *     match: (url) => url.match(/[\W]profesia\.sk\/?(?:[?#~]|$)/i),
 *     action: async (ctx) => {
 *       await ctx.crawler.addRequests([{
 *         url: 'https://profesia.sk/praca',
 *         label: routeLabels.JOB_LISTING,
 *       }]);
 *     },
 *   },
 * ]);
 *
 * // Set up default route to redirect to labelled routes
 * setupDefaultRoute({ router, routes });
 *
 * // Now set up the labelled routes
 * await router.addHandler(routeLabels.JOB_LISTING, async (ctx) => { ... }
 */
export const setupDefaultRoute = async <
  CrawlerCtx extends CrawlingContext,
  RouterCtx extends Record<string, any> = Record<string, any>,
  Labels extends string = string,
  Input extends Record<string, any> = Record<string, any>
>({
  router,
  routerWrappers,
  routerContext,
  routes,
  routeHandlers,
  input,
}: {
  router: CrawlerRouter<CrawlerCtx>;
  routerWrappers?: CrawlerRouterWrapper<CrawlerCtx, RouterCtx>[];
  routerContext?: RouterCtx;
  routes: RouteMatcher<CrawlerCtx, RouterCtx, Labels>[];
  routeHandlers: Record<Labels, RouteHandler<CrawlerCtx, RouterCtx>>;
  input?: Input | null;
}) => {
  const { perfBatchSize } = (input || {}) as PerfActorInput;

  /** Redirect the URL to the labelled route identical to route's name */
  // prettier-ignore
  const defaultAction: RouteMatcher<CrawlerCtx, RouterCtx, Labels>['action'] = async (url, ctx, route) => {
    const handler = route.handlerLabel != null && routeHandlers[route.handlerLabel];
    if (!handler) {
      ctx.log.error(`No handler found for route ${route.name} (${route.handlerLabel}). URL will not be processed. URL: ${url}`); // prettier-ignore
      return;
    }
    ctx.log.info(`Passing URL to handler ${route.handlerLabel}. URL: ${url}`);
    await handler(ctx as any);
  };

  const defaultHandler = async (ctx: RouterHandlerCtx<CrawlerCtx & RouterCtx>): Promise<void> => {
    const { page, log: parentLog } = ctx;
    const log = parentLog.child({ prefix: '[Router] ' });

    const reqQueue = await Actor.openRequestQueue();

    let handledRequestsCount = 0;
    let req: CrawlerRequest | null = ctx.request;

    const loadNextRequest = async () => {
      const newReq = await reqQueue.fetchNextRequest();
      req = newReq ?? null;
      handledRequestsCount++;
    };

    const hasBatchReqs = () =>
      perfBatchSize != null && req != null && handledRequestsCount < perfBatchSize;

    try {
      do {
        const url = page ? await (page as any as CommonPage).url() : req?.loadedUrl || req?.url;
        const logSuffix = `Batch ${handledRequestsCount + 1} of ${perfBatchSize ?? 1}. URL: ${url}`;

        // Find route handler for given URL
        log.debug(`Searching for a handler for given Request. ${logSuffix}`);
        const route = await serialAsyncFind(routes, async (currRoute) => {
          const isMatch = await currRoute.match(url, ctx, currRoute, routeHandlers);
          return isMatch;
        });

        // Run the handler
        if (route) {
          log.info(`URL matched route ${route.name} (handlerLabel: ${route.handlerLabel}). ${logSuffix}`); // prettier-ignore
          await (route.action ?? defaultAction)(url, ctx, route, routeHandlers);
        } else {
          log.error(`No route matched URL. URL will not be processed. ${logSuffix}`);
        }

        await reqQueue.markRequestHandled(req);

        // Load next request if possible
        if (perfBatchSize != null) log.debug(`Checking for new Request in the queue. ${logSuffix}`); // prettier-ignore
        await loadNextRequest();
      } while (hasBatchReqs());
    } catch (err) {
      log.error(`Failed to process a request, returning it to the queue. URL: ${req?.loadedUrl || req?.url}.`); // prettier-ignore
      log.error(err);
      // Reinsert the request into the queue if we failed to process it due to an error
      if (req) await reqQueue.reclaimRequest(req);
    }
  };

  const wrappedHandler = (routerWrappers ?? []).reduceRight(
    (fn, wrapper) => wrapper(fn),
    defaultHandler
  );
  await router.addDefaultHandler<CrawlerCtx>((ctx) =>
    wrappedHandler({ ...routerContext, ...ctx } as any)
  );
};
