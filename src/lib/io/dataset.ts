import { Actor, DatasetDataOptions, Log } from 'apify';

import { ValueMonitorOptions, createSizeMonitor } from '../../utils/valueMonitor';

// TODO - This is a weird function and should be refactored or moved out of utils package
/**
 * Given a batch of entries, use several strategies to check
 * if we've reached the limit on the max number of entries
 * we're allowed to extract this run.
 */
export const checkDatasetEntriesCount = async (
  {
    currBatchCount,
    maxCount,
    datasetNameOrId,
    customItemCount,
  }: {
    /** Number of entries in the current batch */
    currBatchCount: number;
    /** Max number of entries allowed to extract. */
    maxCount?: number | null;
    /**
     * If given, maxCount will be ALSO compared against
     * the amount of entries already in the dataset.
     */
    datasetNameOrId?: string | null;
    /**
     * If given, maxCount will be ALSO compared against
     * this amount.
     */
    customItemCount?: number | null;
  },
  { log }: { log?: Log } = {}
) => {
  const datasetItemCount = datasetNameOrId ? await getDatasetCount(datasetNameOrId, { log }) : null;

  if ((datasetItemCount == null && customItemCount == null) || maxCount == null) {
    return { limitReached: false, overflow: 0 };
  }

  // Check if we've reached the limit for max entries
  if (currBatchCount >= maxCount) {
    return { limitReached: true, overflow: currBatchCount - maxCount };
  }

  // Use count of items already in dataset to check if limit reached
  if (datasetItemCount != null && datasetItemCount + currBatchCount >= maxCount) {
    return { limitReached: true, overflow: datasetItemCount + currBatchCount - maxCount };
  }

  // Use page offset to check if limit reached (20 entries per page)
  if (customItemCount != null && customItemCount >= maxCount) {
    return { limitReached: true, overflow: customItemCount - maxCount };
  }

  return { limitReached: false, overflow: 0 };
};

export const getDatasetCount = async (datasetNameOrId?: string, { log }: { log?: Log } = {}) => {
  log?.debug('Opening dataset');
  const dataset = await Actor.openDataset(datasetNameOrId);
  log?.debug('Obtaining dataset entries count');
  const datasetInfo = await dataset.getInfo();
  const count = datasetInfo?.itemCount ?? null;
  if (typeof count !== 'number') {
    log?.warning('Failed to get count of entries in dataset. We use this info to know how many items were scraped. More entries might be scraped than was set.'); // prettier-ignore
  } else {
    log?.debug(`Done obtaining dataset entries count (${count})`);
  }
  return count;
};

/**
 * Given an ID of an Apify Dataset and a name of a field,
 * get the columnar data.
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
export const getColumnFromDataset = async (
  datasetId: string,
  field: string,
  options?: { dataOptions?: Pick<DatasetDataOptions, 'offset' | 'limit' | 'desc'> }
) => {
  const dataset = await Actor.openDataset(datasetId);
  const result = await dataset.getData({
    ...options?.dataOptions,
    fields: [field],
    skipEmpty: true,
  });
  const data = result.items.map((d) => d[field]);
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
}

/**
 * Semi-automatic monitoring of Apify Dataset size used in limiting the total of entries scraped per run / Dataset:
 * - When Dataset reaches `maxSize`, then all remaining Requests
 *   in the RequestQueue are removed.
 * - Pass an array of items to `shortenToSize` to shorten the array to the size
 *   that still fits the Dataset.
 */
export const datasetSizeMonitor = (maxSize: number, options?: DatasetSizeMonitorOptions) => {
  const getSize = async () => {
    const dataset = await Actor.openDataset(options?.datasetId);
    const info = await dataset.getInfo();
    return info?.itemCount ?? 0;
  };

  // When we've reached the Dataset's max size, then remove all remaining Requests
  const onMaxSizeReached = async () => {
    const reqQueue = await Actor.openRequestQueue(options?.requestQueueId);
    await reqQueue.drop();
  };

  return createSizeMonitor(maxSize, getSize, onMaxSizeReached, options);
};
