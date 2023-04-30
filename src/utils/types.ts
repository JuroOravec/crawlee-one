export type MaybePromise<T> = T | Promise<T>;
export type MaybeArray<T> = T | T[];

export type ArrVal<T extends any[] | readonly any[]> = T[number];

export type ConstructorArgs<T extends abstract new (...args: any) => any> = T extends {
  new (...args: infer U): InstanceType<T>;
}
  ? U
  : never;
