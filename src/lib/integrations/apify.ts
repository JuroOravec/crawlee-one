import { Actor, ApifyEnv } from 'apify';
import { CrawlingContext, Request as CrawleeRequest, playwrightUtils } from 'crawlee';

import type { CrawleeOneDataset, CrawleeOneIO } from './types.js';

export interface ApifyErrorReport {
  actorId: string | null;
  actorRunId: string | null;
  actorRunUrl: string;
  errorName: string;
  errorMessage: string;
  pageUrl: string | null;
  pageHtmlSnapshot: string | null;
  pageScreenshot: string | null;
}

export interface ApifyEntryMetadata {
  actorId: string | null;
  actorRunId: string | null;
  actorRunUrl: string | null;
  contextId: string;
  requestId: string | null;

  /** The URL given to the crawler */
  originalUrl: string | null;
  /** The URL given to the crawler after possible redirects */
  loadedUrl: string | null;

  /** ISO datetime string that indicates the time when the request has been processed. */
  dateHandled: string;
  numberOfRetries: number;
}

/**
 * Integration between CrawleeOne and Apify.
 *
 * This is the default integration.
 */
export type ApifyCrawleeOneIO = CrawleeOneIO<ApifyEnv, ApifyErrorReport, ApifyEntryMetadata>;

const generateApifyErrorReport: ApifyCrawleeOneIO['generateErrorReport'] = async (
  input,
  options
) => {
  const { error, page, url, log } = input;
  const { allowScreenshot } = options;

  // storeId is ID of current key-value store, where we save snapshots
  // We can also capture actor and run IDs
  // to have easy access in the reporting dataset
  const { actorId, actorRunId, defaultKeyValueStoreId: storeId } = await Actor.getEnv();

  const actorRunUrl = `https://console.apify.com/actors/${actorId}/runs/${actorRunId}`;

  const randomNumber = Math.random();
  const key = `ERROR-${randomNumber}`;

  let pageScreenshot: string | null = null;
  let pageHtmlSnapshot: string | null = null;
  let pageUrl: string | null = url ?? null;
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
  } satisfies ApifyErrorReport;

  return report;
};

const generateApifyEntryMetadata = <Ctx extends CrawlingContext>(ctx: Ctx) => {
  const { actorId, actorRunId } = Actor.getEnv();
  const actorRunUrl =
    actorId != null && actorRunId != null
      ? `https://console.apify.com/actors/${actorId}/runs/${actorRunId}`
      : null;
  const handledAt = new Date().toISOString();

  const metadata = {
    actorId,
    actorRunId,
    actorRunUrl,
    contextId: ctx.id,
    requestId: ctx.request.id ?? null,

    originalUrl: ctx.request.url ?? null,
    loadedUrl: ctx.request.loadedUrl ?? null,

    dateHandled: ctx.request.handledAt || handledAt,
    numberOfRetries: ctx.request.retryCount,
  } satisfies ApifyEntryMetadata;

  return metadata;
};

/**
 * Integration between CrawleeOne and Apify.
 *
 * This is the default integration.
 */
export const apifyIO: ApifyCrawleeOneIO = {
  openDataset: async (...args) => {
    const dataset = await Actor.openDataset(...args);
    const getItemCount = async () => (await dataset.getInfo())?.itemCount ?? null;
    const getItems: CrawleeOneDataset['getItems'] = async (options) => {
      const result = await dataset.getData({
        ...options,
        skipEmpty: true,
      });
      return result.items;
    };

    return {
      pushData: dataset.pushData.bind(dataset),
      getItems,
      getItemCount,
    };
  },
  openRequestQueue: async (...args) => {
    const queue = await Actor.openRequestQueue(...args);
    const clear = async () => {
      let req: CrawleeRequest | null;
      do {
        req = await queue.fetchNextRequest();
        if (req) await queue.markRequestHandled(req);
      } while (req);
    };

    return {
      addRequests: (...args) => queue.addRequests(...args),
      markRequestHandled: (...args) => queue.markRequestHandled(...args),
      fetchNextRequest: (...args) => queue.fetchNextRequest(...args),
      reclaimRequest: (...args) => queue.reclaimRequest(...args),
      isFinished: (...args) => queue.isFinished(...args),
      handledCount: (...args) => queue.handledCount(...args),
      drop: (...args) => queue.drop(...args),
      clear,
    };
  },
  openKeyValueStore: async (...args) => {
    const store = await Actor.openKeyValueStore(...args);
    const clear = async () => {
      await store.forEachKey((key) => store.setValue(key, null));
    };

    return {
      getValue: (...args) => store.getValue(...args),
      setValue: (...args) => store.setValue(...args),
      drop: (...args) => store.drop(...args),
      clear,
    };
  },
  getInput: (...args) => Actor.getInput(...args),
  runInContext: async (...args) => {
    await Actor.main(...args);
  },
  triggerDownstreamCrawler: (...args) => Actor.metamorph(...args),
  createDefaultProxyConfiguration: async (input: any) => {
    return process.env.APIFY_IS_AT_HOME
      ? await Actor.createProxyConfiguration(input?.proxy)
      : undefined;
  },
  isTelemetryEnabled: () => !!process.env.APIFY_IS_AT_HOME,
  generateErrorReport: generateApifyErrorReport,
  generateEntryMetadata: generateApifyEntryMetadata,
} satisfies ApifyCrawleeOneIO;
