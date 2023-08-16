import { fromPairs } from 'lodash';

export type MaybePromise<T> = T | Promise<T>;
export type MaybeArray<T> = T | T[];

export type ArrVal<T extends any[] | readonly any[]> = T[number];

export const enumFromArray = <T extends readonly any[]>(arr: T) => {
  return fromPairs(arr.map((k) => [k, k])) as { [Key in ArrVal<T>]: Key };
};

export type PickPartial<T extends object, Keys extends keyof T> = Omit<T, Keys> &
  Partial<Pick<T, Keys>>;
