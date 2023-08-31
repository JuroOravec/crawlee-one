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
    route: CrawleeOneRouteMatcher<Labels, RouterCtx, CrawlerCtx>,
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
    route: CrawleeOneRouteMatcher<Labels, RouterCtx, CrawlerCtx>,
    handlers: Record<Labels, CrawleeOneRouteHandler<CrawlerCtx, RouterCtx>>
  ) => MaybePromise<void>;
}

/** Utility function that helps with typing the route definitions. */
export const createRouteMatchers = <
  Labels extends string = string,
  RouterCtx extends Record<string, any> = Record<string, any>,
  CrawlerCtx extends CrawlingContext = CrawlingContext<BasicCrawler>
>(matchers: CrawleeOneRouteMatcher<Labels, RouterCtx, CrawlerCtx>[]) => matchers; // prettier-ignore

// Context-specific variants
/** Utility function that helps with typing the route definitions. */
export const createBasicRouteMatchers = <
  Labels extends string = string,
  RouterCtx extends Record<string, any> = Record<string, any>,
  CrawlerCtx extends BasicCrawlingContext = BasicCrawlingContext,
>(matchers: CrawleeOneRouteMatcher<Labels, RouterCtx, CrawlerCtx>[]) => matchers; // prettier-ignore
/** Utility function that helps with typing the route definitions. */
export const createHttpRouteMatchers = <
  Labels extends string = string,
  RouterCtx extends Record<string, any> = Record<string, any>,
  CrawlerCtx extends HttpCrawlingContext = HttpCrawlingContext,
>(matchers: CrawleeOneRouteMatcher<Labels, RouterCtx, CrawlerCtx>[]) => matchers; // prettier-ignore
/** Utility function that helps with typing the route definitions. */
export const createJsdomRouteMatchers = <
  Labels extends string = string,
  RouterCtx extends Record<string, any> = Record<string, any>,
  CrawlerCtx extends JSDOMCrawlingContext = JSDOMCrawlingContext,
>(matchers: CrawleeOneRouteMatcher<Labels, RouterCtx, CrawlerCtx>[]) => matchers; // prettier-ignore
/** Utility function that helps with typing the route definitions. */
export const createCheerioRouteMatchers = <
Labels extends string = string,
RouterCtx extends Record<string, any> = Record<string, any>,
CrawlerCtx extends CheerioCrawlingContext = CheerioCrawlingContext,
>(matchers: CrawleeOneRouteMatcher<Labels, RouterCtx, CrawlerCtx>[]) => matchers; // prettier-ignore
/** Utility function that helps with typing the route definitions. */
export const createPlaywrightRouteMatchers = <
Labels extends string = string,
RouterCtx extends Record<string, any> = Record<string, any>,
  CrawlerCtx extends PlaywrightCrawlingContext = PlaywrightCrawlingContext,
>(matchers: CrawleeOneRouteMatcher<Labels, RouterCtx, CrawlerCtx>[]) => matchers; // prettier-ignore
/** Utility function that helps with typing the route definitions. */
export const createPuppeteerRouteMatchers = <
Labels extends string = string,
RouterCtx extends Record<string, any> = Record<string, any>,
CrawlerCtx extends PuppeteerCrawlingContext = PuppeteerCrawlingContext,
>(matchers: CrawleeOneRouteMatcher<Labels, RouterCtx, CrawlerCtx>[]) => matchers; // prettier-ignore
