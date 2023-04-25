import {
  BasicCrawler,
  BasicCrawlingContext,
  CheerioCrawlingContext,
  CrawlingContext,
  HttpCrawlingContext,
  JSDOMCrawlingContext,
  PlaywrightCrawlingContext,
  PuppeteerCrawlingContext,
  RouterHandler,
} from 'crawlee';
import type { CommonPage } from '@crawlee/browser-pool';

import type { MaybePromise } from '../utils/types';
import { serialAsyncMap } from '../utils/async';

// Read about router on https://docs.apify.com/academy/expert-scraping-with-apify/solutions/using-storage-creating-tasks

/** Function that's passed to `router.addHandler(label, handler)`  */
export type RouteHandler<Ctx extends CrawlingContext = CrawlingContext<BasicCrawler>> = Parameters<RouterHandler<Ctx>['addHandler']>[1]; // prettier-ignore
export type RouteHandlerCtx<Ctx extends CrawlingContext> = Parameters<RouteHandler<Ctx>>[0]; // prettier-ignore
export type RouteHandlerWrapper<Ctx extends CrawlingContext = CrawlingContext<BasicCrawler>> = (
  handler: (ctx: RouteHandlerCtx<Ctx>) => Promise<void>
) => (ctx: RouteHandlerCtx<Ctx>) => Promise<void>;

/**
 * Criteria that un-labelled requests are matched against.
 *
 * E.g. If `match` function returns truthy value,
 * the request is passed to the `action` function for processing.
 */
export interface RouteMatcher<
  Ctx extends CrawlingContext = CrawlingContext<BasicCrawler>,
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
    ctx: Ctx,
    route: RouteMatcher<Ctx, Labels>,
    handlers: Record<Labels, RouteHandler<Ctx>>
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
    ctx: Ctx,
    route: RouteMatcher<Ctx, Labels>,
    handlers: Record<Labels, RouteHandler<Ctx>>
  ) => MaybePromise<void>;
}

export const createRouteMatchers = <
  Ctx extends CrawlingContext = CrawlingContext<BasicCrawler>,
  Labels extends string = string
>(matchers: RouteMatcher<Ctx, Labels>[]) => matchers; // prettier-ignore

// Context-specific variants
export const createBasicRouteMatchers = <
  Ctx extends BasicCrawlingContext = BasicCrawlingContext,
  Labels extends string = string
>(matchers: RouteMatcher<Ctx, Labels>[]) => matchers; // prettier-ignore
export const createHttpRouteMatchers = <
  Ctx extends HttpCrawlingContext = HttpCrawlingContext,
  Labels extends string = string
>(matchers: RouteMatcher<Ctx, Labels>[]) => matchers; // prettier-ignore
export const createJsdomRouteMatchers = <
  Labels extends string,
  Ctx extends JSDOMCrawlingContext = JSDOMCrawlingContext
>(matchers: RouteMatcher<Ctx, Labels>[]) => matchers; // prettier-ignore
export const createCheerioRouteMatchers = <
  Ctx extends CheerioCrawlingContext = CheerioCrawlingContext,
  Labels extends string = string,
>(matchers: RouteMatcher<Ctx, Labels>[]) => matchers; // prettier-ignore
export const createPlaywrightRouteMatchers = <
  Ctx extends PlaywrightCrawlingContext = PlaywrightCrawlingContext,
  Labels extends string = string,
>(matchers: RouteMatcher<Ctx, Labels>[]) => matchers; // prettier-ignore
export const createPuppeteerRouteMatchers = <
  Ctx extends PuppeteerCrawlingContext = PuppeteerCrawlingContext,
  Labels extends string = string,
>(matchers: RouteMatcher<Ctx, Labels>[]) => matchers; // prettier-ignore

export const registerHandlers = async <
  Ctx extends CrawlingContext = CrawlingContext<BasicCrawler>,
  Labels extends string = string
>({
  router,
  handlers,
  handlerWrappers,
}: {
  router: RouterHandler<Ctx>;
  handlers: Record<Labels, RouteHandler<Ctx>>;
  handlerWrappers?: RouteHandlerWrapper<Ctx>[];
}) => {
  await serialAsyncMap(Object.entries(handlers), async ([key, handler]) => {
    const wrappedHandler = (handlerWrappers ?? []).reduceRight(
      (fn, wrapper) => wrapper(fn),
      handler as any
    );
    await router.addHandler(key, wrappedHandler);
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
 * setupDefaultRoute(router, routes);
 *
 * // Now set up the labelled routes
 * await router.addHandler(routeLabels.JOB_LISTING, async (ctx) => { ... }
 */
export const setupDefaultRoute = async <Ctx extends CrawlingContext, Labels extends string>({
  router,
  routes,
  handlers,
  handlerWrappers,
}: {
  router: RouterHandler<Ctx>;
  routes: RouteMatcher<Ctx, Labels>[];
  handlers: Record<Labels, RouteHandler<Ctx>>;
  handlerWrappers?: RouteHandlerWrapper<Ctx>[];
}) => {
  /** Redirect the URL to the labelled route identical to route's name */
  const defaultAction: RouteMatcher<Ctx, Labels>['action'] = async (url, ctx, route) => {
    const handler = route.handlerLabel != null && handlers[route.handlerLabel];
    if (!handler) {
      ctx.log.error(`No handler found for route ${route.name} (${route.handlerLabel}). URL will not be processed. URL: ${url}`); // prettier-ignore
      return;
    }
    ctx.log.info(`Passing URL to handler ${route.handlerLabel}. URL: ${url}`);
    await handler(ctx);
  };

  const defaultHandler = async (ctx: RouteHandlerCtx<Ctx>): Promise<void> => {
    const { page, log: parentLog } = ctx;
    const log = parentLog.child({ prefix: '[Router] ' });
    const url = page
      ? await (page as any as CommonPage).url()
      : ctx.request.loadedUrl || ctx.request.url;

    let route: RouteMatcher<Ctx, Labels>;
    for (const currRoute of routes) {
      if (await currRoute.match(url, ctx as any, currRoute as any, handlers)) {
        route = currRoute;
        break;
      }
    }

    if (!route!) {
      log.error(`No route matched URL. URL will not be processed. URL: ${url}`); // prettier-ignore
      return;
    }
    log.info(`URL matched route ${route.name} (handlerLabel: ${route.handlerLabel}). URL: ${url}`);
    await (route.action ?? defaultAction)(url, ctx as any, route as any, handlers);
  };

  const wrappedHandler = (handlerWrappers ?? []).reduceRight(
    (fn, wrapper) => wrapper(fn),
    defaultHandler
  );
  await router.addDefaultHandler<Ctx>(wrappedHandler);
};
