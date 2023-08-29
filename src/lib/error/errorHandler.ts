import type {
  BasicCrawlingContext,
  CheerioCrawlingContext,
  CrawlingContext,
  ErrorHandler,
  HttpCrawlingContext,
  JSDOMCrawlingContext,
  PlaywrightCrawlingContext,
  PuppeteerCrawlingContext,
} from 'crawlee';
import * as Sentry from '@sentry/node';
import type { Page } from 'playwright';

import type { MaybePromise, PickRequired } from '../../utils/types';
import type { RouteHandler, RouterHandlerCtx } from '../router/types';
import type {
  CrawleeOneErrorHandlerInput,
  CrawleeOneErrorHandlerOptions,
  CrawleeOneIO,
} from '../integrations/types';
import { apifyIO } from '../integrations/apify';

export type CaptureErrorInput = PickRequired<Partial<CrawleeOneErrorHandlerInput>, 'error'>;
export type CaptureError = (input: CaptureErrorInput) => MaybePromise<void>;

/**
 * Error handling for CrawleeOne crawlers.
 *
 * By default, error reports are saved to Apify Dataset.
 *
 * See https://docs.apify.com/academy/node-js/analyzing-pages-and-fixing-errors#error-reporting
 */
export const captureError = async <TEnv extends object = object, TReport extends object = object>(
  input: CaptureErrorInput,
  options: CrawleeOneErrorHandlerOptions<TEnv, TReport>
) => {
  const { error, log: parentLog } = input;
  const {
    io = apifyIO as any as CrawleeOneIO<TEnv, TReport>,
    reportingDatasetId,
    onErrorCapture,
  } = options;

  const log = parentLog?.child({ prefix: '[Error capture] ' }) ?? null;

  log?.error(`ERROR ${error.name}: ${error.message}`, error);
  console.error(`ERROR ${error.name}: ${error.message}`, error);

  // Let's create reporting dataset
  // If you already have one, this will continue adding to it
  const reportingDataset = reportingDatasetId ? await io.openDataset(reportingDatasetId) : null;
  const report = await io.generateErrorReport(
    { error, page: input.page ?? null, url: input.url ?? null, log },
    { ...options, io }
  );

  log?.error('[Error capture] Error captured', report);

  // And we push the report
  if (reportingDatasetId) {
    log?.info(`[Error capture] Pushing error to dataset ${reportingDatasetId}`);
    await reportingDataset?.pushData(report);
    log?.info(`[Error capture] DONE pushing error to dataset ${reportingDatasetId}`);
  }

  log?.error('[Error capture] Calling onErrorCapture');
  await onErrorCapture?.({ error, report });
  log?.error('[Error capture] Done calling onErrorCapture');

  // @ts-expect-error Tag the error, so we don't capture it twice.
  error._crawleeOneErrorCaptured = true;
  // Propagate the error
  throw error;
};

/**
 * Error handling for Crawlers as a function wrapper
 *
 * By default, error reports are saved to Apify Dataset.
 */
export const captureErrorWrapper = async <
  TEnv extends object = object,
  TReport extends object = object
>(
  fn: (input: { captureError: CaptureError }) => MaybePromise<void>,
  options: CrawleeOneErrorHandlerOptions<TEnv, TReport>
) => {
  const captureErrorWithArgs: CaptureError = (input) => captureError(input, options);

  try {
    // Pass the error capturing function to the wrapped function, so it can trigger it by itself
    await fn({ captureError: captureErrorWithArgs });
  } catch (error: any) {
    if (!error._crawleeOneErrorCaptured) {
      // And if the wrapped function fails, we capture error for them
      await captureErrorWithArgs({ error, url: null, page: null, log: null });
    }
  }
};

/**
 * Drop-in replacement for regular request handler callback for Crawlee route
 * that automatically tracks errors.
 *
 * By default, error reports are saved to Apify Dataset.
 *
 * @example
 *
 * router.addDefaultHandler(
 *  captureErrorRouteHandler(async (ctx) => {
 *    const { page, crawler } = ctx;
 *    const url = page.url();
 *    ...
 *  })
 * );
 */
export const captureErrorRouteHandler = <
  Ctx extends CrawlingContext,
  TEnv extends object = object,
  TReport extends object = object
>(
  handler: (ctx: RouterHandlerCtx<Ctx> & { captureError: CaptureError }) => MaybePromise<void>,
  options: CrawleeOneErrorHandlerOptions<TEnv, TReport>
) => {
  // Wrap the original handler, so we can additionally pass it the captureError function
  const wrapperHandler = (ctx: Parameters<RouteHandler<Ctx>>[0]) => {
    return captureErrorWrapper(({ captureError }) => {
      return handler({
        ...(ctx as any),
        // And automatically feed contextual args (page, url, log) to captureError
        captureError: (input) =>
          captureError({
            error: input.error,
            page: input.page ?? ctx.page,
            url: input.url || ctx.request.url,
            log: input.log ?? ctx.log,
          }),
      });
    }, options);
  };
  return wrapperHandler;
};

export const basicCaptureErrorRouteHandler = <Ctx extends BasicCrawlingContext>(...args: Parameters<typeof captureErrorRouteHandler<Ctx>>) => captureErrorRouteHandler<Ctx>(...args); // prettier-ignore
export const httpCaptureErrorRouteHandler = <Ctx extends HttpCrawlingContext>(...args: Parameters<typeof captureErrorRouteHandler<Ctx>>) => captureErrorRouteHandler<Ctx>(...args); // prettier-ignore
export const jsdomCaptureErrorRouteHandler = <Ctx extends JSDOMCrawlingContext>(...args: Parameters<typeof captureErrorRouteHandler<Ctx>>) => captureErrorRouteHandler<Ctx>(...args); // prettier-ignore
export const playwrightCaptureErrorRouteHandler = <Ctx extends PlaywrightCrawlingContext>(...args: Parameters<typeof captureErrorRouteHandler<Ctx>>) => captureErrorRouteHandler<Ctx>(...args); // prettier-ignore
export const cheerioCaptureErrorRouteHandler = <Ctx extends CheerioCrawlingContext>(...args: Parameters<typeof captureErrorRouteHandler<Ctx>>) => captureErrorRouteHandler<Ctx>(...args); // prettier-ignore
export const puppeteerCaptureErrorRouteHandler = <Ctx extends PuppeteerCrawlingContext>(...args: Parameters<typeof captureErrorRouteHandler<Ctx>>) => captureErrorRouteHandler<Ctx>(...args); // prettier-ignore

/**
 * Create an `ErrorHandler` function that can be assigned to
 * `failedRequestHandler` option of `BasicCrawlerOptions`.
 *
 * The function saves error to a Dataset, and optionally forwards it to Sentry.
 *
 * By default, error reports are saved to Apify Dataset.
 */
export const createErrorHandler = <Ctx extends CrawlingContext>(
  options: CrawleeOneErrorHandlerOptions & { sendToSentry?: boolean }
): ErrorHandler<Ctx> => {
  return async ({ request, log, page }, error) => {
    const url = request.loadedUrl || request.url;
    captureError(
      { error, url, log, page: page as Page },
      {
        io: options.io,
        reportingDatasetId: options.reportingDatasetId,
        allowScreenshot: options.allowScreenshot ?? true,
        onErrorCapture: ({ error, report }) => {
          if (!options.sendToSentry) return;

          Sentry.captureException(error, { extra: report as any });
        },
      }
    );
  };
};
