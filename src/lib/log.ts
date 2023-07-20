import { LogLevel as ApifyLogLevel } from 'apify';
import type { CrawlingContext } from 'crawlee';

import type { ArrVal } from '../utils/types';
import type { CrawlerRouterWrapper } from './router';

export const LOG_LEVEL = ['debug', 'info', 'warn', 'error', 'off'] as const; // prettier-ignore
export type LogLevel = ArrVal<typeof LOG_LEVEL>;

/** Map log levels of `apify-actor-utils` to log levels of `apify` */
export const logLevelToApify: Record<LogLevel, ApifyLogLevel> = {
  off: ApifyLogLevel.OFF,
  debug: ApifyLogLevel.DEBUG,
  info: ApifyLogLevel.INFO,
  warn: ApifyLogLevel.WARNING,
  error: ApifyLogLevel.ERROR,
};

/**
 * Wrapper for Apify route handler that configures log level.
 *
 *
 * Usage with Apify's `RouterHandler.addDefaultHandler`
 * ```ts
 * const wrappedHandler = logLevelHandlerWrapper('debug')(handler)
 * await router.addDefaultHandler<Ctx>(wrappedHandler);
 * ```
 *
 * Usage with Apify's `RouterHandler.addHandler`
 * ```ts
 * const wrappedHandler = logLevelHandlerWrapper('error')(handler)
 * await router.addHandler<Ctx>(wrappedHandler);
 * ```
 *
 * Usage with `createApifyActor`
 * ```ts
 * const actor = await createApifyActor<CheerioCrawlingContext>({
 *   validateInput,
 *   router: createCheerioRouter(),
 *   routes,
 *   routeHandlers: ({ input }) => createHandlers(input!),
 *   routerWrappers: ({ input }) => [
 *     logLevelHandlerWrapper<CheerioCrawlingContext<any, any>>(input?.logLevel ?? 'info'),
 *   ],
 *   createCrawler: ({ router, input }) => createCrawler({ router, input, crawlerConfig }),
 * });
 * ```
 */
export const logLevelHandlerWrapper = <
  T extends CrawlingContext,
  RouterCtx extends Record<string, any> = Record<string, any>
>(
  logLevel: LogLevel
): CrawlerRouterWrapper<T, RouterCtx> => {
  return (handler) => {
    return (ctx, ...args) => {
      ctx.log.info(`Setting log level to ${logLevel}`);
      ctx.log.setLevel(logLevelToApify[logLevel]);
      return handler(ctx, ...args);
    };
  };
};
