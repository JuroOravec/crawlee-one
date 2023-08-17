import { Actor, DatasetDataOptions } from 'apify';

import type { MaybePromise } from '../../utils/types';

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

export type ValueCallback<T> = (value: T, oldValue: T | null) => MaybePromise<any>;
interface ValueMonitorOptions {
  /** How long (in milliseconds) after fetching the value can we use it before we have to re-fetch it. */
  ttlInMs?: number;
}

/**
 * ValueMonitor checks and caches a (maybe remote) value, and triggers callbacks
 * based on the value.
 */
const createValueMonitor = <T>(
  fetchValueFn: (oldValue: T | null) => MaybePromise<T>,
  options?: ValueMonitorOptions
) => {
  const ttlInMs = options?.ttlInMs ?? 5000;

  let currValue: T | null = null;
  let lastFetchTimestamp: number | null = null;
  const callbacks: ValueCallback<T>[] = [];

  const registerCallback = (callback: ValueCallback<T>) => {
    callbacks.push(callback);
    return () => deregisterCallback(callback);
  };

  const deregisterCallback = (callback: ValueCallback<T>) => {
    const index = callbacks.indexOf(callback);
    callbacks.splice(index, 1);
  };

  const isStale = () => {
    if (lastFetchTimestamp == null) return true;

    const now = new Date().getTime();
    const expiry = lastFetchTimestamp + ttlInMs;
    return now >= expiry;
  };

  const refreshValue = async () => {
    const oldValue = currValue;
    const newValue = (currValue = await fetchValueFn(oldValue));
    lastFetchTimestamp = new Date().getTime();

    for (const cb of callbacks) {
      await cb(newValue, oldValue);
    }

    return currValue as T;
  };

  return {
    value: () => currValue,
    isStale,
    refresh: refreshValue,
    onValue: registerCallback,
  };
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
  const valueMonitor = createValueMonitor<number>(async () => {
    const dataset = await Actor.openDataset(options?.datasetId);
    const info = await dataset.getInfo();
    return info?.itemCount ?? 0;
  }, options);

  const prepareDatasetSize = async () => {
    const size = valueMonitor.value();
    if (typeof size === 'number' && size >= 0 && !valueMonitor.isStale()) return size;
    const newSize = await valueMonitor.refresh();
    return newSize;
  };

  // When we've reached the Dataset's max size, then remove all remaining Requests
  const onMaxSizeReached = async () => {
    const reqQueue = await Actor.openRequestQueue(options?.requestQueueId);
    await reqQueue.drop();
  };

  const shortenToSize = async <T>(arr: T[]) => {
    const currSize = await prepareDatasetSize();
    return arr.slice(0, currSize);
  };

  // Define handlers for when the value is updated
  valueMonitor.onValue(async (newSize) => {
    if (newSize >= maxSize) await onMaxSizeReached();
  });

  const isFull = async () => {
    const currSize = await prepareDatasetSize();
    return currSize >= maxSize;
  };

  return {
    ...valueMonitor,
    shortenToSize,
    isFull,
  };
};
