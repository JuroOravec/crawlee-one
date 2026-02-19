import type { RouterHandler as CrawlerRouter, Awaitable } from 'crawlee';

import type { SampleUrlItem } from '../../types.js';
import type { MaybeArray, MaybePromise } from '../../utils/types.js';
import type { CrawleeOneTypes } from '../actor/types.js';

/** Context object provided in CrawlerRouter */
export type CrawleeOneRouteCtx<
  T extends CrawleeOneTypes,
  RouterCtx extends Record<string, any> = {},
> = Parameters<Parameters<CrawlerRouter<T['context'] & RouterCtx>['addHandler']>[1]>[0];

/** Function that's passed to `router.addHandler(label, handler)` */
export type CrawleeOneRouteHandler<
  T extends CrawleeOneTypes,
  RouterCtx extends Record<string, any> = CrawleeOneRouteCtx<T>,
> = Parameters<CrawlerRouter<T['context'] & RouterCtx>['addHandler']>[1]; // prettier-ignore

/** Wrapper that modifies behavior of CrawleeOneRouteHandler */
export type CrawleeOneRouteWrapper<
  T extends CrawleeOneTypes,
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
  T extends CrawleeOneTypes,
  RouterCtx extends Record<string, any> = CrawleeOneRouteCtx<T>,
> {
  match: CrawleeOneRouteMatcher<T, RouterCtx>;
  handler: CrawleeOneRouteHandler<T, RouterCtx>;
  /**
   * Sample URLs used by `crawlee-one dev`.
   *
   * Can be URL strings, RequestOptions-like objects, pre-loaded `{ request, response }`
   * pairs, or a function that returns any of these (for dynamic/auth-gated pages).
   *
   * @example
   * {
   *   sampleUrls: [
   *     // URL string - make a GET request to the server
   *     'https://example.com/',
   *     // Request object - make a custom request to the server
   *     {
   *       url: 'https://example.com/page/2',
   *       method: 'POST',
   *       headers: { 'Content-Type': 'application/json' }
   *       body: '...',
   *     },
   *     // Pre-loaded `{ request, response }` pair - will skip server request
   *     // and instead return the pre-loaded response (useful for testing).
   *     {
   *       request: { url: 'https://example.com/page/3' },
   *       response: { statusCode: 200, body: '...' }
   *     },
   *     // Async function that returns `SampleUrlItem[]`.
   *     // Use if the page requires authentication - you can load the page,
   *     // authenticate, and then return the `SampleUrlItem[]`.
   *     async () => {
   *       const browser = await chromium.launch();
   *       const page = await browser.newPage();
   *       await page.goto('https://example.com/login');
   *       await page.fill('input[name="username"]', 'username');
   *       await page.fill('input[name="password"]', 'password');
   *       await page.click('button[type="submit"]');
   *       const body = await page.content();
   *       return {
   *         request: { url: 'https://example.com/page/4' },
   *         response: { statusCode: 200, body }
   *       };
   *     },
   *   ],
   * }
   */
  sampleUrls?: (SampleUrlItem | (() => MaybePromise<MaybeArray<SampleUrlItem>>))[];
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
  T extends CrawleeOneTypes,
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
  T extends CrawleeOneTypes,
  RouterCtx extends Record<string, any> = CrawleeOneRouteCtx<T>,
> = (
  url: string,
  ctx: CrawleeOneRouteCtx<T, RouterCtx>,
  route: CrawleeOneRoute<T, RouterCtx>,
  routes: Record<T['labels'], CrawleeOneRoute<T, RouterCtx>>
) => unknown;
