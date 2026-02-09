/** Value or a promise thereof */
export type MaybePromise<T> = T | Promise<T>;
/** Value or an array thereof */
export type MaybeArray<T> = T | T[];
/** Value or (a)sync func that returns thereof */
export type MaybeAsyncFn<R, Args extends any[]> = R | ((...args: Args) => MaybePromise<R>);

/** Unwrap Array to its item(s) */
export type ArrVal<T extends any[] | readonly any[]> = T[number];
export const enumFromArray = <T extends readonly string[]>(arr: T) => {
  return arr.reduce<{ [Key in ArrVal<T>]: Key }>((agg, k) => {
    agg[k] = k;
    return agg;
  }, {} as any);
};

/** Pick properties that should be optional */
export type PickPartial<T extends object, Keys extends keyof T> = Omit<T, Keys> &
  Partial<Pick<T, Keys>>;
/** Pick properties that should be required */
export type PickRequired<T extends object, Keys extends keyof T> = Omit<T, Keys> &
  Required<Pick<T, Keys>>;

/** Remove the first element of the array */
// See https://stackoverflow.com/a/55344772/9788634
export type Tail<T extends any[]> = T extends [infer _A, ...infer R] ? R : never;
