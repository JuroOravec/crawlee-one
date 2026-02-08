import type { RouterHandler as CrawlerRouter, Awaitable } from 'crawlee';

import type { MaybeArray, MaybePromise } from '../../utils/types.js';
import type { CrawleeOneCtx } from '../actor/types.js';

/** Context object provided in CrawlerRouter */
export type CrawleeOneRouteCtx<
  T extends CrawleeOneCtx,
  RouterCtx extends Record<string, any> = {},
> = Parameters<Parameters<CrawlerRouter<T['context'] & RouterCtx>['addHandler']>[1]>[0];

/** Function that's passed to `router.addHandler(label, handler)` */
export type CrawleeOneRouteHandler<
  T extends CrawleeOneCtx,
  RouterCtx extends Record<string, any> = CrawleeOneRouteCtx<T>,
> = Parameters<CrawlerRouter<T['context'] & RouterCtx>['addHandler']>[1]; // prettier-ignore

/** Wrapper that modifies behavior of CrawleeOneRouteHandler */
export type CrawleeOneRouteWrapper<
  T extends CrawleeOneCtx,
  RouterCtx extends Record<string, any> = CrawleeOneRouteCtx<T>,
> = (
  handler: (ctx: CrawleeOneRouteCtx<T, RouterCtx>) => Promise<void> | Awaitable<void>
) => MaybePromise<(ctx: CrawleeOneRouteCtx<T, RouterCtx>) => Promise<void> | Awaitable<void>>;

/**
 * Route that a request will be sent to if the request doesn't have a label yet,
 * and if the `match` function returns truthy value.
 *
 * If `match` function returns truthy value, the request is passed to the `action`
 * function for processing.
 *
 * NOTE: If multiple records would match the request, then the first record to match
 * a request will process that request.
 */
export interface CrawleeOneRoute<
  T extends CrawleeOneCtx,
  RouterCtx extends Record<string, any> = CrawleeOneRouteCtx<T>,
> {
  match: CrawleeOneRouteMatcher<T, RouterCtx>;
  handler: CrawleeOneRouteHandler<T, RouterCtx>;
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
  T extends CrawleeOneCtx,
  RouterCtx extends Record<string, any> = CrawleeOneRouteCtx<T>,
> = MaybeArray<RegExp | CrawleeOneRouteMatcherFn<T, RouterCtx>>;

/**
 * Function variant of Matcher. Matcher that checks if the {@link CrawleeOneRoute}
 * this Matcher belongs to should handle the given request.
 *
 * If the Matcher returns truthy value, the request is passed to the `action`
 * function of the same CrawleeOneRoute.
 */
export type CrawleeOneRouteMatcherFn<
  T extends CrawleeOneCtx,
  RouterCtx extends Record<string, any> = CrawleeOneRouteCtx<T>,
> = (
  url: string,
  ctx: CrawleeOneRouteCtx<T, RouterCtx>,
  route: CrawleeOneRoute<T, RouterCtx>,
  routes: Record<T['labels'], CrawleeOneRoute<T, RouterCtx>>
) => unknown;
