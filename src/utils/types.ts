export type MaybePromise<T> = T | Promise<T>;
export type MaybeArray<T> = T | T[];

export type ArrVal<T extends any[] | readonly any[]> = T[number];
