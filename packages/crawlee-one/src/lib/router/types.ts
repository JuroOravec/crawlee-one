import type { Awaitable, RouterHandler as CrawlerRouter } from 'crawlee';

import type { SampleUrlItem } from '../../types.js';
import type { MaybeArray, MaybePromise } from '../../utils/types.js';
import type { CrawleeOneRouteHandlerCtxExtras, CrawleeOneTypes } from '../context/types.js';

/**
 * Function that's passed to Crawlee's `router.addHandler(label, handler)`
 *
 * The handler context is enriched with CrawleeOne's `actor`, `pushData`, `addRequests`, etc.
 */
export type CrawleeOneRouteHandler<T extends CrawleeOneTypes> = Parameters<
  CrawlerRouter<T['context'] & CrawleeOneRouteHandlerCtxExtras<T>>['addHandler']
>[1];

/**
 * Handler context - combination of:
 * - Crawlee context as it appears in `Router.addHandler()`
 * - Merged with CrawleeOne's `actor`, `pushData`, `addRequests`, etc.
 */
export type CrawleeOneRouteHandlerCtx<T extends CrawleeOneTypes> = Parameters<
  CrawleeOneRouteHandler<T>
>[0];

/** Wrapper that modifies behavior of CrawleeOneRouteHandler */
export type CrawleeOneRouteMiddleware<T extends CrawleeOneTypes> = (
  handler: (ctx: CrawleeOneRouteHandlerCtx<T>) => Promise<void> | Awaitable<void>
) => MaybePromise<(ctx: CrawleeOneRouteHandlerCtx<T>) => Promise<void> | Awaitable<void>>;

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
export interface CrawleeOneRoute<T extends CrawleeOneTypes> {
  match: CrawleeOneRouteMatcher<T>;
  handler: CrawleeOneRouteHandler<T>;
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
export type CrawleeOneRouteMatcher<T extends CrawleeOneTypes> = MaybeArray<
  RegExp | CrawleeOneRouteMatcherFn<T>
>;

/**
 * Function variant of Matcher. Matcher that checks if the {@link CrawleeOneRoute}
 * this Matcher belongs to should handle the given request.
 *
 * If the Matcher returns truthy value, the request is passed to the `action`
 * function of the same CrawleeOneRoute.
 */
export type CrawleeOneRouteMatcherFn<T extends CrawleeOneTypes> = (
  url: string,
  ctx: CrawleeOneRouteHandlerCtx<T>,
  route: CrawleeOneRoute<T>,
  routes: Record<T['labels'], CrawleeOneRoute<T>>
) => unknown;
