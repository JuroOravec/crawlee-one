/**
 * Dev mode: run crawler against sample URLs with response caching.
 *
 * - Uses a dev RequestQueue and caches responses (HTTP client for cheerio/http/jsdom,
 *   navigation handler wrap for playwright/puppeteer).
 * - Sets devContextStore with devDatasetIdPrefix so pushData routes to dev-{crawler}-{route}
 *   datasets without polluting actor input.
 */

import path from 'node:path';

import {
  type BaseHttpClient,
  type BasicCrawlerOptions,
  type BasicCrawlingContext,
  GotScrapingHttpClient,
} from 'crawlee';

import type { CrawleeOneConfigRun, CrawleeOneConfigRunOptions } from '../config/types.js';
import type { CrawleeOneRoute } from '../router/types.js';
import { type DevContext, devContextStore } from './devContextStore.js';
import { createDevHttpClient, devRequestStore } from './devHttpClient.js';
import { wrapNavigationHandler } from './devNavigationHandler.js';
import { openDevRequestQueue, populateDevRequestQueue } from './devRequestQueue.js';

const HTTP_CRAWLER_TYPES = ['cheerio', 'http', 'jsdom'] as const;
const BROWSER_CRAWLER_TYPES = ['playwright', 'adaptive-playwright', 'puppeteer'] as const;

export interface RunDevOptions {
  crawlerName: string;
  run: CrawleeOneConfigRun;
  crawlerType?: string;
  /** Directory containing crawlee-one.config (storage base for reclaim) */
  configDir?: string;
  /** Input overrides for dev; merged with { startUrls: [] } so validation passes. */
  devInput?: Record<string, unknown>;
  /**
   * When true (--fetch): replace handlers with no-ops to only populate cache.
   * When false (default): run with real handlers, cache responses via devHttpClient.
   */
  fetchOnly?: boolean;
  /** When true (--strict): throw when a URL matches no route. */
  strict?: boolean;
}

/**
 * Run dev mode: dev queue, response caching, and dev dataset routing.
 *
 * - Uses dev RequestQueue; caches responses (HTTP wrapper or navigation handler wrap).
 * - Sets devContextStore so pushData writes to dev-{crawler}-{route} datasets.
 * - When fetchOnly: replace handlers with no-ops to only populate cache.
 * - Otherwise: run with real handlers.
 *
 * Routes handlers are accessed from `context.routes` at `onReady` hook.
 */
export async function runDev(opts: RunDevOptions): Promise<void> {
  const {
    crawlerName,
    run,
    crawlerType = 'cheerio',
    configDir,
    devInput: devInputOverrides = {},
    fetchOnly = false,
    strict = false,
  } = opts;

  // Open dev RequestQueue (empty). Population happens in devOnReady when
  // `context.routes` are available.
  const devQueue = await openDevRequestQueue(crawlerName);

  // Use APIFY_LOCAL_STORAGE_DIR if set, otherwise use `{configDir}/storage`.
  const baseDir = configDir ?? process.cwd();
  const storageDir = process.env.APIFY_LOCAL_STORAGE_DIR
    ? path.resolve(process.env.APIFY_LOCAL_STORAGE_DIR)
    : path.join(baseDir, 'storage');
  const responseCacheDir = path.join(storageDir, 'request_queues', `dev-${crawlerName}`);

  // Use the actor inputs to configure the dev env
  const devQueueId = `dev-${crawlerName}`;
  const devInput = {
    requestQueueId: devQueueId,
    ...devInputOverrides,
  };

  const crawlerOptions: BasicCrawlerOptions<BasicCrawlingContext> = {
    requestQueue: devQueue,
  };

  // Apply monkey patches to the crawler to configure the dev environment.
  // So that we can intercept outgoing requests and cache responses.
  //
  // Http-based and browser-based crawlers are handled differently.
  // - Http-based crawlers use a wrapped HTTP client to cache responses.
  // - Browser-based crawlers use a wrapped navigation handler to cache responses.
  const willSetHttpClient = HTTP_CRAWLER_TYPES.includes(
    crawlerType as (typeof HTTP_CRAWLER_TYPES)[number]
  );
  const willPatchBrowserCrawler = BROWSER_CRAWLER_TYPES.includes(
    crawlerType as (typeof BROWSER_CRAWLER_TYPES)[number]
  );

  if (willSetHttpClient) {
    const underlying = new GotScrapingHttpClient();
    const devHttpClient = createDevHttpClient({
      underlying: underlying as any,
      devQueue,
      responseCacheDir,
    });
    crawlerOptions.httpClient = devHttpClient as unknown as BaseHttpClient;
  }

  // devOnReady runs before user's `onReady` hook. We populate
  // the queue from `context.routes`, patch the crawler, and optionally stash
  // handlers for `--fetch` mode.
  const devOnReady: DevContext['devOnReady'] = async (context) => {
    await populateDevRequestQueue({
      devQueue,
      routes: context.routes,
      configDir,
      crawlerName,
    });

    // Patch different parts methods on the Crawler instance
    // depending on the crawler type (browser vs http).
    if (willSetHttpClient) {
      const orig = (context.crawler as any)._runRequestHandler?.bind(context.crawler);
      if (orig) {
        (context.crawler as any)._runRequestHandler = async (ctx: { request: any }) => {
          return devRequestStore.run(ctx.request, () => orig(ctx));
        };
      }
    } else if (willPatchBrowserCrawler) {
      // For browser-based crawlers (Playwright, Puppeteer), we patch the navigation handler.
      // We intercept navigation to check/save the response to .response.json sidecar files.
      const orig = (context.crawler as any)._navigationHandler?.bind(context.crawler);
      if (orig) {
        (context.crawler as any)._navigationHandler = wrapNavigationHandler(orig, {
          devQueue,
          responseCacheDir,
        });
      }
    }

    // When using `--fetch`, we don't run the handlers, just let crawlee fetch the URLs
    // so we can cache the responses.
    // This is implemented by temporarily replacing handlers with noop functions.
    if (fetchOnly) {
      const originalHandlers = stashAndReplaceHandlers(context.routes, () => Promise.resolve());
      const store = devContextStore.getStore();
      if (store) {
        store.restore = () => restoreHandlers(context.routes, originalHandlers);
      }
    }
  };

  const ctx: DevContext = { devDatasetIdPrefix: devQueueId, devOnReady };

  try {
    // Provide the dev-specific context
    await devContextStore.run(ctx, () =>
      run({
        crawlerOptions: crawlerOptions as CrawleeOneConfigRunOptions['crawlerOptions'],
        input: devInput,
        crawleeOneOptions: strict ? { strict: true } : undefined,
      })
    );
  } finally {
    ctx.restore?.();
  }
}

function stashAndReplaceHandlers<T extends CrawleeOneRoute<any>>(
  routes: Record<string, T>,
  noop: () => Promise<void>
): Map<string, T['handler']> {
  const original = new Map<string, T['handler']>();
  for (const [name, route] of Object.entries(routes)) {
    if (route.handler) {
      original.set(name, route.handler as T['handler']);
      (route as unknown as { handler: () => Promise<void> }).handler = noop;
    }
  }
  return original;
}

function restoreHandlers<T extends CrawleeOneRoute<any>>(
  routes: Record<string, T>,
  original: Map<string, T['handler']>
): void {
  for (const [name, route] of Object.entries(routes)) {
    const handler = original.get(name);
    if (handler) {
      (route as { handler: T['handler'] }).handler = handler;
    }
  }
}
