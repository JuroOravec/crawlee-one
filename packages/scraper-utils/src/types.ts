export type MaybePromise<T> = T | Promise<T>;
export type MaybeArray<T> = T | T[];

export type ArrVal<T extends any[] | readonly any[]> = T[number];
export const enumFromArray = <T extends readonly string[]>(arr: T) => {
  return arr.reduce<{ [Key in ArrVal<T>]: Key }>((agg, k) => {
    (agg as any)[k] = k;
    return agg;
  }, {} as any);
};
