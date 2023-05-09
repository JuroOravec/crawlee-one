import { Actor } from 'apify';
import type { CrawlingContext } from 'crawlee';
import { get, pick, set, unset } from 'lodash';

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
  /** ID or name of the dataset to which the data should be pushed */
  datasetIdOrName?: string;
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
      : isPrivate ? privateValueGen(key, val, item) : val
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
  const { includeMetadata, showPrivate, privacyMask, remapKeys, pickKeys, datasetIdOrName } =
    options;

  const items = Array.isArray(oneOrManyItems) ? oneOrManyItems : [oneOrManyItems];

  ctx.log.debug(`Preparing entries before pushing ${items.length} items to dataset`); // prettier-ignore
  const addMetadataToData = createMetadataMapper(ctx);
  const adjustedItems = items.map((item) => {
    const itemWithMetadata = includeMetadata ? addMetadataToData(item) : item;
    const maskedItem = applyPrivacyMask(itemWithMetadata, {
      showPrivate,
      privacyMask,
      privateValueGen: (val, key) =>
        `<Redacted property "${key}". To include the actual value, toggle ON the Actor input option "Include personal data">`,
    });

    const pickedItem = pickKeys ? pick(maskedItem, pickKeys) : maskedItem;
    const renamedItem = remapKeys ? renameKeys(pickedItem, remapKeys) : pickedItem;

    return renamedItem;
  });

  ctx.log.info(`Pushing ${adjustedItems.length} entries to dataset`);
  const dataset = datasetIdOrName ? await Actor.openDataset(datasetIdOrName) : Actor;
  await dataset.pushData(adjustedItems);
  ctx.log.info(`Done pushing ${adjustedItems.length} entries to dataset`);

  return adjustedItems;
};
