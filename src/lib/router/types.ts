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

import type { MaybePromise } from '../../utils/types';

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
