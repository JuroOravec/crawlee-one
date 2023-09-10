import type {
  BasicCrawlingContext,
  CheerioCrawlingContext,
  ErrorHandler,
  HttpCrawlingContext,
  JSDOMCrawlingContext,
  PlaywrightCrawlingContext,
  PuppeteerCrawlingContext,
} from 'crawlee';
import type { Page } from 'playwright';

import type { MaybePromise, PickRequired } from '../../utils/types';
import type { CrawleeOneRouteHandler, CrawleeOneRouteCtx } from '../router/types';
import type {
  CrawleeOneErrorHandlerInput,
  CrawleeOneErrorHandlerOptions,
  CrawleeOneIO,
  ExtractIOReport,
} from '../integrations/types';
import type { CrawleeOneCtx } from '../actor/types';
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
export const captureError = async <TIO extends CrawleeOneIO = CrawleeOneIO>(
  input: CaptureErrorInput,
  options: CrawleeOneErrorHandlerOptions<TIO>
) => {
  const { error, log: parentLog } = input;
  const { io = apifyIO as any as TIO, reportingDatasetId, onErrorCapture } = options;

  const log = parentLog?.child({ prefix: '[Error capture] ' }) ?? null;

  log?.error(`ERROR ${error.name}: ${error.message}`, error);
  console.error(`ERROR ${error.name}: ${error.message}`, error);

  // Let's create reporting dataset
  // If you already have one, this will continue adding to it
  const reportingDataset = reportingDatasetId ? await io.openDataset(reportingDatasetId) : null;
  const report = await io.generateErrorReport(
    { error, page: input.page ?? null, url: input.url ?? null, log },
    { ...options, io, onErrorCapture: onErrorCapture as any }
  );

  log?.error('[Error capture] Error captured', report);

  // And we push the report
  if (reportingDatasetId) {
    log?.info(`[Error capture] Pushing error to dataset ${reportingDatasetId}`);
    await reportingDataset?.pushData(report);
    log?.info(`[Error capture] DONE pushing error to dataset ${reportingDatasetId}`);
  }

  log?.error('[Error capture] Calling onErrorCapture');
  await onErrorCapture?.({ error, report: report as ExtractIOReport<TIO> });
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
export const captureErrorWrapper = async <TIO extends CrawleeOneIO = CrawleeOneIO>(
  fn: (input: { captureError: CaptureError }) => MaybePromise<void>,
  options: CrawleeOneErrorHandlerOptions<TIO>
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
export const captureErrorRouteHandler = <T extends CrawleeOneCtx>(
  handler: (ctx: CrawleeOneRouteCtx<T> & { captureError: CaptureError }) => MaybePromise<void>,
  options: CrawleeOneErrorHandlerOptions<T['io']>
) => {
  // Wrap the original handler, so we can additionally pass it the captureError function
  const wrapperHandler: CrawleeOneRouteHandler<T, CrawleeOneRouteCtx<T>> = (ctx) => {
    return captureErrorWrapper(({ captureError }) => {
      return handler({
        ...(ctx as any),
        // And automatically feed contextual args (page, url, log) to captureError
        captureError: (input) =>
          captureError({
            error: input.error,
            page: input.page ?? (ctx.page as any),
            url: input.url || ctx.request.url,
            log: input.log ?? ctx.log,
          }),
      });
    }, options);
  };
  return wrapperHandler;
};

export const basicCaptureErrorRouteHandler = <T extends CrawleeOneCtx<BasicCrawlingContext>,>(...args: Parameters<typeof captureErrorRouteHandler<T>>) => captureErrorRouteHandler<T>(...args); // prettier-ignore
export const httpCaptureErrorRouteHandler = <T extends CrawleeOneCtx<HttpCrawlingContext>>(...args: Parameters<typeof captureErrorRouteHandler<T>>) => captureErrorRouteHandler<T>(...args); // prettier-ignore
export const jsdomCaptureErrorRouteHandler = <T extends CrawleeOneCtx<JSDOMCrawlingContext>>(...args: Parameters<typeof captureErrorRouteHandler<T>>) => captureErrorRouteHandler<T>(...args); // prettier-ignore
export const cheerioCaptureErrorRouteHandler = <T extends CrawleeOneCtx<CheerioCrawlingContext>>(...args: Parameters<typeof captureErrorRouteHandler<T>>) => captureErrorRouteHandler<T>(...args); // prettier-ignore
export const playwrightCaptureErrorRouteHandler = <T extends CrawleeOneCtx<PlaywrightCrawlingContext>>(...args: Parameters<typeof captureErrorRouteHandler<T>>) => captureErrorRouteHandler<T>(...args); // prettier-ignore
export const puppeteerCaptureErrorRouteHandler = <T extends CrawleeOneCtx<PuppeteerCrawlingContext>>(...args: Parameters<typeof captureErrorRouteHandler<T>>) => captureErrorRouteHandler<T>(...args); // prettier-ignore

/**
 * Create an `ErrorHandler` function that can be assigned to
 * `failedRequestHandler` option of `BasicCrawlerOptions`.
 *
 * The function saves error to a Dataset, and optionally forwards it to Sentry.
 *
 * By default, error reports are saved to Apify Dataset.
 */
export const createErrorHandler = <T extends CrawleeOneCtx>(
  options: CrawleeOneErrorHandlerOptions<T['io']> & {
    sendToTelemetry?: boolean;
    onSendErrorToTelemetry?: T['telemetry']['onSendErrorToTelemetry'];
  }
): ErrorHandler<T['context']> => {
  const optionsWithDefaults = {
    io: options.io,
    reportingDatasetId: options.reportingDatasetId,
    allowScreenshot: options.allowScreenshot ?? true,
  };

  return async (ctx, error) => {
    const { request, log, page } = ctx;
    const url = request.loadedUrl || request.url;
    captureError(
      { error, url, log, page: page as Page },
      {
        ...optionsWithDefaults,
        onErrorCapture: async ({ error, report }) => {
          if (!options.sendToTelemetry) return;

          await options.onSendErrorToTelemetry?.(error, report, optionsWithDefaults, ctx);
        },
      }
    );
  };
};
