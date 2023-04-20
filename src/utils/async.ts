import type { MaybePromise } from '../utils/types';

export const serialAsyncMap = async <T, R>(
  inputArr: T[],
  fn: (item: T, index: number) => MaybePromise<R>
) => {
  const results = await inputArr.reduce(async (aggResultPromise, input, index) => {
    const agg = await aggResultPromise;
    const result = await fn(input, index);
    agg.push(result);
    return agg;
  }, Promise.resolve([] as R[]));

  return results;
};
