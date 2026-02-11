import type { DatasetDataOptions } from 'apify';

import { ValueMonitorOptions, createSizeMonitor } from '../../utils/valueMonitor.js';
import type { CrawleeOneIO } from '../integrations/types.js';
import { apifyIO } from '../integrations/apify.js';

/**
 * Given a Dataset ID and a name of a field, get the columnar data.
 *
 * By default uses Apify Dataset.
 *
 * Example:
 * ```js
 * // Given dataset
 * // [
 * //   { id: 1, field: 'abc' },
 * //   { id: 2, field: 'def' }
 * // ]
 * const results = await getColumnFromDataset('datasetId123', 'field');
 * console.log(results)
 * // ['abc', 'def']
 * ```
 */
export const getColumnFromDataset = async <T>(
  datasetId: string,
  field: string,
  options?: {
    io?: CrawleeOneIO;
    dataOptions?: Pick<DatasetDataOptions, 'offset' | 'limit' | 'desc'>;
  }
) => {
  const { io = apifyIO, dataOptions } = options ?? {};

  const dataset = await io.openDataset(datasetId);
  const items = await dataset.getItems({
    ...dataOptions,
    fields: [field],
  });
  const data = items.map((d) => (d as any)[field] as T);
  return data;
};

export interface DatasetSizeMonitorOptions extends ValueMonitorOptions {
  /**
   * ID or name of the Dataset that's monitored for size.
   *
   * If omitted, the default Dataset is used.
   */
  datasetId?: string;
  /**
   * ID of the RequestQueue that holds remaining requests. This queue will be
   * emptied when Dataset reaches `maxSize`.
   *
   * If omitted, the default RequestQueue is used.
   */
  requestQueueId?: string;
  io?: CrawleeOneIO;
}

/**
 * Semi-automatic monitoring of Dataset size. This is used in limiting the total of entries
 * scraped per run / Dataset:
 * - When Dataset reaches `maxSize`, then all remaining Requests
 *   in the RequestQueue are removed.
 * - Pass an array of items to `shortenToSize` to shorten the array to the size
 *   that still fits the Dataset.
 *
 * By default uses Apify Dataset.
 */
export const datasetSizeMonitor = (maxSize: number, options?: DatasetSizeMonitorOptions) => {
  const { io = apifyIO } = options ?? {};

  const getSize = async () => {
    const dataset = await io.openDataset(options?.datasetId);
    const size = await dataset.getItemCount();
    return size ?? 0;
  };

  // When we've reached the Dataset's max size, then remove all remaining Requests
  const onMaxSizeReached = async () => {
    const reqQueue = await io.openRequestQueue(options?.requestQueueId);
    await reqQueue.clear();
  };

  return createSizeMonitor(maxSize, getSize, onMaxSizeReached, options);
};
