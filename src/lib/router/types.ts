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
 * Criteria that un-labelled requests are matched against.
 *
 * E.g. If `match` function returns truthy value,
 * the request is passed to the `action` function for processing.
 */
export interface CrawleeOneRouteMatcher<
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
    ctx: CrawleeOneRouteCtx<CrawlerCtx & RouterCtx>,
    route: CrawleeOneRouteMatcher<CrawlerCtx, RouterCtx, Labels>,
    handlers: Record<Labels, CrawleeOneRouteHandler<CrawlerCtx, RouterCtx>>
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
    ctx: CrawleeOneRouteCtx<CrawlerCtx>,
    route: CrawleeOneRouteMatcher<CrawlerCtx, RouterCtx, Labels>,
    handlers: Record<Labels, CrawleeOneRouteHandler<CrawlerCtx, RouterCtx>>
  ) => MaybePromise<void>;
}

/** Utility function that helps with typing the route definitions. */
export const createRouteMatchers = <
  CrawlerCtx extends CrawlingContext = CrawlingContext<BasicCrawler>,
  RouterCtx extends Record<string, any> = Record<string, any>,
  Labels extends string = string
>(matchers: CrawleeOneRouteMatcher<CrawlerCtx, RouterCtx, Labels>[]) => matchers; // prettier-ignore

// Context-specific variants
/** Utility function that helps with typing the route definitions. */
export const createBasicRouteMatchers = <
  CrawlerCtx extends BasicCrawlingContext = BasicCrawlingContext,
  RouterCtx extends Record<string, any> = Record<string, any>,
  Labels extends string = string
>(matchers: CrawleeOneRouteMatcher<CrawlerCtx, RouterCtx, Labels>[]) => matchers; // prettier-ignore
/** Utility function that helps with typing the route definitions. */
export const createHttpRouteMatchers = <
  CrawlerCtx extends HttpCrawlingContext = HttpCrawlingContext,
  RouterCtx extends Record<string, any> = Record<string, any>,
  Labels extends string = string
>(matchers: CrawleeOneRouteMatcher<CrawlerCtx, RouterCtx, Labels>[]) => matchers; // prettier-ignore
/** Utility function that helps with typing the route definitions. */
export const createJsdomRouteMatchers = <
  CrawlerCtx extends JSDOMCrawlingContext = JSDOMCrawlingContext,
  RouterCtx extends Record<string, any> = Record<string, any>,
  Labels extends string = string
>(matchers: CrawleeOneRouteMatcher<CrawlerCtx, RouterCtx, Labels>[]) => matchers; // prettier-ignore
/** Utility function that helps with typing the route definitions. */
export const createCheerioRouteMatchers = <
CrawlerCtx extends CheerioCrawlingContext = CheerioCrawlingContext,
  RouterCtx extends Record<string, any> = Record<string, any>,
  Labels extends string = string
>(matchers: CrawleeOneRouteMatcher<CrawlerCtx, RouterCtx, Labels>[]) => matchers; // prettier-ignore
/** Utility function that helps with typing the route definitions. */
export const createPlaywrightRouteMatchers = <
  CrawlerCtx extends PlaywrightCrawlingContext = PlaywrightCrawlingContext,
  RouterCtx extends Record<string, any> = Record<string, any>,
  Labels extends string = string
>(matchers: CrawleeOneRouteMatcher<CrawlerCtx, RouterCtx, Labels>[]) => matchers; // prettier-ignore
/** Utility function that helps with typing the route definitions. */
export const createPuppeteerRouteMatchers = <
  CrawlerCtx extends PuppeteerCrawlingContext = PuppeteerCrawlingContext,
  RouterCtx extends Record<string, any> = Record<string, any>,
  Labels extends string = string
>(matchers: CrawleeOneRouteMatcher<CrawlerCtx, RouterCtx, Labels>[]) => matchers; // prettier-ignore
