import { Actor, Log } from 'apify';
import {
  BasicCrawlingContext,
  CheerioCrawlingContext,
  CrawlingContext,
  HttpCrawlingContext,
  JSDOMCrawlingContext,
  PlaywrightCrawlingContext,
  PuppeteerCrawlingContext,
  playwrightUtils,
} from 'crawlee';
import type { Page } from 'playwright';

import type { MaybePromise } from '../../utils/types';
import type { RouteHandler, RouteHandlerCtx } from '../router';

export interface CaptureErrorInput {
  error: Error;
  page?: Page;
  /** URL where the error happened. If not given URL is taken from the Page object */
  url?: string;
  log?: Log;
}

export type CaptureError = (input: CaptureErrorInput) => MaybePromise<void>;

export interface ErrorReport {
  actorId: string | null;
  actorRunId: string | null;
  actorRunUrl: string;
  errorName: string;
  errorMessage: string;
  pageUrl: string | null;
  pageHtmlSnapshot: string | null;
  pageScreenshot: string | null;
}

export interface ErrorCaptureOptions {
  allowScreenshot?: boolean;
  reportingDatasetId?: string;
  onErrorCapture?: (input: { error: Error; report: ErrorReport }) => MaybePromise<void>;
}

/**
 * Error handling for Apify actors.
 *
 * See https://docs.apify.com/academy/node-js/analyzing-pages-and-fixing-errors#error-reporting
 */
export const captureError = async ({
  error,
  page,
  url: givenUrl,
  log: parentLog,
  allowScreenshot,
  reportingDatasetId,
  onErrorCapture,
}: ErrorCaptureOptions & {
  error: Error;
  page?: Page;
  /** URL where the error happened. If not given URL is taken from the Page object */
  url?: string;
  log?: Log;
}) => {
  const log = parentLog?.child({ prefix: '[Error capture] ' });

  log?.error(`ERROR ${error.name}: ${error.message}`, error);
  console.error(`ERROR ${error.name}: ${error.message}`, error);

  // Let's create reporting dataset
  // If you already have one, this will continue adding to it
  const reportingDataset = reportingDatasetId ? await Actor.openDataset(reportingDatasetId) : null;

  // storeId is ID of current key-value store, where we save snapshots
  const storeId = Actor.getEnv().defaultKeyValueStoreId;

  // We can also capture actor and run IDs
  // to have easy access in the reporting dataset
  const { actorId, actorRunId } = Actor.getEnv();
  const actorRunUrl = `https://console.apify.com/actors/${actorId}/runs/${actorRunId}`;

  const randomNumber = Math.random();
  const key = `ERROR-${randomNumber}`;

  let pageScreenshot: string | null = null;
  let pageHtmlSnapshot: string | null = null;
  let pageUrl: string | null = givenUrl ?? null;
  if (page && allowScreenshot) {
    pageUrl = pageUrl || page.url();
    log?.info('Capturing page snapshot');
    await playwrightUtils.saveSnapshot(page, { key });
    log?.info('DONE capturing page snapshot');
    // You will have to adjust the keys if you save them in a non-standard way
    pageScreenshot = `https://api.apify.com/v2/key-value-stores/${storeId}/records/${key}.jpg?disableRedirect=true`;
    pageHtmlSnapshot = `https://api.apify.com/v2/key-value-stores/${storeId}/records/${key}.html?disableRedirect=true`;
  }

  // We create a report object
  const report = {
    actorId,
    actorRunId,
    actorRunUrl,
    errorName: error.name,
    errorMessage: error.toString(),

    pageUrl,
    pageHtmlSnapshot,
    pageScreenshot,
  } satisfies ErrorReport;

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
  error._apifyActorErrorCaptured = true;
  // Propagate the error
  throw error;
};

/** Error handling for Apify actors as a function wrapper */
export const captureErrorWrapper = async (
  fn: (input: { captureError: CaptureError }) => MaybePromise<void>,
  defaults: ErrorCaptureOptions = {}
) => {
  const captureErrorWithArgs: typeof captureError = (options) =>
    captureError({ ...defaults, ...options });

  try {
    // Pass the error capturing function to the wrapped function, so it can trigger it by itself
    await fn({ captureError: captureErrorWithArgs });
  } catch (error: any) {
    if (!error._apifyActorErrorCaptured) {
      // And if the wrapped function fails, we capture error for them
      await captureErrorWithArgs({ error });
    }
  }
};

/**
 * Drop-in replacement for regular request handler callback for Crawlee route
 * (in the context of Apify) that automatically tracks errors.
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
export const captureErrorRouteHandler = <Ctx extends CrawlingContext>(
  handler: (ctx: RouteHandlerCtx<Ctx> & { captureError: CaptureError }) => MaybePromise<void>,
  options?: ErrorCaptureOptions
) => {
  // Wrap the original handler, so we can additionally pass it the captureError function
  const wrapperHandler = (ctx: Parameters<RouteHandler<Ctx>>[0]) => {
    return captureErrorWrapper(({ captureError }) => {
      return handler({
        ...ctx,
        // And automatically feed contextual args (page, url, log) to captureError
        captureError: (input) => captureError({ ...input, ...ctx, url: ctx.request.url }),
      });
    }, options);
  };
  return wrapperHandler;
};

export const basicCcaptureErrorRouteHandler = <Ctx extends BasicCrawlingContext>(...args: Parameters<typeof captureErrorRouteHandler<Ctx>>) => captureErrorRouteHandler<Ctx>(...args); // prettier-ignore
export const httpCaptureErrorRouteHandler = <Ctx extends HttpCrawlingContext>(...args: Parameters<typeof captureErrorRouteHandler<Ctx>>) => captureErrorRouteHandler<Ctx>(...args); // prettier-ignore
export const jsdomCaptureErrorRouteHandler = <Ctx extends JSDOMCrawlingContext>(...args: Parameters<typeof captureErrorRouteHandler<Ctx>>) => captureErrorRouteHandler<Ctx>(...args); // prettier-ignore
export const playwrightCaptureErrorRouteHandler = <Ctx extends PlaywrightCrawlingContext>(...args: Parameters<typeof captureErrorRouteHandler<Ctx>>) => captureErrorRouteHandler<Ctx>(...args); // prettier-ignore
export const cheerioCaptureErrorRouteHandler = <Ctx extends CheerioCrawlingContext>(...args: Parameters<typeof captureErrorRouteHandler<Ctx>>) => captureErrorRouteHandler<Ctx>(...args); // prettier-ignore
export const puppeteerCaptureErrorRouteHandler = <Ctx extends PuppeteerCrawlingContext>(...args: Parameters<typeof captureErrorRouteHandler<Ctx>>) => captureErrorRouteHandler<Ctx>(...args); // prettier-ignore
