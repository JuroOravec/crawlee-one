/**
 * In dev mode, we want to fetch the response from the server only once,
 * and then reuse it on subsequent crawler runs.
 *
 * When the crawler uses HttpClient, we wrap it in the `devHttpClient`.
 * But for browser crawlers (Playwright, Puppeteer), we need to wrap the navigation handler.
 *
 * We intercept the crawler's _navigationHandler (which calls page.goto/gotoExtended)
 * to check/save the response. Responses are stored in sidecar files ({requestId}.response.json)
 * next to request queue entries, same as HTTP crawlers.
 */

import type { RequestQueue } from 'crawlee';
import type { CrawlingContext } from 'crawlee';

import type { HttpResponse } from '../../types.js';
import { loadCachedResponse, saveResponseToCache } from './devResponseCache.js';

export interface WrapNavigationHandlerOptions {
  devQueue: RequestQueue;
  /** Directory for response cache files; same as request queue storage dir */
  responseCacheDir: string;
}

/**
 * Wrap _navigationHandler for browser crawlers (Playwright, Puppeteer).
 *
 * - On cache hit: set page content from cached HTML and return a stub response.
 * - On cache miss: call original, serialize response, save, return.
 */
export function wrapNavigationHandler<
  Ctx extends CrawlingContext & { page: { setContent: (html: string) => Promise<void> } },
>(
  origNavigationHandler: (ctx: Ctx, gotoOptions?: Record<string, unknown>) => Promise<unknown>,
  opts: WrapNavigationHandlerOptions
): (ctx: Ctx, gotoOptions?: Record<string, unknown>) => Promise<unknown> {
  const { devQueue, responseCacheDir } = opts;

  return async (ctx: Ctx, gotoOptions?: Record<string, unknown>) => {
    const { request, page } = ctx;
    const uniqueKey = request.uniqueKey;

    const cached = await loadCachedResponse(responseCacheDir, devQueue, uniqueKey);

    if (cached) {
      console.log(`[crawlee-one] Dev cache hit: ${request.url}`);
      const body = typeof cached.body === 'string' ? cached.body : String(cached.body);
      await page.setContent(body);
      return {
        // Must be a function: Crawlee's browser crawler (isRequestBlocked, _responseHandler) calls
        // response.status(). Playwright/Puppeteer Response uses status() as a method.
        // HTTP crawlers use statusCode (property) but they don't hit this code path.
        status: () => cached.statusCode,
        headers: cached.headers ?? {},
        ok: cached.statusCode >= 200 && cached.statusCode < 300,
        url: request.url,
        text: () => Promise.resolve(body),
      };
    }

    const response = await origNavigationHandler(ctx, gotoOptions);
    const res = response as {
      status?: number | (() => number);
      statusCode?: number;
      headers?: Record<string, string>;
      text?: () => Promise<string>;
    };
    // Playwright/Puppeteer Response uses status() as a method, not status as property
    const statusCode =
      typeof res.status === 'function'
        ? res.status()
        : ((res.status as number) ?? res.statusCode ?? 200);
    const headers = res.headers ?? {};
    const body = res.text ? await res.text() : '';

    const serialized: HttpResponse = {
      statusCode,
      headers,
      body,
    };
    await saveResponseToCache(responseCacheDir, request.uniqueKey, serialized);

    return response;
  };
}
