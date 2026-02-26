/**
 * In dev mode, we want to fetch the response from the server only once,
 * and then reuse it on subsequent crawler runs.
 *
 * We also want to run only those URLs defined in the crawler's routes (`route.sampleUrls`).
 *
 * And we want to be able to rerun crawler with the same sample URLs,
 * each time we call `crawlee-one dev` command.
 *
 * To do that, we prepare a custom RequestQueue with the sample URLs.
 *
 * When we run `crawlee-one dev` command, we first add the sample URLs to the queue.
 * And then reclaim any that were already present and handled (so they get re-processed by crawlee).
 *
 * Each crawler has its own queue named `dev-{crawlerName}` so multi-crawler
 * projects can test them independently.
 */

import fs from 'node:fs';
import path from 'node:path';

import { Request, RequestQueue } from 'crawlee';

import type { CrawlerUrl, HttpResponse } from '../../types.js';
import type { MaybeArray, MaybePromise } from '../../utils/types.js';
import type { CrawleeOneRoute } from '../router/types.js';

type SampleUrlItem = CrawlerUrl | { request: CrawlerUrl; response: HttpResponse };

export interface PrepareDevRequestQueueOptions {
  /**
   * Directory containing crawlee-one.config; used for storage path when
   * scanning for handled requests.
   */
  configDir?: string;
  /**
   * Crawler name; used to derive queue dir: `dev-{crawlerName}`.
   * Required for populateDevRequestQueue.
   */
  crawlerName?: string;
}

/** Options for populateDevRequestQueue */
export interface PopulateDevRequestQueueOpts<T extends CrawleeOneRoute<any>> {
  devQueue: RequestQueue;
  routes: Record<string, T>;
  configDir?: string;
  crawlerName?: string;
}

export interface PrepareDevRequestQueueResult {
  devQueue: RequestQueue;
}

/**
 * Open a named dev RequestQueue (without populating it).
 *
 * Use {@link populateDevRequestQueue} to add sample URLs from routes.
 *
 * Queue name: `dev-{crawlerName}` (e.g. `dev-profesia`).
 */
export function openDevRequestQueue(crawlerName: string): Promise<RequestQueue> {
  return RequestQueue.open(`dev-${crawlerName}`);
}

/**
 * Add sample URLs from routes to the dev RequestQueue and reclaim any
 * that were already present and handled (so they get re-fetched).
 *
 * Used in dev mode when context.routes is available (e.g. from devOnReady).
 */
export async function populateDevRequestQueue<T extends CrawleeOneRoute<any>>(
  opts: PopulateDevRequestQueueOpts<T>
): Promise<void> {
  const { devQueue, routes, configDir, crawlerName } = opts;
  const queueName = crawlerName
    ? `dev-${crawlerName}`
    : ((devQueue as { id?: string }).id ?? 'dev-default');
  const items = await resolveSampleUrls(routes);

  for (const item of items) {
    const request = sampleItemToRequest(item);

    const result = await devQueue.addRequest(request);
    const requestId = (result as { requestId?: string }).requestId;

    if (result.wasAlreadyPresent && result.wasAlreadyHandled) {
      const existingRequest = requestId ? await devQueue.getRequest(requestId) : null;
      if (existingRequest) {
        await devQueue.reclaimRequest(requestForReclaim(existingRequest));
      }
    }
  }

  await reclaimHandledSampleRequestsFromStorage({ devQueue, queueName, configDir });
}

/**
 * Collect and flatten all sampleUrls from routes.
 * Resolves async functions before flattening.
 */
async function resolveSampleUrls<T extends CrawleeOneRoute<any>>(
  routes: Record<string, T>
): Promise<SampleUrlItem[]> {
  const items: SampleUrlItem[] = [];
  for (const route of Object.values(routes)) {
    if (!route.sampleUrls?.length) continue;
    for (const item of route.sampleUrls) {
      items.push(...(await flattenSampleUrl(item)));
    }
  }
  return items;
}

/**
 * Each item in `route.sampleUrls` can be a URL string, RequestOptions-like object,
 * or a function that returns an ARRAY of any of these.
 *
 * So we need to flatten the item into an array of sample URL items.
 */
async function flattenSampleUrl(
  item:
    | CrawlerUrl
    | { request: CrawlerUrl; response: HttpResponse }
    | (() => MaybePromise<MaybeArray<SampleUrlItem>>)
): Promise<SampleUrlItem[]> {
  if (typeof item === 'function') {
    const result = await item();
    const arr = Array.isArray(result) ? result : [result];
    const flattened: SampleUrlItem[] = [];
    for (const sub of arr) {
      flattened.push(...(await flattenSampleUrl(sub)));
    }
    return flattened;
  }
  return [item];
}

function crawlerUrlToRequestOptions(crawlerUrl: CrawlerUrl): {
  url: string;
  uniqueKey?: string;
  [key: string]: unknown;
} {
  if (typeof crawlerUrl === 'string') {
    return { url: crawlerUrl };
  }
  const opts = crawlerUrl as Record<string, unknown>;
  return {
    url: (opts.url as string) ?? '',
    uniqueKey: opts.uniqueKey as string | undefined,
    method: opts.method,
    headers: opts.headers,
    payload: opts.payload,
    userData: opts.userData,
    ...opts,
  };
}

function sampleItemToRequest(item: SampleUrlItem): Request {
  if (typeof item === 'object' && 'request' in item && 'response' in item) {
    const reqOpts = crawlerUrlToRequestOptions(item.request);
    return new Request({
      url: reqOpts.url,
      method: ((reqOpts.method as string) ?? 'GET') as 'GET',
      headers: reqOpts.headers as Record<string, string> | undefined,
      payload: reqOpts.payload as string | undefined,
      userData: {
        ...((reqOpts.userData as Record<string, unknown>) ?? {}),
        response: item.response,
      },
    });
  }
  const opts = crawlerUrlToRequestOptions(item as CrawlerUrl);
  return new Request({
    url: opts.url,
    method: ((opts.method as string) ?? 'GET') as 'GET',
    headers: opts.headers as Record<string, string> | undefined,
    payload: opts.payload as string | undefined,
    userData: opts.userData as Record<string, unknown> | undefined,
  });
}

/**
 * Build a request suitable for reclaimRequest. Crawlee memory storage infers
 * handled state from request.handledAt: if set, it keeps orderNo=null (handled).
 * We must pass a request WITHOUT handledAt so the storage sets orderNo (pending).
 */
function requestForReclaim(request: Request): Request {
  const copy = { ...request } as Record<string, unknown>;
  delete copy.handledAt;
  return copy as unknown as Request;
}

/** Options for reclaimHandledSampleRequestsFromStorage */
interface ReclaimHandledSampleRequestsFromStorageOpts {
  devQueue: RequestQueue;
  queueName: string;
  configDir?: string;
}

/**
 * Reclaim handled sample requests by scanning the queue storage.
 * Used when addRequest does not return requestId for already-present requests
 * (e.g. on second dev run after requests were marked handled).
 */
async function reclaimHandledSampleRequestsFromStorage(
  opts: ReclaimHandledSampleRequestsFromStorageOpts
): Promise<void> {
  const { devQueue, queueName, configDir } = opts;
  const baseDir = configDir ?? process.cwd();
  const storageDir = process.env.APIFY_LOCAL_STORAGE_DIR
    ? path.resolve(process.env.APIFY_LOCAL_STORAGE_DIR)
    : path.join(baseDir, 'storage');
  const queueDir = path.join(storageDir, 'request_queues', queueName);

  if (!fs.existsSync(queueDir)) return;

  const files = fs.readdirSync(queueDir).filter((f) => f.endsWith('.json'));
  if (files.length === 0) return;
  let reclaimed = 0;
  for (const file of files) {
    const requestId = file.replace(/\.json$/, '');
    try {
      const raw = fs.readFileSync(path.join(queueDir, file), 'utf-8');

      const meta = JSON.parse(raw) as { uniqueKey?: string; orderNo?: number | null };
      if (meta.orderNo != null) continue;

      const uniqueKey = meta.uniqueKey;
      if (!uniqueKey) continue;

      const existingRequest = await devQueue.getRequest(requestId);
      if (existingRequest?.handledAt) {
        await devQueue.reclaimRequest(requestForReclaim(existingRequest));
        reclaimed++;
      }
    } catch {
      // Skip malformed or unreadable request files
    }
  }
  if (reclaimed > 0) {
    console.log(`[crawlee-one] Reclaimed ${reclaimed} handled sample request(s) for re-processing`);
  }
}
