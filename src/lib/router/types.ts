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
} from 'crawlee';

import type { MaybeArray, MaybePromise } from '../../utils/types';

/** Context object provided in CrawlerRouter */
export type CrawleeOneRouteCtx<CrawlerCtx extends CrawlingContext> = Parameters<
  Parameters<CrawlerRouter<CrawlerCtx>['addHandler']>[1]
>[0];

/** Function that's passed to `router.addHandler(label, handler)` */
export type CrawleeOneRouteHandler<
  CrawlerCtx extends CrawlingContext = CrawlingContext<BasicCrawler>,
  RouterCtx extends Record<string, any> = Record<string, any>,
> = Parameters<CrawlerRouter<CrawleeOneRouteCtx<CrawlerCtx & RouterCtx>>['addHandler']>[1]; // prettier-ignore

/** Wrapper that modifies behavior of CrawleeOneRouteHandler */
export type CrawleeOneRouteWrapper<
  CrawlerCtx extends CrawlingContext = CrawlingContext<BasicCrawler>,
  RouterCtx extends Record<string, any> = Record<string, any>
> = (
  handler: (ctx: CrawleeOneRouteCtx<CrawlerCtx & RouterCtx>) => Promise<void>
) => MaybePromise<(ctx: CrawleeOneRouteCtx<CrawlerCtx & RouterCtx>) => Promise<void>>;

/**
 * Route that a request will be sent to if the request doesn't have a label yet,
 * and if the `match` function returns truthy value.
 *
 * If `match` function returns truthy value, the request is passed to the `action`
 * function for processing.
 */
export interface CrawleeOneRoute<
  Labels extends string = string,
  RouterCtx extends Record<string, any> = Record<string, any>,
  CrawlerCtx extends CrawlingContext = CrawlingContext<BasicCrawler>
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
   * Function, RegExp, or a list of the two, that decides whether the request will processed
   * by this `action` function.
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
  match: CrawleeOneRouteMatcher<Labels, RouterCtx, CrawlerCtx>;
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
    ctx: CrawleeOneRouteCtx<CrawlerCtx>,
    route: CrawleeOneRoute<Labels, RouterCtx, CrawlerCtx>,
    handlers: Record<Labels, CrawleeOneRouteHandler<CrawlerCtx, RouterCtx>>
  ) => MaybePromise<void>;
}

/**
 * Function or RegExp that checks if the {@link CrawleeOneRoute} this Matcher belongs to
 * should handle the given request.
 *
 * If the Matcher returns truthy value, the request is passed to the `action`
 * function of the same CrawleeOneRoute.
 *
 * The Matcher can be:
 * - Regular expression
 * - Function
 * - Array of <RegExp | Function>
 */
export type CrawleeOneRouteMatcher<
  Labels extends string = string,
  RouterCtx extends Record<string, any> = Record<string, any>,
  CrawlerCtx extends CrawlingContext = CrawlingContext<BasicCrawler>
> = MaybeArray<RegExp | CrawleeOneRouteMatcherFn<Labels, RouterCtx, CrawlerCtx>>;

/**
 * Function variant of Matcher. Matcher that checks if the {@link CrawleeOneRoute}
 * this Matcher belongs to should handle the given request.
 *
 * If the Matcher returns truthy value, the request is passed to the `action`
 * function of the same CrawleeOneRoute.
 */
export type CrawleeOneRouteMatcherFn<
  Labels extends string = string,
  RouterCtx extends Record<string, any> = Record<string, any>,
  CrawlerCtx extends CrawlingContext = CrawlingContext<BasicCrawler>
> = (
  url: string,
  ctx: CrawleeOneRouteCtx<CrawlerCtx & RouterCtx>,
  route: CrawleeOneRoute<Labels, RouterCtx, CrawlerCtx>,
  handlers: Record<Labels, CrawleeOneRouteHandler<CrawlerCtx, RouterCtx>>
) => unknown;

/** Utility function that helps with typing the route definitions. */
export const createRoutes = <
  Labels extends string = string,
  RouterCtx extends Record<string, any> = Record<string, any>,
  CrawlerCtx extends CrawlingContext = CrawlingContext<BasicCrawler>
>(routes: CrawleeOneRoute<Labels, RouterCtx, CrawlerCtx>[]) => routes; // prettier-ignore

// Context-specific variants
/** Utility function that helps with typing the route definitions. */
export const createBasicRoutes = <
  Labels extends string = string,
  RouterCtx extends Record<string, any> = Record<string, any>,
  CrawlerCtx extends BasicCrawlingContext = BasicCrawlingContext,
>(routes: CrawleeOneRoute<Labels, RouterCtx, CrawlerCtx>[]) => routes; // prettier-ignore
/** Utility function that helps with typing the route definitions. */
export const createHttpRoutes = <
  Labels extends string = string,
  RouterCtx extends Record<string, any> = Record<string, any>,
  CrawlerCtx extends HttpCrawlingContext = HttpCrawlingContext,
>(routes: CrawleeOneRoute<Labels, RouterCtx, CrawlerCtx>[]) => routes; // prettier-ignore
/** Utility function that helps with typing the route definitions. */
export const createJsdomRoutes = <
  Labels extends string = string,
  RouterCtx extends Record<string, any> = Record<string, any>,
  CrawlerCtx extends JSDOMCrawlingContext = JSDOMCrawlingContext,
>(routes: CrawleeOneRoute<Labels, RouterCtx, CrawlerCtx>[]) => routes; // prettier-ignore
/** Utility function that helps with typing the route definitions. */
export const createCheerioRoutes = <
Labels extends string = string,
RouterCtx extends Record<string, any> = Record<string, any>,
CrawlerCtx extends CheerioCrawlingContext = CheerioCrawlingContext,
>(routes: CrawleeOneRoute<Labels, RouterCtx, CrawlerCtx>[]) => routes; // prettier-ignore
/** Utility function that helps with typing the route definitions. */
export const createPlaywrightRoutes = <
Labels extends string = string,
RouterCtx extends Record<string, any> = Record<string, any>,
  CrawlerCtx extends PlaywrightCrawlingContext = PlaywrightCrawlingContext,
>(routes: CrawleeOneRoute<Labels, RouterCtx, CrawlerCtx>[]) => routes; // prettier-ignore
/** Utility function that helps with typing the route definitions. */
export const createPuppeteerRoutes = <
Labels extends string = string,
RouterCtx extends Record<string, any> = Record<string, any>,
CrawlerCtx extends PuppeteerCrawlingContext = PuppeteerCrawlingContext,
>(routes: CrawleeOneRoute<Labels, RouterCtx, CrawlerCtx>[]) => routes; // prettier-ignore
