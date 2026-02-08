import {
  type RouterHandler as CrawlerRouter,
  type Request as CrawlerRequest,
  type Log,
} from 'crawlee';
import type { CommonPage } from '@crawlee/browser-pool';
import type { Page } from 'playwright';

import { serialAsyncFind, wait } from '../../utils/async.js';
import type { MaybePromise } from '../../utils/types.js';
import type { PerfActorInput, RequestActorInput } from '../input.js';
import type {
  CrawleeOneRouteWrapper,
  CrawleeOneRouteHandler,
  CrawleeOneRouteCtx,
  CrawleeOneRouteMatcherFn,
  CrawleeOneRoute,
} from './types.js';
import type { CrawleeOneCtx } from '../actor/types.js';

// Read about router on https://docs.apify.com/academy/expert-scraping-with-apify/solutions/using-storage-creating-tasks

/**
 * Given a function `fn` and a list of wrappers [a, b, c, ...],
 * wrap the function to generate composite `a( b( c( fn ) ) )`.
 *
 * That is, the wrappers on the left side of the array (start)
 * wrap those on the right side of the array (end).
 */
const applyWrappersRight = <TFn extends (...args: any[]) => any>(
  fn: TFn,
  wrappers: ((fn: TFn) => MaybePromise<TFn>)[] = []
) => {
  return wrappers.reduceRight<Promise<TFn>>(async (interimFnPromise, wrapper) => {
    const interimFn = await interimFnPromise;
    return wrapper(interimFn);
  }, Promise.resolve(fn));
};

const resolveRoutes = <
  T extends CrawleeOneCtx,
  RouterCtx extends Record<string, any> = CrawleeOneRouteCtx<T>,
>(
  routes: Record<T['labels'], CrawleeOneRoute<T, RouterCtx>>
) =>
  Object.entries<CrawleeOneRoute<T, RouterCtx>>(routes).reduce<
    Record<T['labels'], CrawleeOneRoute<T, RouterCtx>>
  >((agg, [key, route]) => {
    const matchers = Array.isArray(route.match) ? route.match : [route.match];
    if (!matchers.length) {
      throw Error(`Route "${key}" has NO "match" item. It can be a RegExp, function, or array of the two.`); // prettier-ignore
    }

    const resolvedMatchers = matchers.map<CrawleeOneRouteMatcherFn<T, RouterCtx>>((matcher) => {
      if (typeof matcher === 'function') return matcher;
      if (typeof matcher === 'string' || matcher instanceof RegExp) {
        const newMatcherFn: CrawleeOneRouteMatcherFn<T, RouterCtx> = (url) => !!url.match(matcher);
        return newMatcherFn;
      }
      // We shouldn't get here!
      throw Error(`Route "${key}" has INVALID "match" item. It can be only RegExp, function, or array of the two. Got ${matcher}`); // prettier-ignore
    });

    agg[key as T['labels']] = { ...route, match: resolvedMatchers };
    return agg;
  }, {} as any);

/**
 * Register many handlers at once onto the Crawlee's RouterHandler.
 *
 * The labels under which the handlers are registered are the respective object keys.
 *
 * Example:
 *
 * ```js
 * registerHandlers(router, { labelA: fn1, labelB: fn2 });
 * ```
 *
 * Is similar to:
 * ```js
 * router.addHandler(labelA, fn1)
 * router.addHandler(labelB, fn2)
 * ```
 *
 * You can also specify a list of wrappers to override the behaviour of all handlers
 * all at once.
 *
 * A list of wrappers `[a, b, c]` will be applied to the handlers right-to-left as so
 * `a( b( c( handler ) ) )`.
 *
 * The entries on the `routerContext` object will be made available to all handlers.
 */
export const registerHandlers = async <
  T extends CrawleeOneCtx,
  RouterCtx extends Record<string, any> = CrawleeOneRouteCtx<T>,
>(
  router: CrawlerRouter<T['context']>,
  routes: Record<T['labels'], CrawleeOneRoute<T, RouterCtx>>,
  options?: {
    routerContext?: RouterCtx;
    handlerWrappers?: CrawleeOneRouteWrapper<T, RouterCtx>[];
    onSetCtx?: (ctx: Parameters<CrawleeOneRouteHandler<T, RouterCtx>>[0] | null) => void;
  }
) => {
  const { routerContext, handlerWrappers, onSetCtx } = options ?? {};

  // For each handler
  for (const [key, route] of Object.entries<CrawleeOneRoute<T, RouterCtx>>(routes)) {
    // First apply all wrappers onto the handler
    const wrappedHandler = await applyWrappersRight(route.handler, handlerWrappers ?? []);

    // Then register the composite handler
    await router.addHandler<T['context']>(key, async (ctx) => {
      // For the duration of the handler execution, set the actor.handlerCtx to the value of `ctx`,
      // and then set it back to null;
      onSetCtx?.(ctx as any);
      let result;
      try {
        result = await wrappedHandler({ ...routerContext, ...ctx } as any);
      } finally {
        onSetCtx?.(null);
      }
      return result;
    });
  }
};

const createDefaultHandler = <
  T extends CrawleeOneCtx,
  RouterCtx extends Record<string, any> = CrawleeOneRouteCtx<T>,
>(
  input: {
    io: T['io'];
    routes: Record<T['labels'], CrawleeOneRoute<T, RouterCtx>>;
  } & PerfActorInput &
    Pick<RequestActorInput, 'requestQueueId'>
) => {
  const { io, routes, requestQueueId, perfBatchSize, perfBatchWaitSecs } = input;

  const resolvedRoutes = resolveRoutes(routes);

  // NOTE: Because we "clear" the queue by replacing it,
  // we need to always call `openRequestQueue` to ensure we use the latest instance
  const openQueue = () => io.openRequestQueue(requestQueueId);

  const closeRequest = async (req: CrawlerRequest | null) => {
    if (!req) return;
    const reqQueue = await openQueue();
    await reqQueue.markRequestHandled(req);
  };

  const loadNextRequest = async (suffix: string, options?: { page?: Page; log?: Log }) => {
    const { page, log } = options ?? {};

    log?.debug(`Checking for new Request in the queue. ${suffix}`);

    if (perfBatchWaitSecs && perfBatchWaitSecs > 0) await wait(perfBatchWaitSecs);
    const reqQueue = await openQueue();
    const newReq = (await reqQueue.fetchNextRequest()) ?? null;

    if (newReq) {
      log?.debug(`Found new Request in the queue. ${suffix}`);

      // WARNING - For each subsequent Request, it must be loaded manually
      //           Hence, batching is suitable only for browser-based Crawlers
      //           like Playwright or Puppeteer.
      if (page?.goto) await page.goto(newReq.url);
    } else {
      log?.debug(`No more Requests in the queue. ${suffix}`);
    }
    return newReq;
  };

  const onError = async (err: any, req: CrawlerRequest | null, log: Log) => {
    log.error(`Failed to process a request, returning it to the queue. URL: ${req?.loadedUrl || req?.url}.`); // prettier-ignore
    log.error(err);
    // Reinsert the request into the queue if we failed to process it due to an error
    if (req) {
      const reqQueue = await openQueue();
      await reqQueue.reclaimRequest(req, { forefront: true });
    }
  };

  /** Redirect the URL to the labelled route identical to route's name */
  const defaultAction = async (
    ctx: CrawleeOneRouteCtx<T, RouterCtx>,
    url: string,
    routeName: string,
    route: CrawleeOneRoute<T, RouterCtx>
  ) => {
    if (!route.handler) {
      ctx.log.error(`No handler found for route "${routeName}". URL will not be processed. URL: ${url}`); // prettier-ignore
      return;
    }
    ctx.log.info(`Passing URL to handler for route "${routeName}". URL: ${url}`);
    await route.handler(ctx);
  };

  const defaultHandler = async <TCtx extends CrawleeOneRouteCtx<T, RouterCtx>>(
    ctx: TCtx
  ): Promise<void> => {
    const { page, log: parentLog } = ctx;
    const log = parentLog.child({ prefix: '[Router] ' });

    if (!page && perfBatchSize != null && perfBatchSize !== 1) {
      throw Error(
        'Request batching is supported only for browser-based crawlers like PlaywrightCrawler or PuppeteerCrawler'
      );
    }

    let handledRequestsCount = 0;
    let req: CrawlerRequest | null = ctx.request ?? null;

    const hasBatchReqs = () =>
      perfBatchSize != null && req != null && handledRequestsCount < perfBatchSize;

    const getUrl = () => (page ? (page as any as CommonPage).url() : req!.loadedUrl || req!.url);

    const onRequest = async () => {
      const url = await getUrl();
      const logSuffix = `Batch ${handledRequestsCount + 1} of ${perfBatchSize ?? 1}. URL: ${url}`;

      // Find route handler for given URL
      log.debug(`Searching for a handler for given Request. ${logSuffix}`);
      const [routeName, route] =
        (await serialAsyncFind(
          Object.entries<CrawleeOneRoute<T, RouterCtx>>(resolvedRoutes),
          async ([key, currRoute]) => {
            log.debug(`Testing Request against handler ${key}. ${logSuffix}`);
            const isMatch = await serialAsyncFind(
              currRoute.match as CrawleeOneRouteMatcherFn<T, RouterCtx>[],
              async (matchFn) => {
                return matchFn(url, ctx, currRoute, routes);
              }
            );
            log.debug(
              `Testing Request against handler ${key}: ${
                isMatch ? 'MATCH' : 'NOT MATCH'
              }. ${logSuffix}`
            );
            return isMatch;
          }
        )) ?? [];

      // Run the handler
      if (route) {
        log.info(`URL matched route "${routeName}". ${logSuffix}`);
        await defaultAction(ctx, url, routeName ?? '', route);
      } else {
        log.error(`No route matched URL. URL will not be processed. ${logSuffix}`);
      }

      if (!page) return;

      // Clean up and move onto another request
      await closeRequest(req);
      handledRequestsCount++;

      log.debug(`Loading next request.  ${logSuffix}`);
      req = await loadNextRequest(logSuffix, { page: page as Page, log });
      log.debug(`Next request loaded.  ${logSuffix}`);
    };

    try {
      do {
        await onRequest();
      } while (hasBatchReqs() && page);
      log.info(`Batch of ${perfBatchSize ?? 1} finished.`);
    } catch (err) {
      await onError(err, req, log);
    }
  };

  return defaultHandler;
};

/**
 * Configures the default router handler to redirect URLs to labelled route handlers
 * based on which route the URL matches first.
 *
 * NOTE: This does mean that the URLs passed to this default handler will be fetched
 * twice (as the URL will be requeued to the correct handler). We recommend to use this
 * function only in the scenarios where there is a small number of startUrls, yet these
 * may need various ways of processing based on different paths or etc.
 *
 * @example
 *
 * const routeLabels = {
 *   MAIN_PAGE: 'MAIN_PAGE',
 *   JOB_LISTING: 'JOB_LISTING',
 *   JOB_DETAIL: 'JOB_DETAIL',
 *   JOB_RELATED_LIST: 'JOB_RELATED_LIST',
 *   PARTNERS: 'PARTNERS',
 * } as const;
 *
 * const router = createPlaywrightRouter();
 *
 * const routes = createPlaywrightCrawleeOneRouteMatchers<typeof routeLabels>([
 *  // URLs that match this route are redirected to router.addHandler(routeLabels.MAIN_PAGE)
 *  {
 *     route: routeLabels.MAIN_PAGE,
 *     // Check for main page like https://www.profesia.sk/?#
 *     match: (url) => url.match(/[\W]profesia\.sk\/?(?:[?#~]|$)/i),
 *   },
 *
 *  // Optionally override the logic that assigns the URL to the route by specifying the `action` prop
 *  {
 *     route: routeLabels.MAIN_PAGE,
 *     // Check for main page like https://www.profesia.sk/?#
 *     match: (url) => url.match(/[\W]profesia\.sk\/?(?:[?#~]|$)/i),
 *     action: async (ctx) => {
 *       await ctx.crawler.addRequests([{
 *         url: 'https://profesia.sk/praca',
 *         label: routeLabels.JOB_LISTING,
 *       }]);
 *     },
 *   },
 * ]);
 *
 * // Set up default route to redirect to labelled routes
 * setupDefaultHandlers({ router, routes });
 *
 * // Now set up the labelled routes
 * await router.addHandler(routeLabels.JOB_LISTING, async (ctx) => { ... }
 */
export const setupDefaultHandlers = async <
  T extends CrawleeOneCtx,
  RouterCtx extends Record<string, any> = CrawleeOneRouteCtx<T>,
>({
  io,
  router,
  routeHandlerWrappers,
  routerContext,
  routes,
  input,
  onSetCtx,
}: {
  io: T['io'];
  router: CrawlerRouter<T['context']>;
  routeHandlerWrappers?: CrawleeOneRouteWrapper<T, RouterCtx>[];
  routerContext?: RouterCtx;
  routes: Record<T['labels'], CrawleeOneRoute<T, RouterCtx>>;
  input?: T['input'] | null;
  onSetCtx?: (ctx: Parameters<CrawleeOneRouteHandler<T, RouterCtx>>[0] | null) => void;
}) => {
  const { perfBatchSize, perfBatchWaitSecs, requestQueueId } = (input || {}) as PerfActorInput &
    RequestActorInput;

  const defaultHandler = createDefaultHandler({
    io,
    routes,
    requestQueueId,
    perfBatchSize,
    perfBatchWaitSecs,
  });

  const wrappedHandler = await applyWrappersRight(defaultHandler, routeHandlerWrappers ?? []);
  await router.addDefaultHandler<T['context']>(async (ctx) => {
    // For the duration of the handler execution, set the actor.handlerCtx to the value of `ctx`,
    // and then set it back to null;
    onSetCtx?.(ctx as any);
    let result;
    try {
      result = await wrappedHandler({ ...routerContext, ...ctx } as any);
    } finally {
      onSetCtx?.(null);
    }
    return result;
  });
};
