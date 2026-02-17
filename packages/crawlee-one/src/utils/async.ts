import type { MaybePromise } from '../utils/types.js';

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

/** @param {number} ms Number of ms to wait */
export const wait = (ms?: number) => new Promise((res) => setTimeout(res, ms));
