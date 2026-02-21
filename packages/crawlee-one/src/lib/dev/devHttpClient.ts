/**
 * In dev mode, we want to fetch the response from the server only once,
 * and then reuse it on subsequent crawler runs.
 *
 * To do that, we wrap the HTTP client to cache responses for the requests.
 * We intercept `stream()` and `sendRequest()` for all fetches.
 *
 * For stream(): uses AsyncLocalStorage to get the current Request's uniqueKey
 * (respects custom uniqueKey from sampleUrls RequestOptions). Falls back to
 * computing from options when outside request handler context.
 *
 * For sendRequest(): derives uniqueKey from options (handler-initiated fetches
 * to different URLs aren't from the queue).
 *
 * Responses are stored in sidecar files ({requestId}.response.json) next to
 * request queue entries.
 *
 * We tried using `userData` to store the cached response, but it was
 * overwritten when Crawlee calls `markRequestHandled()`, which passes
 * the crawler's request (without our cached response) to `updateRequest()`,
 * fully replacing the stored request.
 */

import { AsyncLocalStorage } from 'node:async_hooks';
import { Readable } from 'node:stream';
import { Request, type RequestQueue } from 'crawlee';

import type { HttpResponse } from '../../types.js';
import { loadCachedResponse, saveResponseToCache } from './devResponseCache.js';

/**
 * Use `AsyncLocalStorage` to provide data deeply without having to pass it through
 * function calls. We want to provide the Request object, because it contains the uniqueKey.
 *
 * By default `uniqueKey` is computed from the request URL. But it can be also
 * completely customized, setting it to value that has nothing to do with
 * the request URL. So we can't rely on re-computing the uniqueKey from the request options.
 *
 * That's why we store the Request object in the AsyncLocalStorage, to access
 * the actual `Request.uniqueKey` value in the HttpClient wrapper.
 */
export const devRequestStore = new AsyncLocalStorage<Request>();

type HttpClientLike = {
  stream: (options: Record<string, unknown>) => Promise<StreamResponseLike>;
  sendRequest: (options: Record<string, unknown>) => Promise<FullResponseLike>;
};

/** Crawlee uses `stream` for the response body and expects `url` on the response */
type StreamResponseLike = {
  statusCode: number;
  headers: Record<string, string>;
  url?: string;
  stream?: NodeJS.ReadableStream;
  body?: NodeJS.ReadableStream;
};

type FullResponseLike = {
  statusCode: number;
  headers: Record<string, string>;
  body: string | Buffer;
};

export interface DevHttpClientOptions {
  underlying: HttpClientLike;
  devQueue: RequestQueue;
  /** Directory for response cache files; same as request queue storage dir */
  responseCacheDir: string;
}

/**
 * Create an HTTP client wrapper that caches responses for sample URLs.
 *
 * Responses are stored in sidecar files so they survive markRequestHandled overwrites,
 * e.g. `a8h8h8h2h3h4h5.response.json`.
 *
 * @param opts - Options for the HTTP client wrapper.
 * @param opts.underlying - The underlying HTTP client to wrap.
 * @param opts.devQueue - The dev RequestQueue to use.
 * @param opts.responseCacheDir - The directory to store the cached responses.
 *
 * @returns The wrapped HTTP client.
 *
 * @example
 * ```ts
 * const client = createDevHttpClient({
 *   underlying: new HttpClient(),
 *   devQueue: new RequestQueue(),
 *   responseCacheDir: './response-cache',
 * });
 *
 * const response = await client.sendRequest({ url: 'https://example.com' });
 * console.log(response.body);
 * ```
 */
export function createDevHttpClient(opts: DevHttpClientOptions): HttpClientLike {
  const { underlying, devQueue, responseCacheDir } = opts;

  return {
    stream: async (options: Record<string, unknown>) => {
      const request = devRequestStore.getStore();
      const uniqueKey = request?.uniqueKey ?? computeUniqueKeyFromOptions(options);
      const requestUrl = String(options.url ?? '');

      const cached = await loadCachedResponse(responseCacheDir, devQueue, uniqueKey);
      if (cached) {
        console.log(`[crawlee-one] Dev cache hit: ${requestUrl}`);
        return createFakeStreamResponse(cached, requestUrl);
      }

      const response = await underlying.stream(options);
      const serialized = await serializeStreamResponse(response);
      await saveResponseToCache(responseCacheDir, uniqueKey, serialized);
      return createFakeStreamResponse(serialized, requestUrl);
    },

    sendRequest: async (options: Record<string, unknown>) => {
      const uniqueKey = computeUniqueKeyFromOptions(options);

      const cached = await loadCachedResponse(responseCacheDir, devQueue, uniqueKey);
      if (cached) {
        console.log(`[crawlee-one] Dev cache hit: ${String(options.url ?? '')}`);
        return createFakeFullResponse(cached);
      }

      const response = await underlying.sendRequest(options);
      const serialized: HttpResponse = {
        statusCode: response.statusCode,
        headers: response.headers ?? {},
        body:
          typeof response.body === 'string'
            ? response.body
            : Buffer.isBuffer(response.body)
              ? response.body
              : Buffer.from(String(response.body)),
      };
      await saveResponseToCache(responseCacheDir, uniqueKey, serialized);
      return response;
    },
  };
}

function computeUniqueKeyFromOptions(options: Record<string, unknown>): string {
  const url = String(options.url ?? '');
  const method = (options.method as 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH') ?? 'GET';
  const payload = options.payload as string | Buffer | undefined;
  return Request.computeUniqueKey({ url, method, payload });
}

function createFakeStreamResponse(cached: HttpResponse, url?: string): StreamResponseLike {
  const stream = Readable.from(
    typeof cached.body === 'string' ? Buffer.from(cached.body, 'utf-8') : cached.body
  );
  return {
    statusCode: cached.statusCode,
    headers: cached.headers ?? {},
    url: url ?? (cached as HttpResponse & { url?: string }).url,
    stream,
  };
}

function createFakeFullResponse(cached: HttpResponse): FullResponseLike {
  return {
    statusCode: cached.statusCode,
    headers: cached.headers ?? {},
    body: cached.body,
  };
}

function serializeStreamResponse(res: StreamResponseLike): Promise<HttpResponse> {
  const readable = res.stream ?? res.body;
  if (!readable) {
    return Promise.reject(new Error('Response has neither stream nor body; cannot serialize'));
  }
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    readable.on('data', (chunk: Buffer) => chunks.push(chunk));
    readable.on('end', () =>
      resolve({
        statusCode: res.statusCode,
        headers: res.headers ?? {},
        body: Buffer.concat(chunks).toString('utf-8'),
      })
    );
    readable.on('error', reject);
  });
}
