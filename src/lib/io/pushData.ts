import { CrawlingContext, Log } from 'crawlee';
import { get, pick, set, unset, uniq, sortBy, isPlainObject, fromPairs } from 'lodash';

import { serialAsyncMap } from '../../utils/async';
import type { CrawleeOneIO } from '../integrations/types';
import { ApifyCrawleeOneIO, apifyIO } from '../integrations/apify';
import { datasetSizeMonitor } from './dataset';
import type { MaybePromise } from '../../utils/types';

/**
 * Functions that generates a "redacted" version of a value.
 *
 * If you pass it a Promise, it will be resolved.
 */
export type GenRedactedValue<V, K, O> = (val: V, key: K, obj: O) => MaybePromise<any>;

/**
 * Determine if the property is considered private (and hence may be hidden for privacy reasons).
 *
 * `PrivacyFilter` may be either boolean, or a function that returns truthy/falsy value.
 *
 * Property is private if `true` or if the function returns truthy value.
 *
 * The function receives the property value, its position, and parent object.
 *
 * By default, when a property is redacted, its value is replaced with a string
 * that informs about the redaction. If you want different text or value to be used instead,
 * supply it to `setCustomRedactedValue`.
 *
 * If the function returns a Promise, it will be awaited.
 */
export type PrivacyFilter<V, K, O> =
  | boolean
  | ((
      val: V,
      key: K,
      obj: O,
      options?: {
        setCustomRedactedValue: (val: V) => any;
      }
    ) => any);

/**
 * PrivacyMask determines which (potentally nested) properties
 * of an object are considered private.
 *
 * PrivacyMask copies the structure of another object, but each
 * non-object property on PrivacyMask is a PrivacyFilter - function
 * that determines if the property is considered private.
 *
 * Property is private if the function returns truthy value.
 *
 * If the function returns a Promise, it will be awaited.
 */
export type PrivacyMask<T extends object> = {
  [Key in keyof T]?: T[Key] extends Date | any[] // Consider Date and Array as non-objects
    ? PrivacyFilter<T[Key], Key, T>
    : T[Key] extends object
    ? PrivacyMask<T[Key]>
    : PrivacyFilter<T[Key], Key, T>;
};

export interface PushDataOptions<T extends object> {
  io?: CrawleeOneIO<any, any>;
  log?: Log;
  /**
   * If set, only at most this many entries will be scraped.
   *
   * The count is determined from the Dataset that's used for the crawler run.
   *
   * This means that if `maxCount` is set to 50, but the
   * associated Dataset already has 40 items in it, then only 10 new entries
   * will be saved.
   */
  maxCount?: number;
  /**
   * Whether items should be enriched with request and run metadata.
   *
   * If truthy, the metadata is set under the `metadata` property.
   */
  includeMetadata?: boolean;
  /**
   * Whether properties that are considered personal data should be shown as is.
   *
   * If falsy or not set, these properties are redacted to hide the actual information.
   *
   * Which properties are personal data is determined by `privacyMask`.
   */
  showPrivate?: boolean;
  /**
   * Determine which properties are considered personal data.
   *
   * See {@link PrivacyMask}.
   **/
  privacyMask: PrivacyMask<T>;
  /**
   * Option to select which keys (fields) of an entry to keep (discarding the rest)
   * before pushing the entries to the dataset.
   *
   * This serves mainly to allow users to select the keys from actor input UI.
   *
   * This is done before `remapKeys`.
   *
   * Keys can be nested, e.g. `"someProp.value[0]"`. Nested path is
   * resolved using Lodash.get().
   */
  pickKeys?: string[];
  /**
   * Option to remap the keys before pushing the entries to the dataset.
   *
   * This serves mainly to allow users to remap the keys from actor input UI.
   *
   * Keys can be nested, e.g. `"someProp.value[0]"`. Nested path is
   * resolved using Lodash.get().
   */
  remapKeys?: Record<string, string>;
  /**
   * Option to freely transform an entry before pushing it to the dataset.
   *
   * This serves mainly to allow users to transform the entries from actor input UI.
   */
  transform?: (item: any) => MaybePromise<any>;
  /**
   * Option to filter an entry before pushing it to the dataset.
   *
   * This serves mainly to allow users to filter the entries from actor input UI.
   */
  filter?: (item: any) => MaybePromise<unknown>;
  /** ID or name of the dataset to which the data should be pushed */
  datasetId?: string;
  /** ID of the RequestQueue that stores remaining requests */
  requestQueueId?: string;
  /** ID or name of the key-value store used as cache */
  cacheStoreId?: string;
  /** Define fields that uniquely identify entries for caching */
  cachePrimaryKeys?: string[];
  /** Define whether we want to add, remove, or overwrite cached entries with results from the actor run */
  cacheActionOnResult?: 'add' | 'remove' | 'overwrite' | null;
}

const createMetadataMapper = async <
  Ctx extends CrawlingContext,
  TIO extends CrawleeOneIO<any, any> = ApifyCrawleeOneIO
>(
  ctx: Ctx,
  options: { io: TIO }
) => {
  const { io = apifyIO } = options ?? {};

  const metadata = await io.generateEntryMetadata(ctx);
  const addMetadataToData = <T extends object>(item: T) => ({ ...item, metadata });
  return addMetadataToData;
};

const applyPrivacyMask = async <T extends Record<any, any> = Record<any, any>>(
  item: T,
  options: {
    showPrivate?: boolean;
    privacyMask: PrivacyMask<T>;
    genRedactedValue?: GenRedactedValue<any, string, T>;
  }
) => {
  const {
    showPrivate,
    privacyMask,
    genRedactedValue = (_, key) => `<Redacted property "${key}">`,
  } = options;

  const resolvePrivateValue = async (key: string, val: any) => {
    // Allow to set custom "redacted" value by calling
    // `setCustomRedactedValue` from inside the filter function.
    let customPrivateValue;
    let setCustomPrivateValueCalled = false;
    const setCustomRedactedValue = async (val: any) => {
      customPrivateValue = await val;
      setCustomPrivateValueCalled = true;
    };

    const privacyFilter = privacyMask[key] as PrivacyFilter<any, any, any> | undefined;
    const isPrivate =
      typeof privacyFilter === 'boolean'
        ? privacyFilter
        : !!privacyFilter
        ? await privacyFilter(val, key, item, { setCustomRedactedValue })
        : false;

    // prettier-ignore
    const privateValue = (
      // Don't redact anything if we're asked to show private data
      showPrivate ? val
      // Otherwise, if custom value was given, use that
      : setCustomPrivateValueCalled ? customPrivateValue
      // Otherwise, decide based on filter truthiness
      : isPrivate ? await genRedactedValue(val, key, item) : val
    );
    return privateValue;
  };

  const redactedObj = await Object.entries(item).reduce<Promise<T>>(
    async (aggPromise, [key, val]) => {
      const agg = await aggPromise;
      const isNestedObj =
        typeof val === 'object' && val != null && !(val instanceof Date) && !Array.isArray(val);

      if (isNestedObj) {
        // Recursively process nested objects
        const subObj = await applyPrivacyMask(val, {
          showPrivate,
          privacyMask: (privacyMask[key] ?? {}) as any,
          genRedactedValue,
        });
        agg[key as keyof T] = subObj as any;
      } else {
        agg[key as keyof T] = await resolvePrivateValue(key, val);
      }
      return agg;
    },
    Promise.resolve({} as T)
  );

  return redactedObj;
};

/** Rename object properties in place */
const renameKeys = <T extends object>(item: T, keyNameMap: Record<string, string>) => {
  Object.entries(keyNameMap || {}).forEach(([oldPath, newPath]) => {
    if (oldPath === newPath) return;
    const val = get(item, oldPath);
    set(item, newPath as string, val);
    unset(item, oldPath);
  });
  return item;
};

const sortObjectKeys = <T extends object>(obj: T) =>
  fromPairs(sortBy(Object.keys(obj)).map((key) => [key, obj[key]]));

/**
 * Serialize dataset item to fixed-length hash.
 *
 * NOTE: Apify (around which this lib is designed) allows the key-value store key
 *       to be max 256 char long.
 *       https://docs.apify.com/sdk/js/reference/class/KeyValueStore#setValue
 */
export const itemCacheKey = (item: any, primaryKeys?: string[]) => {
  const thePrimaryKeys = primaryKeys
    ? sortBy(uniq(primaryKeys.map((s) => s?.trim()).filter(Boolean)))
    : null;

  const serializedItem = thePrimaryKeys
    ? thePrimaryKeys.map((k) => item?.[k]).join(':')
    : item && isPlainObject(item)
    ? JSON.stringify(sortObjectKeys(item)) // If possible sort the object's keys
    : JSON.stringify(item);

  const cacheId = cyrb53(serializedItem);
  return cacheId.toString();
};

/**
 * Hashing function used when calculating cache ID hash from entries.
 *
 * See https://stackoverflow.com/a/52171480/9788634.
 */
const cyrb53 = (str, seed = 0) => {
  let h1 = 0xdeadbeef ^ seed,
    h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

const shortenToSize = async <T>(
  entries: T[],
  maxCount: number,
  options?: { io?: CrawleeOneIO; datasetId?: string; requestQueueId?: string; log: Log }
) => {
  const { io, datasetId, requestQueueId, log } = options ?? {};
  const datasetName = datasetId ? `"${datasetId}"` : 'DEFAULT';

  const sizeMonitor = datasetSizeMonitor(maxCount, { datasetId, requestQueueId, io });

  // Ignore incoming entries if the dataset is already full
  const isDatasetFull = await sizeMonitor.isFull();
  if (isDatasetFull) {
    log?.warning(`Dataset (${datasetName}) is already full (${maxCount} entries), ${entries.length} entries will be discarded.`);
    return [];
  } // prettier-ignore

  // Show warning when only part of the incoming data made it into the dataset
  const slicedEntries = await sizeMonitor.shortenToSize(entries);
  if (slicedEntries.length !== entries.length) {
    log?.warning(`Dataset (${datasetName}) has become full (${maxCount} entries), ${entries.length} entries will be discarded.`);
    return [];
  } // prettier-ignore

  return slicedEntries;
};

/**
 * Apify's `Actor.pushData` with extra features:
 *
 * - Data can be sent elsewhere, not just to Apify. This is set by the `io` options. By default data is sent using Apify (cloud/local).
 * - Limit the max size of the Dataset. No entries are added when Dataset is at or above the limit.
 * - Redact "private" fields
 * - Add metadata to entries before they are pushed to dataset.
 * - Select and rename (nested) properties
 * - Transform and filter entries. Entries that did not pass the filter are not added to the dataset.
 * - Add/remove entries to/from KeyValueStore. Entries are saved to the store by hash generated from entry fields set by `cachePrimaryKeys`.
 */
export const pushData = async <
  Ctx extends CrawlingContext,
  T extends Record<any, any> = Record<any, any>
>(
  ctx: Ctx,
  oneOrManyItems: T | T[],
  options: PushDataOptions<T>
) => {
  const {
    io = apifyIO as CrawleeOneIO,
    log = new Log(),
    maxCount,
    includeMetadata,
    showPrivate,
    privacyMask,
    remapKeys,
    pickKeys,
    transform,
    filter,
    datasetId,
    requestQueueId,
    cacheStoreId,
    cachePrimaryKeys,
    cacheActionOnResult,
  } = options;

  const manyItems = Array.isArray(oneOrManyItems) ? oneOrManyItems : [oneOrManyItems];
  const items =
    maxCount != null
      ? await shortenToSize(manyItems, maxCount, { io, datasetId, requestQueueId, log })
      : manyItems;

  log.debug(`Preparing to push ${items.length} entries to dataset`); // prettier-ignore
  const addMetadataToData = await createMetadataMapper(ctx, { io });

  const adjustedItems = await items.reduce(async (aggPromise, item) => {
    const agg = await aggPromise;

    const itemWithMetadata = includeMetadata ? addMetadataToData(item) : item;
    const maskedItem = await applyPrivacyMask(itemWithMetadata, {
      showPrivate,
      privacyMask,
      genRedactedValue: (val, key) =>
        `<Redacted property "${key}". To include the actual value, toggle ON the input option "Include personal data">`,
    });

    const renamedItem = remapKeys ? renameKeys(maskedItem, remapKeys) : maskedItem;
    const pickedItem = pickKeys ? pick(renamedItem, pickKeys) : renamedItem;
    const transformedItem = transform ? await transform(pickedItem) : pickedItem;
    const passedFilter = filter ? await filter(transformedItem) : true;

    if (passedFilter) agg.push(transformedItem);

    return agg;
  }, Promise.resolve([] as unknown[]));

  // Push entries to primary dataset
  log.info(`Pushing ${adjustedItems.length} entries to dataset`);
  const dataset = await io.openDataset(datasetId);
  await dataset.pushData(adjustedItems);
  log.info(`Done pushing ${adjustedItems.length} entries to dataset`);

  // Update entries in cache
  if (cacheStoreId && cacheActionOnResult) {
    log.info(`Update ${adjustedItems.length} entries in cache`);
    const store = await io.openKeyValueStore(cacheStoreId);
    await serialAsyncMap(adjustedItems, async (item: any) => {
      const cacheId = itemCacheKey(item, cachePrimaryKeys);

      if (['add', 'overwrite'].includes(cacheActionOnResult)) {
        await store.setValue(cacheId, item);
      } else if (cacheActionOnResult === 'remove') {
        await store.setValue(cacheId, null);
      }
    });
    log.info(`Done updating ${adjustedItems.length} entries in cache`);
  }

  return adjustedItems;
};
