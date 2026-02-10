import type { StrAsNumOptions } from '../utils/format.js';
import type { FormatUrlOptions } from '../utils/url.js';
import type { MaybeArray, MaybePromise } from '../utils/types.js';
import {
  parallelAsyncFilter,
  parallelAsyncForEach,
  parallelAsyncMap,
  serialAsyncFilter,
  serialAsyncFind,
  serialAsyncForEach,
  serialAsyncMap,
} from '../utils/async.js';

/**
 * Common interface for working with DOM despite different environments.
 *
 * Consider these environments:
 * 1) Browser (via Playwright & Chromium) - uses Browser API to work with DOM
 * 2) Cheerio - uses own API to work with DOM
 *
 * This common interfaces makes the scraping code more portable between the two.
 */
export interface Portadom<El, TNewEl = El> {
  node: El | null;

  ///////////////////////
  // SCALAR OPERATIONS
  ///////////////////////

  /** Get element's text (trimmed) */
  text: (options?: { allowEmpty?: boolean }) => MaybePromise<string | null>;
  /** Get element's text as uppercase (trimmed) */
  textAsUpper: (options?: { allowEmpty?: boolean }) => MaybePromise<string | null>;
  /** Get element's text as lowercase (trimmed) */
  textAsLower: (options?: { allowEmpty?: boolean }) => MaybePromise<string | null>;
  /** Get element's text and convert it to number */
  textAsNumber: (options?: StrAsNumOptions) => MaybePromise<number | null>;
  /** Get element's attribute */
  attr: (attrName: string, options?: { allowEmpty?: boolean }) => MaybePromise<string | null>;
  /** Get element's attributes */
  attrs: <T extends string>(
    attrNames: T[],
    options?: { allowEmpty?: boolean }
  ) => MaybePromise<Record<T, string | null>>;
  /** Get element's property */
  prop: <R = any>(
    /** Single or nested prop path */
    propName: MaybeArray<string>,
    options?: { allowEmpty?: boolean }
  ) => MaybePromise<R>;
  /** Get element's properties */
  props: <R = any>(
    /** List of single or nested prop paths */
    propName: MaybeArray<string>[],
    options?: { allowEmpty?: boolean }
  ) => MaybePromise<R>;
  /** Get element's href */
  href: (options?: { allowEmpty?: boolean } & FormatUrlOptions) => MaybePromise<string | null>;
  /** Get element's src */
  src: (options?: { allowEmpty?: boolean } & FormatUrlOptions) => MaybePromise<string | null>;
  /** Get element's nodeName */
  nodeName: () => MaybePromise<string | null>;
  /** Get URL of website associated with the DOM */
  url: () => MaybePromise<string | null>;
  /** Freely modify the underlying DOM node */
  map: <TVal>(map: (node: El | null) => TVal) => MaybePromise<TVal>;

  ///////////////////////
  // NODE OPERATIONS
  ///////////////////////

  /** Get a single descendant matching the selector */
  findOne: <TFindEl = TNewEl>(selector: string) => PortadomPromise<TFindEl>; // prettier-ignore
  /** Get all descendants matching the selector */
  findMany: <TFindEl = TNewEl>(selector: string) => PortadomArrayPromise<TFindEl>; // prettier-ignore
  /** Get a single ancestor (or itself) matching the selector */
  closest: <TFindEl = TNewEl>(selector: string) => PortadomPromise<TFindEl>; // prettier-ignore
  /** Get element's parent */
  parent: <TFindEl = TNewEl>() => PortadomPromise<TFindEl>;
  /** Get element's children */
  children: <TFindEl = TNewEl>() => PortadomArrayPromise<TFindEl>;
  /** Remove the element */
  remove: () => MaybePromise<void>;
  /** Get root element */
  root: <TFindEl = TNewEl>() => PortadomPromise<TFindEl>;

  /**
   * Given two elements, return closest ancestor element that encompases them both,
   * or `null` if none such found.
   */
  getCommonAncestor: <TFindEl = TNewEl>(otherEl: El) => PortadomPromise<TFindEl>;
  /**
   * Given a selector, find all DOM elements that match the selector,
   * and return closest ancestor element that encompases them all,
   * or `null` if none such found.
   */
  getCommonAncestorFromSelector: <TFindEl = TNewEl>(selector: string) => PortadomPromise<TFindEl>;
}

/**
 * Wrapper for a {@link Promise} that resolves to a {@link Portadom} instance. This allows us to chain
 * Portadom methods before the Promise is resolved.
 *
 * Example:
 *
 * ```js
 * const dom = Promise.resolve(browserPortadom({}));
 * ```
 *
 * Instead of:
 * ```js
 * const resA = await (await dom).findOne('..');
 * const resB = await (await dom).text();
 * ```
 *
 * You can call:
 * ```js
 * const domP = createPortadomPromise(dom);
 * const resA = await domP.findOne('..');
 * const resB = await domP.text();
 * ```
 */
export interface PortadomPromise<El> {
  promise: Promise<Portadom<El> | null>;
  node: Promise<El | null>;

  ///////////////////////
  // SCALAR OPERATIONS
  ///////////////////////

  /** Get element's text (trimmed) */
  text: (
    ...args: Parameters<Portadom<El>['text']>
  ) => Promise<Awaited<ReturnType<Portadom<El>['text']>>>;
  /** Get element's text as uppercase (trimmed) */
  textAsUpper: (
    ...args: Parameters<Portadom<El>['textAsUpper']>
  ) => Promise<Awaited<ReturnType<Portadom<El>['textAsUpper']>>>;
  /** Get element's text as lowercase (trimmed) */
  textAsLower: (
    ...args: Parameters<Portadom<El>['textAsLower']>
  ) => Promise<Awaited<ReturnType<Portadom<El>['textAsLower']>>>;
  /** Get element's text and convert it to number */
  textAsNumber: (
    ...args: Parameters<Portadom<El>['textAsNumber']>
  ) => Promise<Awaited<ReturnType<Portadom<El>['textAsNumber']>>>;
  /** Get element's attribute */
  attr: (
    ...args: Parameters<Portadom<El>['attr']>
  ) => Promise<Awaited<ReturnType<Portadom<El>['attr']>>>;
  /** Get element's attributes */
  attrs: <Attrs extends string>(
    ...args: [attrNames: Attrs[], options?: { allowEmpty?: boolean }]
  ) => Promise<Awaited<ReturnType<Portadom<El>['attrs']>> | null>;
  /** Get element's property */
  prop: (...args: Parameters<Portadom<El>['prop']>) => Promise<any>;
  /** Get element's properties */
  props: (...args: Parameters<Portadom<El>['props']>) => Promise<any>;
  /** Get element's href */
  href: (
    ...args: Parameters<Portadom<El>['href']>
  ) => Promise<Awaited<ReturnType<Portadom<El>['href']>>>;
  /** Get element's src */
  src: (
    ...args: Parameters<Portadom<El>['src']>
  ) => Promise<Awaited<ReturnType<Portadom<El>['src']>>>;
  /** Get element's nodeName */
  nodeName: (
    ...args: Parameters<Portadom<El>['nodeName']>
  ) => Promise<Awaited<ReturnType<Portadom<El>['nodeName']>>>;
  /** Get URL of website associated with the DOM */
  url: (
    ...args: Parameters<Portadom<El>['url']>
  ) => Promise<Awaited<ReturnType<Portadom<El>['url']>>>;
  /** Freely modify the underlying DOM node */
  map: <TVal>(...args: [map: (node: El | null) => TVal]) => Promise<TVal | null>;

  ///////////////////////
  // NODE OPERATIONS
  ///////////////////////

  /** Get a single descendant matching the selector */
  findOne: <TFindEl = El>(...args: Parameters<Portadom<El>['findOne']>) => PortadomPromise<TFindEl>;
  /** Get all descendants matching the selector */
  findMany: <TFindEl = El>(
    ...args: Parameters<Portadom<El>['findMany']>
  ) => PortadomArrayPromise<TFindEl>;
  /** Get a single ancestor (or itself) matching the selector */
  closest: <TFindEl = El>(...args: Parameters<Portadom<El>['closest']>) => PortadomPromise<TFindEl>;
  /** Get element's parent */
  parent: <TFindEl = El>(...args: Parameters<Portadom<El>['parent']>) => PortadomPromise<TFindEl>;
  /** Get element's children */
  children: <TFindEl = El>(
    ...args: Parameters<Portadom<El>['children']>
  ) => PortadomArrayPromise<TFindEl>;
  /** Remove the element */
  remove: (...args: Parameters<Portadom<El>['remove']>) => MaybePromise<void>;
  /** Get root element */
  root: <TFindEl = El>(...args: Parameters<Portadom<El>['root']>) => PortadomPromise<TFindEl>;

  /**
   * Given two elements, return closest ancestor element that encompases them both,
   * or `null` if none such found.
   */
  getCommonAncestor: <TFindEl = El>(...args: [otherEl: El]) => PortadomPromise<TFindEl>;
  /**
   * Given a selector, find all DOM elements that match the selector,
   * and return closest ancestor element that encompases them all,
   * or `null` if none such found.
   */
  getCommonAncestorFromSelector: <TFindEl = El>(
    ...args: [selector: string]
  ) => PortadomPromise<TFindEl>;
}

/**
 * Wrapper for a {@link Promise} that resolves to a {@link Portadom} instance. This allows us to chain
 * Portadom methods before the Promise is resolved.
 */
export const createPortadomPromise = <El>(
  promiseDom: MaybePromise<Portadom<El> | null>
): PortadomPromise<El> => {
  type T = Portadom<El>;

  const promise = Promise.resolve(promiseDom);
  return {
    promise,
    get node() {
      return promise.then((d) => d?.node ?? null);
    },

    ///////////////////////
    // SCALAR OPERATIONS
    ///////////////////////

    /** Get element's text (trimmed) */
    text: (...args: Parameters<T['text']>) => promise.then((d) => d?.text(...args) ?? null),
    /** Get element's text as uppercase (trimmed) */
    textAsUpper: (...args: Parameters<T['textAsUpper']>) => promise.then((d) => d?.textAsUpper(...args) ?? null),
    /** Get element's text as lowercase (trimmed) */
    textAsLower: (...args: Parameters<T['textAsLower']>) => promise.then((d) => d?.textAsLower(...args) ?? null),
    /** Get element's text and convert it to number */
    textAsNumber: (...args: Parameters<T['textAsNumber']>) => promise.then((d) => d?.textAsNumber(...args) ?? null),
    /** Get element's attribute */
    attr: (...args: Parameters<T['attr']>) => promise.then((d) => d?.attr(...args) ?? null),
    /** Get element's attributes */
    attrs: <Attrs extends string>(...args: [
      attrNames: Attrs[],
      options?: { allowEmpty?: boolean }
    ]) => promise.then((d) => d?.attrs<Attrs>(...args) ?? null),
    /** Get element's property */
    prop: (...args: Parameters<T['prop']>) => promise.then((d) => d?.prop(...args) ?? null),
    /** Get element's properties */
    props: (...args: Parameters<T['props']>) => promise.then((d) => d?.props(...args) ?? null),
    /** Get element's href */
    href: (...args: Parameters<T['href']>) => promise.then((d) => d?.href(...args) ?? null),
    /** Get element's src */
    src: (...args: Parameters<T['src']>) => promise.then((d) => d?.src(...args) ?? null),
    /** Get element's nodeName */
    nodeName: (...args: Parameters<T['nodeName']>) => promise.then((d) => d?.nodeName(...args) ?? null),
    /** Get URL of website associated with the DOM */
    url: (...args: Parameters<T['url']>) => promise.then((d) => d?.url(...args) ?? null),
    /** Freely modify the underlying DOM node */
    map: <TVal>(...args: [
      map: (node: El | null) => TVal
    ]) => promise.then((d) => d?.map<TVal>(...args) ?? null),

    ///////////////////////
    // NODE OPERATIONS
    ///////////////////////

    /** Get a single descendant matching the selector */
    findOne: <TFindEl = El>(...args: Parameters<T['findOne']>) => {
      return createPortadomPromise<TFindEl>(
        promise.then<Portadom<TFindEl> | null>(async (d) => {
          const res = await d?.findOne<TFindEl>(...args).promise ?? null;
          return res;
        })
      );
    },
    /** Get all descendants matching the selector */
    findMany: <TFindEl = El>(...args: Parameters<T['findMany']>) => {
      return createPortadomArrayPromise<TFindEl>(
        promise.then<Portadom<TFindEl>[]>((d) => d ? d.findMany<TFindEl>(...args).promise : [])
      );
    },
    /** Get a single ancestor (or itself) matching the selector */
    closest: <TFindEl = El>(...args: Parameters<T['closest']>) => {
      return createPortadomPromise<TFindEl>(
        promise.then<Portadom<TFindEl> | null>(async (d) => {
          const res = await d?.closest<TFindEl>(...args).promise ?? null;
          return res;
        })
      );
    },
    /** Get element's parent */
    parent: <TFindEl = El>(...args: Parameters<T['parent']>) => {
      return createPortadomPromise<TFindEl>(
        promise.then<Portadom<TFindEl> | null>(async (d) => {
          const res = await d?.parent<TFindEl>(...args).promise ?? null;
          return res;
        }),
      );
    },
    /** Get element's children */
    children: <TFindEl = El>(...args: Parameters<T['children']>) => {
      return createPortadomArrayPromise<TFindEl>(
        promise.then<Portadom<TFindEl>[]>((d) => d ? d.children<TFindEl>(...args).promise : [])
      );
    },
    /** Get remove the element */
    remove: (...args: Parameters<T['remove']>) => promise.then((d) => d?.remove(...args)),
    /** Get root element */
    root: <TFindEl = El>(...args: Parameters<T['root']>) => {
      return createPortadomPromise<TFindEl>(
        promise.then<Portadom<TFindEl> | null>(async (d) => {
          const res = await d?.root<TFindEl>(...args).promise ?? null;
          return res;
        })
      );
    },
    /**
     * Given two elements, return closest ancestor element that encompases them both,
     * or `null` if none such found.
     */
    getCommonAncestor: <TFindEl = El>(...args: [
      otherEl: El
    ]) => {
      return createPortadomPromise<TFindEl>(
        promise.then<Portadom<TFindEl> | null>(async (d) => {
          const res = await d?.getCommonAncestor<TFindEl>(...args).promise ?? null;
          return res;
        }),
      );
    },
    /**
     * Given a selector, find all DOM elements that match the selector,
     * and return closest ancestor element that encompases them all,
     * or `null` if none such found.
     */
    getCommonAncestorFromSelector: <TFindEl = El>(...args: [
      selector: string
    ]) => {
      return createPortadomPromise<TFindEl>(
        promise.then<Portadom<TFindEl> | null>(async (d) => {
          const res = await d?.getCommonAncestorFromSelector<TFindEl>(...args).promise ?? null;
          return res;
        }),
      );
    },
  } as PortadomPromise<El>; // prettier-ignore
};

/**
 * Wrapper for a {@link Promise} that resolves to an Array of {@link Portadom} instances. This allows us to chain
 * Portadom methods before the Promise is resolved.
 */
export interface PortadomArrayPromise<El> {
  /** Wrapped Promise of an array of {@link Portadom} instances */
  promise: Promise<Portadom<El>[]>;

  ///////////////////
  // ARRAY API
  ///////////////////

  /** Wrapper for {@link Array.at} that returns the resulting item as {@link PortadomPromise}. */
  at: (...args: Parameters<Portadom<El>[]['at']>) => PortadomPromise<El>;
  /**
   * Wrapper for {@link Array.concat} that returns the resulting array wrapped in {@link PortadomArrayPromise}.
   *
   * NOTE: The concat values are expected to be {@link Portadom} instances
   */
  concat: (...args: Parameters<Portadom<El>[]['concat']>) => PortadomArrayPromise<El>;
  /**
   * Wrapper for {@link Array.copyWithin} that returns the resulting array wrapped in {@link PortadomArrayPromise}.
   */
  copyWithin: (...args: Parameters<Portadom<El>[]['copyWithin']>) => PortadomArrayPromise<El>;
  /**
   * Wrapper for {@link Array.entries}.
   *
   * NOTE: Does NOT return an instance of {@link PortadomArrayPromise}
   */
  entries: (
    ...args: Parameters<Portadom<El>[]['entries']>
  ) => Promise<IterableIterator<[number, Portadom<El>]>>;
  /** Wrapper for {@link Array.every}. */
  every: (...args: Parameters<Portadom<El>[]['every']>) => Promise<boolean>;
  /**
   * Wrapper for {@link Array.fill}.
   *
   * NOTE: Fill values can be anything, so result is NOT wrapped in an instance of {@link PortadomArrayPromise}.
   *
   * NOTE2: Unlike {@link Array.fill}, this option doesn't allow to specify `start` and `end`.
   */
  fill: <U>(...args: [value: U]) => Promise<U[]>;
  /**
   * Wrapper for {@link Array.filter} that returns the resulting array wrapped in {@link PortadomArrayPromise}.
   */
  filter: (...args: Parameters<Portadom<El>[]['filter']>) => PortadomArrayPromise<El>;
  /** Wrapper for {@link Array.find} that returns the resulting item as {@link PortadomPromise}. */
  find: (...args: Parameters<Portadom<El>[]['find']>) => PortadomPromise<El>;
  /** Wrapper for {@link Array.findIndex}. */
  findIndex: (...args: Parameters<Portadom<El>[]['findIndex']>) => Promise<number>;
  /** Wrapper for {@link Array.flat} that returns the resulting array wrapped in {@link PortadomArrayPromise}. */
  flat: (...args: Parameters<Portadom<El>[]['flat']>) => PortadomArrayPromise<El>;
  /**
   * Wrapper for {@link Array.flatMap}.
   *
   * NOTE: Mapped values can be anything, so result is NOT wrapped in an instance of {@link PortadomArrayPromise}
   */
  flatMap: <U, This = undefined>(...args: [
    callback: (this: This, value: Portadom<El>, index: number, array: Portadom<El>[]) => U | readonly U[],
    thisArg?: This | undefined
  ]) => Promise<U[]>; // prettier-ignore
  /** Wrapper for {@link Array.forEach}. */
  forEach: (...args: Parameters<Portadom<El>[]['forEach']>) => Promise<void>;
  /** Wrapper for {@link Array.includes}. */
  includes: (...args: Parameters<Portadom<El>[]['includes']>) => Promise<boolean>;
  /** Wrapper for {@link Array.indexOf}. */
  indexOf: (...args: Parameters<Portadom<El>[]['indexOf']>) => Promise<number>;
  /** Wrapper for {@link Array.join}. */
  join: (...args: Parameters<Portadom<El>[]['join']>) => Promise<string>;
  /** Wrapper for {@link Array.keys}. */
  keys: (...args: Parameters<Portadom<El>[]['keys']>) => Promise<IterableIterator<number>>;
  /** Wrapper for {@link Array.lastIndexOf}. */
  lastIndexOf: (...args: Parameters<Portadom<El>[]['lastIndexOf']>) => Promise<number>;
  /** Wrapper for {@link Array.length}. */
  length: Promise<number>;
  /**
   * Wrapper for {@link Array.map}.
   *
   * NOTE: Mapped values can be anything, so result is NOT wrapped in an instance of {@link PortadomArrayPromise}
   */
  map: <U>(...args: [
    callbackfn: (value: Portadom<El>, index: number, array: Portadom<El>[]) => U,
    thisArg?: any
  ]) => Promise<U[]>; // prettier-ignore
  /** Wrapper for {@link Array.pop} that returns the resulting item as {@link PortadomPromise}. */
  pop: (...args: Parameters<Portadom<El>[]['pop']>) => PortadomPromise<El>;
  /**
   * Wrapper for {@link Array.push}.
   *
   * NOTE: The pushed values are expected to be {@link Portadom} instances.
   */
  push: (...args: Parameters<Portadom<El>[]['push']>) => Promise<number>;
  /**
   * Wrapper for {@link Array.reduce}.
   *
   * NOTE: The reduce value can be anything, so result is NOT wrapped in an instance of {@link PortadomArrayPromise}
   */
  reduce(callbackfn: (previousValue: Portadom<El>, currentValue: Portadom<El>, currentIndex: number, array: Portadom<El>[]) => Portadom<El>): Promise<Portadom<El>>; // prettier-ignore
  reduce(callbackfn: (previousValue: Portadom<El>, currentValue: Portadom<El>, currentIndex: number, array: Portadom<El>[]) => Portadom<El>, initialValue: Portadom<El>): Promise<Portadom<El>>; // prettier-ignore
  reduce<U>(callbackfn: (previousValue: U, currentValue: Portadom<El>, currentIndex: number, array: Portadom<El>[]) => U, initialValue: U): Promise<U>; // prettier-ignore
  /**
   * Wrapper for {@link Array.reduceRight}.
   *
   * NOTE: The reduce value can be anything, so result is NOT wrapped in an instance of {@link PortadomArrayPromise}
   */
  reduceRight(callbackfn: (previousValue: Portadom<El>, currentValue: Portadom<El>, currentIndex: number, array: Portadom<El>[]) => Portadom<El>): Promise<Portadom<El>>; // prettier-ignore
  reduceRight(callbackfn: (previousValue: Portadom<El>, currentValue: Portadom<El>, currentIndex: number, array: Portadom<El>[]) => Portadom<El>, initialValue: Portadom<El>): Promise<Portadom<El>>; // prettier-ignore
  reduceRight<U>(callbackfn: (previousValue: U, currentValue: Portadom<El>, currentIndex: number, array: Portadom<El>[]) => U, initialValue: U): Promise<U>; // prettier-ignore
  /**
   * Wrapper for {@link Array.reverse} that returns the resulting array wrapped in {@link PortadomArrayPromise}.
   */
  reverse: (...args: Parameters<Portadom<El>[]['reverse']>) => PortadomArrayPromise<El>;
  /** Wrapper for {@link Array.shift} that returns the resulting item as {@link PortadomPromise}. */
  shift: (...args: Parameters<Portadom<El>[]['shift']>) => PortadomPromise<El>;
  /**
   * Wrapper for {@link Array.slice} that returns the resulting array wrapped in {@link PortadomArrayPromise}.
   */
  slice: (...args: Parameters<Portadom<El>[]['slice']>) => PortadomArrayPromise<El>;
  /** Wrapper for {@link Array.some}. */
  some: (...args: Parameters<Portadom<El>[]['some']>) => Promise<boolean>;
  /**
   * Wrapper for {@link Array.sort} that returns the resulting array wrapped in {@link PortadomArrayPromise}.
   */
  sort: (...args: Parameters<Portadom<El>[]['sort']>) => PortadomArrayPromise<El>;
  /**
   * Wrapper for {@link Array.splice} that returns the resulting array wrapped in {@link PortadomArrayPromise}.
   */
  splice: (...args: Parameters<Portadom<El>[]['splice']>) => PortadomArrayPromise<El>;
  /**
   * Wrapper for {@link Array.unshift}.
   *
   * NOTE: The added values are expected to be {@link Portadom} instances.
   */
  unshift: (...args: Parameters<Portadom<El>[]['unshift']>) => Promise<number>;
  /** NOTE: Does NOT return an instance of PortadomArrayPromise */
  values: (
    ...args: Parameters<Portadom<El>[]['values']>
  ) => Promise<IterableIterator<Portadom<El>>>;

  ///////////////////////
  // EXTENDED ARRAY API
  ///////////////////////

  /**
   * Similar to {@link Array.forEach}, but awaits for Promises. Items are handled one-by-one.
   */
  forEachAsyncSerial: (...args: [
    callbackfn: (value: Portadom<El>, index: number) => MaybePromise<void>
  ]) => Promise<void>; // prettier-ignore

  /**
   * Similar to {@link Array.forEach}, but awaits for Promises. Items are handled all in parallel.
   */
  forEachAsyncParallel: (...args: [
    callbackfn: (value: Portadom<El>, index: number) => MaybePromise<void>
  ]) => Promise<void>; // prettier-ignore

  /**
   * Similar to {@link Array.map}, but awaits for Promises. Items are handled one-by-one.
   *
   * NOTE: Mapped values can be anything, so result is NOT wrapped in an instance of {@link PortadomArrayPromise}
   */
  mapAsyncSerial: <TVal>(...args: [
    callbackfn: (value: Portadom<El>, index: number) => MaybePromise<TVal>
  ]) => Promise<Awaited<TVal>[]>; // prettier-ignore

  /**
   * Similar to {@link Array.map}, but awaits for Promises. Items are handled all in parallel.
   *
   * NOTE: Mapped values can be anything, so result is NOT wrapped in an instance of {@link PortadomArrayPromise}
   */
  mapAsyncParallel: <TVal>(...args: [
    callbackfn: (value: Portadom<El>, index: number) => MaybePromise<TVal>
  ]) => Promise<Awaited<TVal>[]>; // prettier-ignore

  /**
   * Similar to {@link Array.filter}, but awaits for Promises. Items are handled one-by-one.
   *
   * Returns the resulting array wrapped in {@link PortadomArrayPromise}.
   */
  filterAsyncSerial: (...args: [
    predicate: (value: Portadom<El>, index: number) => MaybePromise<any>
  ]) => PortadomArrayPromise<El>; // prettier-ignore

  /**
   * Similar to {@link Array.filter}, but awaits for Promises. Items are handled all in parallel.
   *
   * Returns the resulting array wrapped in {@link PortadomArrayPromise}.
   */
  filterAsyncParallel: (...args: [
    callbackfn: (value: Portadom<El>, index: number) => MaybePromise<any>
  ]) => PortadomArrayPromise<El>; // prettier-ignore

  /**
   * Similar to {@link Array.find}, but awaits for Promises. Items are handled one-by-one.
   *
   * Returns the resulting item as {@link PortadomPromise}.
   */
  findAsyncSerial: (...args: [
    callbackfn: (value: Portadom<El>, index: number) => MaybePromise<any>
  ]) => PortadomPromise<El>; // prettier-ignore
}

/**
 * Wrapper for a {@link Promise} that resolves to an Array of {@link Portadom} instances. This allows us to chain
 * Portadom methods before the Promise is resolved.
 */
export const createPortadomArrayPromise = <El>(
  promiseDom: MaybePromise<Portadom<El>[]>
): PortadomArrayPromise<El> => {
  type T = Portadom<El>;

  const promise = Promise.resolve(promiseDom);
  return {
    promise,

    ///////////////////
    // ARRAY API
    ///////////////////

    at: (...args: Parameters<T[]['at']>) => createPortadomPromise<El>(
      promise.then((d) => d.at(...args) ?? null)
    ),
    /** NOTE: The concat values are expected to be Portadom instances */
    concat: (...args: Parameters<T[]['concat']>) => createPortadomArrayPromise<El>(
      promise.then((d) => d.concat(...args))
    ),
    copyWithin: (...args: Parameters<T[]['copyWithin']>) => createPortadomArrayPromise<El>(
      promise.then((d) => d.copyWithin(...args))
    ),
    /** NOTE: Does NOT return an instance of PortadomArrayPromise */
    entries: (...args: Parameters<T[]['entries']>) => promise.then((d) => d.entries(...args)),
    every: (...args: Parameters<T[]['every']>) => promise.then((d) => d.every(...args)),
    /** NOTE: The fill value is expected to be a Portadom instance */
    fill: <U>(...args: [value: U]) => promise.then((d) => d.fill(...(args as [any])) as U[]),
    filter: (...args: Parameters<T[]['filter']>) => createPortadomArrayPromise<El>(
      promise.then((d) => d.filter(...args))
    ),
    find: (...args: Parameters<T[]['find']>) => createPortadomPromise<El>(
      promise.then((d) => d.find(...args) ?? null)
    ),
    findIndex: (...args: Parameters<T[]['findIndex']>) => promise.then((d) => d.findIndex(...args)),
    flat: (...args: Parameters<T[]['flat']>) => createPortadomArrayPromise<El>(
      promise.then((d) => d.flat(...args))
    ),
    /** NOTE: Items are expected to be mapped to Portadom instances */
    flatMap: <U, This = undefined>(...args: [
      callback: (this: This, value: T, index: number, array: T[]) => U | readonly U[],
      thisArg?: This | undefined
    ]) => promise.then((d) => d.flatMap(...args)),
    forEach: (...args: Parameters<T[]['forEach']>) => promise.then((d) => d.forEach(...args)),
    includes: (...args: Parameters<T[]['includes']>) => promise.then((d) => d.includes(...args)),
    indexOf: (...args: Parameters<T[]['indexOf']>) => promise.then((d) => d.indexOf(...args)),
    join: (...args: Parameters<T[]['join']>) => promise.then((d) => d.join(...args)),
    keys: (...args: Parameters<T[]['keys']>) => promise.then((d) => d.keys(...args)),
    lastIndexOf: (...args: Parameters<T[]['lastIndexOf']>) => promise.then((d) => d.lastIndexOf(...args)),
    get length() {
      return promise.then((d) => d.length);
    },
    /** NOTE: Does NOT return an instance of PortadomArrayPromise */
    map: <U>(...args: [
      callbackfn: (value: Portadom<El>, index: number, array: Portadom<El>[]) => U,
      thisArg?: any
    ]) => promise.then((d) => d.map(...args)),
    pop: (...args: Parameters<T[]['pop']>) => createPortadomPromise<El>(
      promise.then((d) => d.pop(...args) ?? null)
    ),
    push: (...args: Parameters<T[]['push']>) => promise.then((d) => d.push(...args)),
    /** NOTE: Does NOT return an instance of PortadomArrayPromise */
    // NOTE: reduce has a complex type, so let the type definition handle that
    reduce: (...args: any[]) => promise.then((d) => d.reduce(...args as [any])),
    /** NOTE: Does NOT return an instance of PortadomArrayPromise */
    // NOTE: reduceRight has a complex type, so let the type definition handle that
    reduceRight: ((...args: any[]) => promise.then((d) => d.reduceRight(...args as [any]))) as any as PortadomArrayPromise<El>['reduceRight'],
    reverse: (...args: Parameters<T[]['reverse']>) => createPortadomArrayPromise<El>(
      promise.then((d) => d.reverse(...args))
    ),
    shift: (...args: Parameters<T[]['shift']>) => createPortadomPromise<El>(
      promise.then((d) => d.shift(...args) ?? null)
    ),
    slice: (...args: Parameters<T[]['slice']>) => createPortadomArrayPromise<El>(
      promise.then((d) => d.slice(...args))
    ),
    some: (...args: Parameters<T[]['some']>) => promise.then((d) => d.some(...args)),
    sort: (...args: Parameters<T[]['sort']>) => createPortadomArrayPromise<El>(
      promise.then((d) => d.sort(...args))
    ),
    splice: (...args: Parameters<T[]['splice']>) => createPortadomArrayPromise<El>(
      promise.then((d) => d.splice(...args))
    ),
    unshift: (...args: Parameters<T[]['unshift']>) => promise.then((d) => d.unshift(...args)),
    /** NOTE: Does NOT return an instance of PortadomArrayPromise */
    values: (...args: Parameters<T[]['values']>) => promise.then((d) => d.values(...args)),

    ///////////////////////
    // EXTENDED ARRAY API
    ///////////////////////

    forEachAsyncSerial: (...args: Parameters<PortadomArrayPromise<El>['forEachAsyncSerial']>) => {
      return promise.then((d) => serialAsyncForEach(d, ...args));
    }, // prettier-ignore
    forEachAsyncParallel: (...args: Parameters<PortadomArrayPromise<El>['forEachAsyncParallel']>) => {
      return promise.then((d) => parallelAsyncForEach(d, ...args));
    }, // prettier-ignore
    mapAsyncSerial: <TVal>(...args: [
      callbackfn: (value: Portadom<El>, index: number) => MaybePromise<TVal>
    ]) => {
      const [fn] = args;
      return promise.then<Awaited<TVal>[]>((d) => serialAsyncMap<Portadom<El>, Awaited<TVal>>(d, fn as any));
    }, // prettier-ignore
    mapAsyncParallel: <TVal>(...args: [
      callbackfn: (value: Portadom<El>, index: number) => MaybePromise<TVal>
    ]) => {
      const [fn] = args;
      return promise.then<Awaited<TVal>[]>((d) => parallelAsyncMap<Portadom<El>, Awaited<TVal>>(d, fn as any));
    }, // prettier-ignore
    filterAsyncSerial: (...args: Parameters<PortadomArrayPromise<El>['filterAsyncSerial']>) => {
      return createPortadomArrayPromise<El>(
        promise.then((d) => serialAsyncFilter(d, ...args))
      );
    }, // prettier-ignore
    filterAsyncParallel: (...args: Parameters<PortadomArrayPromise<El>['filterAsyncParallel']>) => {
      return createPortadomArrayPromise<El>(
        promise.then((d) => parallelAsyncFilter(d, ...args))
      );
    }, // prettier-ignore
    findAsyncSerial: (...args: Parameters<PortadomArrayPromise<El>['findAsyncSerial']>) => {
      return createPortadomPromise<El>(
        promise.then(async (d) => {
          const res = await serialAsyncFind(d, ...args) ?? null;
          return res;
        })
      );
    }, // prettier-ignore
  } as PortadomArrayPromise<El>; // prettier-ignore
};
