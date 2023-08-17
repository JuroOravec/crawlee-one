import { Actor } from 'apify';
import type { CrawlingContext, Log } from 'crawlee';
import { get, pick, set, unset, uniq, sortBy, isPlainObject, fromPairs } from 'lodash';

import { serialAsyncMap } from '../../utils/async';
import { datasetSizeMonitor } from './dataset';

export interface ActorEntryMetadata {
  actorId: string | null;
  actorRunId: string | null;
  actorRunUrl: string | null;
  contextId: string;
  requestId: string | null;

  /** The URL given to the crawler */
  originalUrl: string | null;
  /** The URL given to the crawler after possible redirects */
  loadedUrl: string | null;

  /** ISO datetime string that indicates the time when the request has been processed. */
  dateHandled: string;
  numberOfRetries: number;
}

/** Add metadata to the object */
export type WithActorEntryMetadata<T> = T & { metadata: ActorEntryMetadata };

/** Functions that generates a "redacted" version of a value */
export type PrivateValueGen<V, K, O> = (val: V, key: K, obj: O) => any;

/**
 * Given a property value (and its position) this function
 * determines if the property is considered private (and
 * hence should be hidden for privacy reasons).
 *
 * Property is private if the function returns truthy value.
 */
export type PrivacyFilter<V, K, O> = (
  val: V,
  key: K,
  obj: O,
  options?: {
    setCustomPrivateValue: (val: V) => any;
    privateValueGen: PrivateValueGen<V, K, O>;
  }
) => any;

/**
 * PrivacyMask determines which (potentally nested) properties
 * of an object are considered private.
 *
 * PrivacyMask copies the structure of another object, but each
 * non-object property on PrivacyMask is a PrivacyFilter - function
 * that determines if the property is considered private.
 *
 * Property is private if the function returns truthy value.
 */
export type PrivacyMask<T extends object> = {
  [Key in keyof T]?: T[Key] extends Date | any[] // Consider Data and Array as non-objects
    ? PrivacyFilter<T[Key], Key, T>
    : T[Key] extends object
    ? PrivacyMask<T[Key]>
    : PrivacyFilter<T[Key], Key, T>;
};

export interface PushDataOptions<T extends object> {
  /**
   * If set, only at most this many entries will be scraped.
   *
   * The count is determined from the Apify Dataset that's used for the Actor run.
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
  transform?: (item: any) => any;
  /**
   * Option to filter an entry before pushing it to the dataset.
   *
   * This serves mainly to allow users to filter the entries from actor input UI.
   */
  filter?: (item: any) => any;
  /** ID or name of the dataset to which the data should be pushed */
  datasetIdOrName?: string;
  /** ID or name of the key-value store used as cache */
  cacheStoreIdOrName?: string;
  /** Define fields that uniquely identify entries for caching */
  cachePrimaryKeys?: string[];
  /** Define whether we want to add, remove, or overwrite cached entries with results from the actor run */
  cacheActionOnResult?: 'add' | 'remove' | 'overwrite' | null;
}

const createMetadataMapper = <Ctx extends CrawlingContext>(ctx: Ctx) => {
  const { actorId, actorRunId } = Actor.getEnv();
  const actorRunUrl =
    actorId != null && actorRunId != null
      ? `https://console.apify.com/actors/${actorId}/runs/${actorRunId}`
      : null;
  const handledAt = new Date().toISOString();

  const addMetadataToData = <T extends Record<any, any> = Record<any, any>>(
    item
  ): WithActorEntryMetadata<T> => ({
    ...item,
    metadata: {
      actorId,
      actorRunId,
      actorRunUrl,
      contextId: ctx.id,
      requestId: ctx.request.id ?? null,

      originalUrl: ctx.request.url ?? null,
      loadedUrl: ctx.request.loadedUrl ?? null,

      dateHandled: ctx.request.handledAt || handledAt,
      numberOfRetries: ctx.request.retryCount,
    },
  });
  return addMetadataToData;
};

const applyPrivacyMask = <T extends Record<any, any> = Record<any, any>>(
  item: T,
  options: {
    showPrivate?: boolean;
    privacyMask: PrivacyMask<T>;
    privateValueGen?: (val: any, key: string, item: T) => any;
  }
) => {
  const {
    showPrivate,
    privacyMask,
    privateValueGen = (_, key) => `<Redacted property "${key}">`,
  } = options;

  const resolvePrivateValue = (key: string, val: any) => {
    // Allow to set custom "redacted" value by calling
    // `setCustomPrivateValue` from inside the filter function.
    let customPrivateValue;
    let setCustomPrivateValueCalled = false;
    const setCustomPrivateValue = (val: any) => {
      customPrivateValue = val;
      setCustomPrivateValueCalled = true;
    };

    const privacyFilter = privacyMask[key] as PrivacyFilter<any, any, any> | undefined;
    const isPrivate = privacyFilter
      ? privacyFilter(val, key, item, { setCustomPrivateValue, privateValueGen })
      : false;

    // prettier-ignore
    const privateValue = (
      // Don't redact anything if we're asked to show private data
      showPrivate ? val
      // Otherwise, if custom value was given, use that
      : setCustomPrivateValueCalled ? customPrivateValue
      // Otherwise, decide based on filter truthiness
      : isPrivate ? privateValueGen(val, key, item) : val
    );
    return privateValue;
  };

  const redactedObj = Object.entries(item).reduce((agg, [key, val]) => {
    const isNestedObj =
      typeof val === 'object' && val != null && !(val instanceof Date) && !Array.isArray(val);

    if (isNestedObj) {
      // Recursively process nested objects
      const subObj = applyPrivacyMask(val, {
        showPrivate,
        privacyMask: (privacyMask[key] ?? {}) as any,
        privateValueGen,
      });
      agg[key as keyof T] = subObj as any;
    } else {
      agg[key as keyof T] = resolvePrivateValue(key, val);
    }
    return agg;
  }, {} as T);

  return redactedObj;
};

/** Rename object properties in place */
const renameKeys = <T extends object>(item: T, keyNameMap: Partial<Record<keyof T, string>>) => {
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
 * NOTE: Apify allows the key-value store key to be max 256 char long.
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
  options?: { datasetIdOrName?: string; log: Log }
) => {
  const datasetIdOrName = options?.datasetIdOrName;
  const datasetName = datasetIdOrName ? `"${datasetIdOrName}"` : 'DEFAULT';

  const sizeMonitor = datasetSizeMonitor(maxCount, { datasetId: datasetIdOrName });

  // Ignore incoming entries if the dataset is already full
  const isDatasetFull = await sizeMonitor.isFull();
  if (isDatasetFull) {
    options?.log?.warning(`Dataset (${datasetName}) is already full (${maxCount} entries), ${entries.length} entries will be discarded.`);
    return [];
  } // prettier-ignore

  // Show warning when only part of the incoming data made it into the dataset
  const slicedEntries = sizeMonitor ? await sizeMonitor.shortenToSize(entries) : entries;
  if (slicedEntries.length !== entries.length) {
    options?.log?.warning(`Dataset (${datasetName}) has become full (${maxCount} entries), ${entries.length} entries will be discarded.`);
    return [];
  } // prettier-ignore

  return slicedEntries;
};

/**
 * `Actor.pushData` with extra features:
 *
 * - (Optionally) Add metadata to entries before they are pushed to dataset.
 * - (Optionally) Set which (nested) properties are personal data and allow to
 * redact them for privacy compliance.
 */
export const pushData = async <
  Ctx extends CrawlingContext,
  T extends Record<any, any> = Record<any, any>
>(
  oneOrManyItems: T | T[],
  ctx: Ctx,
  options: PushDataOptions<T>
) => {
  const {
    maxCount,
    includeMetadata,
    showPrivate,
    privacyMask,
    remapKeys,
    pickKeys,
    transform,
    filter,
    datasetIdOrName,
    cacheStoreIdOrName,
    cachePrimaryKeys,
    cacheActionOnResult,
  } = options;

  const manyItems = Array.isArray(oneOrManyItems) ? oneOrManyItems : [oneOrManyItems];
  const items =
    maxCount != null
      ? await shortenToSize(manyItems, maxCount, { datasetIdOrName, log: ctx.log })
      : manyItems;

  ctx.log.debug(`Preparing entries before pushing ${items.length} items to dataset`); // prettier-ignore
  const addMetadataToData = createMetadataMapper(ctx);

  const adjustedItems = await items.reduce(async (aggPromise, item) => {
    const agg = await aggPromise;

    const itemWithMetadata = includeMetadata ? addMetadataToData(item) : item;
    const maskedItem = applyPrivacyMask(itemWithMetadata, {
      showPrivate,
      privacyMask,
      privateValueGen: (val, key) =>
        `<Redacted property "${key}". To include the actual value, toggle ON the Actor input option "Include personal data">`,
    });

    const pickedItem = pickKeys ? pick(maskedItem, pickKeys) : maskedItem;
    const renamedItem = remapKeys ? renameKeys(pickedItem, remapKeys) : pickedItem;
    const transformedItem = transform ? await transform(renamedItem) : renamedItem;
    const passedFilter = filter ? await filter(transformedItem) : true;

    if (passedFilter) agg.push(transformedItem);

    return agg;
  }, Promise.resolve([] as unknown[]));

  // Push entries to primary dataset
  ctx.log.info(`Pushing ${adjustedItems.length} entries to dataset`);
  const dataset = datasetIdOrName ? await Actor.openDataset(datasetIdOrName) : Actor;
  await dataset.pushData(adjustedItems);
  ctx.log.info(`Done pushing ${adjustedItems.length} entries to dataset`);

  // Update entries in cache
  if (cacheStoreIdOrName && cacheActionOnResult) {
    ctx.log.info(`Update ${adjustedItems.length} entries in cache`);
    const store = await Actor.openKeyValueStore(cacheStoreIdOrName);
    await serialAsyncMap(adjustedItems, async (item: any) => {
      const cacheId = itemCacheKey(item, cachePrimaryKeys);

      if (['add', 'overwrite'].includes(cacheActionOnResult)) {
        await store.setValue(cacheId, item);
      } else if (cacheActionOnResult === 'remove') {
        await store.setValue(cacheId, null);
      }
    });
    ctx.log.info(`Done updating ${adjustedItems.length} entries in cache`);
  }

  return adjustedItems;
};
