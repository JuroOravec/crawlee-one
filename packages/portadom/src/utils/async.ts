import type { MaybePromise } from './types.js';

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

export const parallelAsyncMap = async <T, R>(
  inputArr: T[],
  fn: (item: T, index: number) => MaybePromise<R>
) => {
  const results = await Promise.all(inputArr.map(fn));
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

export const parallelAsyncFilter = async <T>(
  inputArr: T[],
  fn: (item: T, index: number) => MaybePromise<any>
) => {
  const filterResults = await Promise.all(inputArr.map(fn));
  const finalArr = inputArr.filter((val, index) => filterResults[index]);
  return finalArr;
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

export const serialAsyncForEach = async <T>(
  inputArr: T[],
  fn: (item: T, index: number) => MaybePromise<void>
) => {
  let index = 0;
  for (const input of inputArr) {
    await fn(input, index);
    index++;
  }
};

export const parallelAsyncForEach = async <T>(
  inputArr: T[],
  fn: (item: T, index: number) => MaybePromise<void>
) => {
  const promises: Promise<void>[] = [];
  inputArr.forEach((val, index) => promises.push(Promise.resolve(fn(val, index))));
  await Promise.all(promises);
};
