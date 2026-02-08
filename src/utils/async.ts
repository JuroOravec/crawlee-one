import type { MaybePromise } from '../utils/types';

export const serialAsyncMap = async <T, R>(
  inputArr: T[],
  fn: (item: T, index: number) => MaybePromise<R>
) => {
  const results = await inputArr.reduce(
    async (aggResultPromise, input, index) => {
      const agg = await aggResultPromise;
      const result = await fn(input, index);
      agg.push(result);
      return agg;
    },
    Promise.resolve([] as R[])
  );

  return results;
};

export const serialAsyncFilter = async <T>(
  inputArr: T[],
  fn: (item: T, index: number) => MaybePromise<any>
) => {
  const results = await inputArr.reduce(
    async (aggResultPromise, input, index) => {
      const agg = await aggResultPromise;
      const result = await fn(input, index);
      if (result) agg.push(input);
      return agg;
    },
    Promise.resolve([] as T[])
  );

  return results;
};

export const serialAsyncFind = async <T>(
  inputArr: T[],
  fn: (item: T, index: number) => MaybePromise<any>
) => {
  let index = 0;
  for (const input of inputArr) {
    const result = await fn(input, index);
    if (result) return input;
    index++;
  }
};

export interface RetryAsyncOptions {
  /** Number of retries after the function call fails */
  maxRetries?: number;
  /** Delay between retries in milliseconds */
  delay?: number;
  /** Callback called with error if the function call errors */
  onError?: (error: unknown, retryIndex: number) => MaybePromise<void>;
}

/** @param {number} ms Number of ms to wait */
export const wait = (ms?: number) => new Promise((res) => setTimeout(res, ms));

/** Call async function, and retry to call it `maxRetries` times if it fails. */
export const retryAsync = async <T>(
  fn: (retries: number) => Promise<T>,
  { maxRetries = 1, delay = 0, onError = () => {} }: RetryAsyncOptions = {}
) => {
  if (typeof maxRetries !== 'number' || maxRetries < 0) {
    throw Error(
      `Invalid input for maxRetries in retryAsync(fn, maxRetries). maxRetries must be a non-negative number. Got ${maxRetries}`
    );
  }

  let result: T | null = null;
  const errors: unknown[] = [];
  let retries = 0;
  while (retries <= maxRetries) {
    try {
      result = await fn(retries);
    } catch (err) {
      errors.push(err);
      await onError(err, retries);
      await wait(delay);
      retries++;
      continue; // Retry if failed
    }
    break; // Exit loop and continue flow if success
  }
  return {
    result,
    errors,
  };
};
