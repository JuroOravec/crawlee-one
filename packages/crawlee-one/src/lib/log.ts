import { LogLevel as CrawleeLogLevel } from 'crawlee';

import type { ArrVal } from '../utils/types.js';
import type { CrawleeOneRouteMiddleware } from './router/types.js';
import type { CrawleeOneTypes } from './context/types.js';

export const LOG_LEVEL = ['debug', 'info', 'warn', 'error', 'off'] as const; // prettier-ignore
export type LogLevel = ArrVal<typeof LOG_LEVEL>;

/** Map log levels of `crawlee-one` to log levels of `crawlee` */
export const logLevelToCrawlee: Record<LogLevel, CrawleeLogLevel> = {
  off: CrawleeLogLevel.OFF,
  debug: CrawleeLogLevel.DEBUG,
  info: CrawleeLogLevel.INFO,
  warn: CrawleeLogLevel.WARNING,
  error: CrawleeLogLevel.ERROR,
};

/**
 * Wrapper for Crawlee route handler that configures log level.
 *
 *
 * Usage with Crawlee's `RouterHandler.addDefaultHandler`
 * ```ts
 * const wrappedHandler = logLevelHandlerWrapper('debug')(handler)
 * await router.addDefaultHandler<Ctx>(wrappedHandler);
 * ```
 *
 * Usage with Crawlee's `RouterHandler.addHandler`
 * ```ts
 * const wrappedHandler = logLevelHandlerWrapper('error')(handler)
 * await router.addHandler<Ctx>(wrappedHandler);
 * ```
 *
 * Usage with `createCrawleeOne`
 * ```ts
 * const actor = await createCrawleeOne<CheerioCrawlingContext>({
 *   validateInput,
 *   router: createCheerioRouter(),
 *   routes,
 *   routeHandlers: ({ input }) => createHandlers(input!),
 *   routeHandlerWrappers: ({ input }) => [
 *     logLevelHandlerWrapper<CheerioCrawlingContext<any, any>>(input?.logLevel ?? 'info'),
 *   ],
 *   createCrawler: ({ router, input }) => createCrawler({ router, input, crawlerConfig }),
 * });
 * ```
 */
export const logLevelHandlerWrapper = <T extends CrawleeOneTypes>(
  logLevel: LogLevel
): CrawleeOneRouteMiddleware<T> => {
  return (handler) => {
    return (ctx, ...args) => {
      ctx.log.info(`Setting log level to ${logLevel}`);
      ctx.log.setLevel(logLevelToCrawlee[logLevel]);
      return handler(ctx, ...args);
    };
  };
};
