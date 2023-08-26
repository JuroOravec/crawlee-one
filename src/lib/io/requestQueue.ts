import { createSizeMonitor, type ValueMonitorOptions } from '../../utils/valueMonitor';
import type { CrawleeOneIO } from '../integrations/types';
import { apifyIO } from '../integrations/apify';

export interface RequestQueueSizeMonitorOptions extends ValueMonitorOptions {
  io?: CrawleeOneIO<any, any>;
  /**
   * ID of the RequestQueue that's monitored for size.
   *
   * If omitted, the default RequestQueue is used.
   */
  requestQueueId?: string;
}

/**
 * Semi-automatic monitoring of RequestQueue size. This is used for limiting the total of
 * entries scraped per run / RequestQueue:
 * - When RequestQueue reaches `maxSize`, then all remaining Requests are removed.
 * - Pass an array of items to `shortenToSize` to shorten the array to the size
 *   that still fits the RequestQueue.
 *
 * By default uses Apify RequestQueue.
 */
export const requestQueueSizeMonitor = (
  maxSize: number,
  options?: RequestQueueSizeMonitorOptions
) => {
  const { io = apifyIO } = options ?? {};

  const getSize = async () => {
    const reqQueue = await io.openRequestQueue(options?.requestQueueId);
    const count = (await reqQueue.handledCount()) ?? 0;
    return count;
  };

  // When we've reached the RequestQueue's max size, then remove all remaining Requests
  const onMaxSizeReached = async () => {
    const reqQueue = await io.openRequestQueue(options?.requestQueueId);
    await reqQueue.drop();
  };

  return createSizeMonitor(maxSize, getSize, onMaxSizeReached, options);
};
