import type {
  CrawlingContext,
  RouterHandler as CrawlerRouter,
  Request as CrawlerRequest,
  Log,
} from 'crawlee';
import type { CommonPage } from '@crawlee/browser-pool';
import type { Page } from 'playwright';

import { serialAsyncFind, wait } from '../../utils/async';
import type { MaybePromise } from '../../utils/types';
import type { PerfActorInput, RequestActorInput } from '../config';
import type { CrawleeOneIO } from '../integrations/types';
import type {
  CrawleeOneRouteWrapper,
  CrawleeOneRouteHandler,
  CrawleeOneRoute,
  CrawleeOneRouteCtx,
  CrawleeOneRouteMatcherFn,
} from './types';

// Read about router on https://docs.apify.com/academy/expert-scraping-with-apify/solutions/using-storage-creating-tasks

/**
 * Given a function `fn` and a list of wrappers [a, b, c, ...],
 * wrap the function to generate composite `a( b( c( fn ) ) )`.
 *
 * That is, the wrappers on the left side of the array (start)
 * wrap those on the right side of the array (end).
 */
const applyWrappersRight = <
  TFn extends (...args: any[]) => any,
  TWrap extends (fn: TFn) => MaybePromise<TFn>
>(
  fn: TFn,
  wrappers: TWrap[] = []
) => {
  return wrappers.reduceRight<Promise<TFn>>(async (interimFnPromise, wrapper) => {
    const interimFn = await interimFnPromise;
    return wrapper(interimFn);
  }, Promise.resolve(fn));
};

const resolveRoutes = <
  Labels extends string = string,
  RouterCtx extends Record<string, any> = Record<string, any>,
  CrawlerCtx extends CrawlingContext = CrawlingContext
>(
  routes: CrawleeOneRoute<Labels, RouterCtx, CrawlerCtx>[]
) =>
  routes.map((route) => {
    const matchers = Array.isArray(route.match) ? route.match : [route.match];
    if (!matchers.length) {
      throw Error(`Route ${route.name} (label: ${route.handlerLabel}) has NO "match" item. It can be a RegExp, function, or array of the two.`); // prettier-ignore
    }

    const resolvedMatchers = matchers.map<CrawleeOneRouteMatcherFn<Labels, RouterCtx, CrawlerCtx>>(
      (matcher) => {
        if (typeof matcher === 'function') return matcher;
        if (typeof matcher === 'string' || matcher instanceof RegExp) {
          const newMatcherFn: CrawleeOneRouteMatcherFn<Labels, RouterCtx, CrawlerCtx> = (url) =>
            !!url.match(matcher);
          return newMatcherFn;
        }
        // We shouldn't get here!
        throw Error(`Route ${route.name} (label: ${route.handlerLabel}) has INVALID "match" item. It can be only RegExp, function, or array of the two. Got ${matcher}`); // prettier-ignore
      }
    );

    return { ...route, match: resolvedMatchers };
  });

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
  Labels extends string = string,
  RouterCtx extends Record<string, any> = Record<string, any>,
  CrawlerCtx extends CrawlingContext = CrawlingContext
>(
  router: CrawlerRouter<CrawlerCtx>,
  routeHandlers: Record<Labels, CrawleeOneRouteHandler<CrawlerCtx, RouterCtx>>,
  options?: {
    routerContext?: RouterCtx;
    handlerWrappers?: CrawleeOneRouteWrapper<CrawlerCtx, RouterCtx>[];
  }
) => {
  const { routerContext, handlerWrappers } = options ?? {};

  // For each handler
  for (const [key, handler] of Object.entries(routeHandlers)) {
    // First apply all wrappers onto the handler
    const wrappedHandler = await applyWrappersRight(
      handler as (ctx: CrawleeOneRouteCtx<CrawlerCtx & RouterCtx>) => Promise<void>,
      handlerWrappers ?? []
    );

    // Then register the composite handler
    await router.addHandler<CrawlerCtx>(key, async (ctx) =>
      wrappedHandler({ ...routerContext, ...ctx } as any)
    );
  }
};

const createDefaultHandler = <
  Labels extends string = string,
  RouterCtx extends Record<string, any> = Record<string, any>,
  CrawlerCtx extends CrawlingContext = CrawlingContext
>(
  input: {
    io: CrawleeOneIO;
    routes: CrawleeOneRoute<Labels, RouterCtx, CrawlerCtx>[];
    routeHandlers: Record<Labels, CrawleeOneRouteHandler<CrawlerCtx, RouterCtx>>;
  } & PerfActorInput &
    Pick<RequestActorInput, 'requestQueueId'>
) => {
  const { io, routes, routeHandlers, requestQueueId, perfBatchSize, perfBatchWaitSecs } = input;

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

    if (perfBatchWaitSecs) await wait(perfBatchWaitSecs);
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
  // prettier-ignore
  const defaultAction: CrawleeOneRoute<Labels, RouterCtx, CrawlerCtx>['action'] = async (url, ctx, route) => {
    const handler = route.handlerLabel != null && routeHandlers[route.handlerLabel];
    if (!handler) {
      ctx.log.error(`No handler found for route ${route.name} (${route.handlerLabel}). URL will not be processed. URL: ${url}`); // prettier-ignore
      return;
    }
    ctx.log.info(`Passing URL to handler ${route.handlerLabel}. URL: ${url}`);
    await handler(ctx as any);
  };

  const defaultHandler = async <T extends CrawleeOneRouteCtx<CrawlerCtx & RouterCtx>>(
    ctx: T
  ): Promise<void> => {
    const { page, log: parentLog } = ctx;
    const log = parentLog.child({ prefix: '[Router] ' });

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
      const route = await serialAsyncFind(resolvedRoutes, async (currRoute) => {
        const isMatch = await serialAsyncFind(currRoute.match, async (matchFn) => {
          return matchFn(url, ctx, currRoute, routeHandlers);
        });
        return isMatch;
      });

      // Run the handler
      if (route) {
        log.info(`URL matched route ${route.name} (handlerLabel: ${route.handlerLabel}). ${logSuffix}`); // prettier-ignore
        const action = route.action ?? defaultAction;
        await action(url, ctx, route, routeHandlers);
      } else {
        log.error(`No route matched URL. URL will not be processed. ${logSuffix}`);
      }

      // Clean up and move onto another request
      await closeRequest(req);
      handledRequestsCount++;

      req = await loadNextRequest(logSuffix, { page: page as Page, log });
    };

    try {
      do {
        await onRequest();
      } while (hasBatchReqs());
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
  CrawlerCtx extends CrawlingContext,
  RouterCtx extends Record<string, any> = Record<string, any>,
  Labels extends string = string,
  Input extends Record<string, any> = Record<string, any>
>({
  io,
  router,
  routeHandlerWrappers,
  routerContext,
  routes,
  routeHandlers,
  input,
}: {
  io: CrawleeOneIO;
  router: CrawlerRouter<CrawlerCtx>;
  routeHandlerWrappers?: CrawleeOneRouteWrapper<CrawlerCtx, RouterCtx>[];
  routerContext?: RouterCtx;
  routes: CrawleeOneRoute<Labels, RouterCtx, CrawlerCtx>[];
  routeHandlers: Record<Labels, CrawleeOneRouteHandler<CrawlerCtx, RouterCtx>>;
  input?: Input | null;
}) => {
  const { perfBatchSize, perfBatchWaitSecs, requestQueueId } = (input || {}) as PerfActorInput &
    RequestActorInput;

  const defaultHandler = createDefaultHandler({
    io,
    routes,
    routeHandlers,
    requestQueueId,
    perfBatchSize,
    perfBatchWaitSecs,
  });

  const wrappedHandler = await applyWrappersRight(defaultHandler, routeHandlerWrappers ?? []);
  await router.addDefaultHandler<CrawlerCtx>((ctx) =>
    wrappedHandler({ ...routerContext, ...ctx } as any)
  );
};