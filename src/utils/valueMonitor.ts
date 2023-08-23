import type { MaybePromise } from './types';

export type ValueCallback<T> = (value: T, oldValue: T | null) => MaybePromise<any>;
export interface ValueMonitorOptions {
  /** How long (in milliseconds) after fetching the value can we use it before we have to re-fetch it. */
  ttlInMs?: number;
}

/**
 * ValueMonitor checks and caches a (maybe remote) value, and triggers callbacks
 * based on the value.
 *
 * You can think of it as a light replacement for reactivity (Vue) feature.
 */
export const createValueMonitor = <T>(
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

  const getValue = () => {
    return isStale() ? refreshValue() : currValue;
  };

  return {
    value: getValue,
    isStale,
    refresh: refreshValue,
    onValue: registerCallback,
  };
};

/**
 * Variant of ValueMonitor that is used for monitoring size of stores like Apify Dataset or RequestQueue.
 * - Pass an array of items to `shortenToSize` to shorten the array to the size
 *   that still fits the store.
 */
export const createSizeMonitor = (
  maxSize: number,
  sizeGetter: () => MaybePromise<number>,
  onMaxSizeReached: () => MaybePromise<void>,
  options?: ValueMonitorOptions
) => {
  const valueMonitor = createValueMonitor<number>(sizeGetter, options);

  const prepareSize = async () => {
    const size = await valueMonitor.value();
    if (typeof size === 'number' && size >= 0 && !valueMonitor.isStale()) return size;
    const newSize = await valueMonitor.refresh();
    return newSize;
  };

  const shortenToSize = async <T>(arr: T[]) => {
    const currSize = await prepareSize();
    return arr.slice(0, maxSize - currSize);
  };

  // Define handlers for when the value is updated
  valueMonitor.onValue(async (newSize) => {
    if (newSize >= maxSize) await onMaxSizeReached();
  });

  const isFull = async () => {
    const currSize = await prepareSize();
    return currSize >= maxSize;
  };

  return {
    ...valueMonitor,
    shortenToSize,
    isFull,
  };
};
