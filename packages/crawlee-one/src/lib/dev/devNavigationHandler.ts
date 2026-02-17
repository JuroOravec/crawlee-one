/**
 * In dev mode, we want to fetch the response from the server only once,
 * and then reuse it on subsequent crawler runs.
 *
 * When the crawler uses HttpClient, we wrap it in the `devHttpClient`.
 * But for browser crawlers (Playwright, Puppeteer), we need to wrap the navigation handler.
 *
 * We intercept `page.goto()` and `page.waitForNavigation()` to check/save the response.
 */

import type { Request, RequestQueue } from 'crawlee';
import type { CrawlingContext } from 'crawlee';

import type { HttpResponse } from '../../types.js';
import { computeRequestIdFromUniqueKey } from './utils.js';

const DEV_RESPONSE_KEY = 'response';

export interface WrapNavigationHandlerOptions {
  devQueue: RequestQueue;
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
  const { devQueue } = opts;

  return async (ctx: Ctx, gotoOptions?: Record<string, unknown>) => {
    const { request, page } = ctx;
    const uniqueKey = request.uniqueKey;

    const cached = await loadCachedResponse(devQueue, uniqueKey);

    if (cached) {
      const body = typeof cached.body === 'string' ? cached.body : String(cached.body);
      await page.setContent(body);
      return {
        status: cached.statusCode,
        headers: cached.headers ?? {},
        ok: cached.statusCode >= 200 && cached.statusCode < 300,
        url: request.url,
        text: () => Promise.resolve(body),
      };
    }

    const response = await origNavigationHandler(ctx, gotoOptions);
    const res = response as {
      status?: number;
      statusCode?: number;
      headers?: Record<string, string>;
      text?: () => Promise<string>;
    };
    const statusCode = res.status ?? res.statusCode ?? 200;
    const headers = res.headers ?? {};
    const body = res.text ? await res.text() : '';

    const serialized: HttpResponse = {
      statusCode,
      headers,
      body,
    };
    await saveResponseToRequest(
      devQueue,
      request as { uniqueKey: string; userData: Record<string, unknown> },
      serialized
    );

    return response;
  };
}

async function loadCachedResponse(
  devQueue: RequestQueue,
  uniqueKey: string
): Promise<HttpResponse | null> {
  const requestId = computeRequestIdFromUniqueKey(uniqueKey);
  const request = await devQueue.getRequest(requestId);
  if (!request?.userData?.[DEV_RESPONSE_KEY]) return null;
  return request.userData[DEV_RESPONSE_KEY] as HttpResponse;
}

async function saveResponseToRequest(
  devQueue: RequestQueue,
  request: { uniqueKey: string; userData: Record<string, unknown> },
  response: HttpResponse
): Promise<void> {
  request.userData[DEV_RESPONSE_KEY] = response;
  const requestId = computeRequestIdFromUniqueKey(request.uniqueKey);
  const req = await devQueue.getRequest(requestId);
  if (req) {
    (req.userData as Record<string, unknown>)[DEV_RESPONSE_KEY] = response;
    const client = (devQueue as { client?: { updateRequest?: (r: Request) => Promise<unknown> } })
      .client;
    if (client?.updateRequest) {
      await client.updateRequest(req);
    }
  }
}
