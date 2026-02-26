import { Log, type RequestQueueOperationOptions } from 'crawlee';

import type { CrawlerUrl } from '../../types.js';
import type { MaybePromise } from '../../utils/types.js';
import { apifyIO } from '../integrations/apify.js';
import type { CrawleeOneIO } from '../integrations/types.js';
import { requestQueueSizeMonitor } from './requestQueue.js';

/** Options for addRequests. Extends Crawlee's RequestQueueOperationOptions (e.g. forefront). */
export interface AddRequestsOptions<
  T extends Exclude<CrawlerUrl, string> = Exclude<CrawlerUrl, string>,
> extends RequestQueueOperationOptions {
  io?: CrawleeOneIO<any, any>;
  log?: Log;
  /**
   * If set, only at most this many requests will be added to the RequestQueue.
   *
   * The count is determined from the RequestQueue that's used for the crawler run.
   *
   * This means that if `maxCount` is set to 50, but the
   * associated RequestQueue already handled 40 requests, then only 10 new requests
   * will be processed.
   */
  maxCount?: number;
  /**
   * Option to freely transform a request before pushing it to the RequestQueue.
   *
   * This serves mainly to allow users to transform the requests from actor input UI.
   */
  transform?: (req: T) => MaybePromise<T>;
  /**
   * Option to filter a request before pushing it to the RequestQueue.
   *
   * This serves mainly to allow users to filter the requests from actor input UI.
   */
  filter?: (req: T) => MaybePromise<unknown>;
  /** ID of the RequestQueue to which the data should be pushed */
  requestQueueId?: string;
}

const shortenToSize = async <T>(opts: {
  entries: T[];
  maxCount: number;
  io?: CrawleeOneIO;
  requestQueueId?: string;
  log?: Log;
}) => {
  const { entries, maxCount, requestQueueId, log } = opts;

  const queueName = requestQueueId ? `"${requestQueueId}"` : 'DEFAULT';

  const sizeMonitor = requestQueueSizeMonitor(maxCount, { io: opts.io, requestQueueId, log });

  // Ignore incoming entries if the queue is already full
  const isFull = await sizeMonitor.isFull();
  if (isFull) {
    log?.warning(`RequestQueue (${queueName}) is already full (${maxCount} entries), ${entries.length} entries will be discarded.`);
    return [];
  } // prettier-ignore

  // Show warning when only part of the incoming requests made it into the queue
  const slicedEntries = await sizeMonitor.shortenToSize(entries);
  if (slicedEntries.length !== entries.length) {
    log?.warning(`RequestQueue (${queueName}) has become full (${maxCount} entries), ${entries.length} entries will be discarded.`);
    return [];
  } // prettier-ignore

  return slicedEntries;
};

/**
 * Similar to `Actor.openRequestQueue().addRequests`, but with extra features:
 *
 * - Data can be sent elsewhere, not just to Apify. This is set by the `io` options. By default data is sent using Apify (cloud/local).
 * - Limit the max size of the RequestQueue. No requests are added when RequestQueue is at or above the limit.
 * - Transform and filter requests. Requests that did not pass the filter are not added to the RequestQueue.
 */
export const addRequests = async <T extends Exclude<CrawlerUrl, string>>(
  oneOrManyItems: T | T[],
  options?: AddRequestsOptions<T>
) => {
  const {
    io = apifyIO as CrawleeOneIO,
    log = new Log(),
    maxCount,
    transform,
    filter,
    requestQueueId,
    ...queueOptions
  } = options ?? {};

  const manyItems = Array.isArray(oneOrManyItems) ? oneOrManyItems : [oneOrManyItems];
  const items =
    maxCount != null
      ? await shortenToSize({ entries: manyItems, maxCount, io, requestQueueId, log })
      : manyItems;

  log.debug(`Preparing to push ${items.length} requests to queue`); // prettier-ignore

  const adjustedItems = await items.reduce(
    async (aggPromise, item) => {
      const agg = await aggPromise;

      const transformedItem = transform ? await transform(item) : item;
      const passedFilter = filter ? await filter(transformedItem) : true;

      if (passedFilter) agg.push(transformedItem);

      return agg;
    },
    Promise.resolve([] as unknown[])
  );

  // Push requests to primary RequestQueue
  log.info(`Pushing ${adjustedItems.length} requests to queue`);
  const reqQueue = await io.openRequestQueue(requestQueueId);
  await reqQueue.addRequests(adjustedItems as any[], queueOptions);
  log.info(`Done pushing ${adjustedItems.length} requests to queue`);

  return adjustedItems;
};
