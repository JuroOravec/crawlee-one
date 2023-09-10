[crawlee-one](../README.md) / [Exports](../modules.md) / ListingPageScraperOptions

# Interface: ListingPageScraperOptions<Ctx, UrlType\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `Ctx` | extends `object` |
| `UrlType` | `UrlType` |

## Hierarchy

- `Omit`<[`ListingFiltersSetupOptions`](ListingFiltersSetupOptions.md)<`Ctx`, `UrlType`\>, ``"context"``\>

  ↳ **`ListingPageScraperOptions`**

## Table of contents

### Properties

- [context](ListingPageScraperOptions.md#context)
- [extractEntries](ListingPageScraperOptions.md#extractentries)
- [extractEntriesRetries](ListingPageScraperOptions.md#extractentriesretries)
- [filters](ListingPageScraperOptions.md#filters)
- [listingCountOnly](ListingPageScraperOptions.md#listingcountonly)
- [loadFiltersRetries](ListingPageScraperOptions.md#loadfiltersretries)
- [log](ListingPageScraperOptions.md#log)
- [nextPageWait](ListingPageScraperOptions.md#nextpagewait)
- [onAfterNavigation](ListingPageScraperOptions.md#onafternavigation)
- [onExtractEntriesDone](ListingPageScraperOptions.md#onextractentriesdone)
- [onExtractEntriesError](ListingPageScraperOptions.md#onextractentrieserror)
- [onFiltersLoaded](ListingPageScraperOptions.md#onfiltersloaded)
- [onGoToNextPage](ListingPageScraperOptions.md#ongotonextpage)
- [onLoadFiltersError](ListingPageScraperOptions.md#onloadfilterserror)
- [onNavigate](ListingPageScraperOptions.md#onnavigate)
- [onResetFilters](ListingPageScraperOptions.md#onresetfilters)
- [pageId](ListingPageScraperOptions.md#pageid)
- [shouldApplyFilter](ListingPageScraperOptions.md#shouldapplyfilter)
- [startUrls](ListingPageScraperOptions.md#starturls)

## Properties

### context

• **context**: `Ctx`

#### Defined in

[src/lib/actions/scrapeListing.ts:55](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/actions/scrapeListing.ts#L55)

___

### extractEntries

• **extractEntries**: (`context`: [`ListingPageScraperContext`](ListingPageScraperContext.md)<`Ctx`, `UrlType`\>, `retryIndex`: `number`) => [`MaybePromise`](../modules.md#maybepromise)<`UrlType`[]\>

#### Type declaration

▸ (`context`, `retryIndex`): [`MaybePromise`](../modules.md#maybepromise)<`UrlType`[]\>

Main logic to extract entries from a page

##### Parameters

| Name | Type |
| :------ | :------ |
| `context` | [`ListingPageScraperContext`](ListingPageScraperContext.md)<`Ctx`, `UrlType`\> |
| `retryIndex` | `number` |

##### Returns

[`MaybePromise`](../modules.md#maybepromise)<`UrlType`[]\>

#### Defined in

[src/lib/actions/scrapeListing.ts:84](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/actions/scrapeListing.ts#L84)

___

### extractEntriesRetries

• `Optional` **extractEntriesRetries**: `number`

How many attempts are retried after failed to scrape entries from a listing. Defaults to 3

#### Defined in

[src/lib/actions/scrapeListing.ts:86](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/actions/scrapeListing.ts#L86)

___

### filters

• `Optional` **filters**: [`ListingPageFilter`](ListingPageFilter.md)[]

#### Inherited from

Omit.filters

#### Defined in

[src/lib/actions/scrapeListing.ts:29](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/actions/scrapeListing.ts#L29)

___

### listingCountOnly

• `Optional` **listingCountOnly**: `boolean`

#### Defined in

[src/lib/actions/scrapeListing.ts:57](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/actions/scrapeListing.ts#L57)

___

### loadFiltersRetries

• `Optional` **loadFiltersRetries**: `number`

How many attempts are retried after filters failed to load. Defaults to 3

#### Defined in

[src/lib/actions/scrapeListing.ts:71](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/actions/scrapeListing.ts#L71)

___

### log

• **log**: [`ListingLogger`](ListingLogger.md)

#### Overrides

Omit.log

#### Defined in

[src/lib/actions/scrapeListing.ts:60](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/actions/scrapeListing.ts#L60)

___

### nextPageWait

• `Optional` **nextPageWait**: `number`

How long to wait after we've navigated to the next page and before we start extracting?

#### Defined in

[src/lib/actions/scrapeListing.ts:111](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/actions/scrapeListing.ts#L111)

___

### onAfterNavigation

• `Optional` **onAfterNavigation**: (`context`: [`ListingPageScraperContext`](ListingPageScraperContext.md)<`Ctx`, `UrlType`\>) => [`MaybePromise`](../modules.md#maybepromise)<`void`\>

#### Type declaration

▸ (`context`): [`MaybePromise`](../modules.md#maybepromise)<`void`\>

Hook triggered after navigating to the url using Page.goto().

One use of this hook is to conditionally disable/enable filters based on the page content.

##### Parameters

| Name | Type |
| :------ | :------ |
| `context` | [`ListingPageScraperContext`](ListingPageScraperContext.md)<`Ctx`, `UrlType`\> |

##### Returns

[`MaybePromise`](../modules.md#maybepromise)<`void`\>

#### Defined in

[src/lib/actions/scrapeListing.ts:68](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/actions/scrapeListing.ts#L68)

___

### onExtractEntriesDone

• `Optional` **onExtractEntriesDone**: (`context`: [`ListingPageScraperContext`](ListingPageScraperContext.md)<`Ctx`, `UrlType`\>, `entries`: ``null`` \| `UrlType`[]) => [`MaybePromise`](../modules.md#maybepromise)<`void`\>

#### Type declaration

▸ (`context`, `entries`): [`MaybePromise`](../modules.md#maybepromise)<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `context` | [`ListingPageScraperContext`](ListingPageScraperContext.md)<`Ctx`, `UrlType`\> |
| `entries` | ``null`` \| `UrlType`[] |

##### Returns

[`MaybePromise`](../modules.md#maybepromise)<`void`\>

#### Defined in

[src/lib/actions/scrapeListing.ts:97](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/actions/scrapeListing.ts#L97)

___

### onExtractEntriesError

• `Optional` **onExtractEntriesError**: (`context`: [`ListingPageScraperContext`](ListingPageScraperContext.md)<`Ctx`, `UrlType`\>, `error`: `any`, `retryIndex`: `number`) => [`MaybePromise`](../modules.md#maybepromise)<`void`\>

#### Type declaration

▸ (`context`, `error`, `retryIndex`): [`MaybePromise`](../modules.md#maybepromise)<`void`\>

Hook triggered after a failed attempt at scraping entries from a listing.

One use of this hook is to reload the page on failed attemp in case something didn't load correctly.

##### Parameters

| Name | Type |
| :------ | :------ |
| `context` | [`ListingPageScraperContext`](ListingPageScraperContext.md)<`Ctx`, `UrlType`\> |
| `error` | `any` |
| `retryIndex` | `number` |

##### Returns

[`MaybePromise`](../modules.md#maybepromise)<`void`\>

#### Defined in

[src/lib/actions/scrapeListing.ts:92](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/actions/scrapeListing.ts#L92)

___

### onFiltersLoaded

• `Optional` **onFiltersLoaded**: (`context`: [`ListingPageScraperContext`](ListingPageScraperContext.md)<`Ctx`, `UrlType`\>) => [`MaybePromise`](../modules.md#maybepromise)<`void`\>

#### Type declaration

▸ (`context`): [`MaybePromise`](../modules.md#maybepromise)<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `context` | [`ListingPageScraperContext`](ListingPageScraperContext.md)<`Ctx`, `UrlType`\> |

##### Returns

[`MaybePromise`](../modules.md#maybepromise)<`void`\>

#### Inherited from

Omit.onFiltersLoaded

#### Defined in

[src/lib/actions/scrapeListing.ts:36](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/actions/scrapeListing.ts#L36)

___

### onGoToNextPage

• `Optional` **onGoToNextPage**: (`context`: [`ListingPageScraperContext`](ListingPageScraperContext.md)<`Ctx`, `UrlType`\>, `entries`: ``null`` \| `UrlType`[]) => [`MaybePromise`](../modules.md#maybepromise)<`void`\>

#### Type declaration

▸ (`context`, `entries`): [`MaybePromise`](../modules.md#maybepromise)<`void`\>

If goToNextPage hook is defined, it will be called after each page. To indicate that there's no more
pages left, throw an error.

##### Parameters

| Name | Type |
| :------ | :------ |
| `context` | [`ListingPageScraperContext`](ListingPageScraperContext.md)<`Ctx`, `UrlType`\> |
| `entries` | ``null`` \| `UrlType`[] |

##### Returns

[`MaybePromise`](../modules.md#maybepromise)<`void`\>

#### Defined in

[src/lib/actions/scrapeListing.ts:106](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/actions/scrapeListing.ts#L106)

___

### onLoadFiltersError

• `Optional` **onLoadFiltersError**: (`context`: [`ListingPageScraperContext`](ListingPageScraperContext.md)<`Ctx`, `UrlType`\>, `error`: `any`, `retryIndex`: `number`) => [`MaybePromise`](../modules.md#maybepromise)<`void`\>

#### Type declaration

▸ (`context`, `error`, `retryIndex`): [`MaybePromise`](../modules.md#maybepromise)<`void`\>

Hook triggered after a failed attempt at loading listings page filters.

One use of this hook is to reload the page on failed attemp in case something didn't load correctly.

##### Parameters

| Name | Type |
| :------ | :------ |
| `context` | [`ListingPageScraperContext`](ListingPageScraperContext.md)<`Ctx`, `UrlType`\> |
| `error` | `any` |
| `retryIndex` | `number` |

##### Returns

[`MaybePromise`](../modules.md#maybepromise)<`void`\>

#### Defined in

[src/lib/actions/scrapeListing.ts:77](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/actions/scrapeListing.ts#L77)

___

### onNavigate

• `Optional` **onNavigate**: (`context`: [`ListingPageScraperContext`](ListingPageScraperContext.md)<`Ctx`, `UrlType`\>, `url`: `UrlType`) => [`MaybePromise`](../modules.md#maybepromise)<`void`\>

#### Type declaration

▸ (`context`, `url`): [`MaybePromise`](../modules.md#maybepromise)<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `context` | [`ListingPageScraperContext`](ListingPageScraperContext.md)<`Ctx`, `UrlType`\> |
| `url` | `UrlType` |

##### Returns

[`MaybePromise`](../modules.md#maybepromise)<`void`\>

#### Defined in

[src/lib/actions/scrapeListing.ts:62](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/actions/scrapeListing.ts#L62)

___

### onResetFilters

• `Optional` **onResetFilters**: (`context`: [`ListingPageScraperContext`](ListingPageScraperContext.md)<`Ctx`, `UrlType`\>) => [`MaybePromise`](../modules.md#maybepromise)<`void`\>

#### Type declaration

▸ (`context`): [`MaybePromise`](../modules.md#maybepromise)<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `context` | [`ListingPageScraperContext`](ListingPageScraperContext.md)<`Ctx`, `UrlType`\> |

##### Returns

[`MaybePromise`](../modules.md#maybepromise)<`void`\>

#### Inherited from

Omit.onResetFilters

#### Defined in

[src/lib/actions/scrapeListing.ts:35](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/actions/scrapeListing.ts#L35)

___

### pageId

• `Optional` **pageId**: (`context`: [`ListingPageScraperContext`](ListingPageScraperContext.md)<`Ctx`, `UrlType`\>) => [`MaybePromise`](../modules.md#maybepromise)<`string`\>

#### Type declaration

▸ (`context`): [`MaybePromise`](../modules.md#maybepromise)<`string`\>

Get ID of the current page in the pagination, so it can be logged

##### Parameters

| Name | Type |
| :------ | :------ |
| `context` | [`ListingPageScraperContext`](ListingPageScraperContext.md)<`Ctx`, `UrlType`\> |

##### Returns

[`MaybePromise`](../modules.md#maybepromise)<`string`\>

#### Defined in

[src/lib/actions/scrapeListing.ts:59](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/actions/scrapeListing.ts#L59)

___

### shouldApplyFilter

• `Optional` **shouldApplyFilter**: (`context`: [`ListingPageScraperContext`](ListingPageScraperContext.md)<`Ctx`, `UrlType`\>, `filter`: [`ListingPageFilter`](ListingPageFilter.md), `filters`: [`ListingPageFilter`](ListingPageFilter.md)[]) => [`MaybePromise`](../modules.md#maybepromise)<`boolean`\>

#### Type declaration

▸ (`context`, `filter`, `filters`): [`MaybePromise`](../modules.md#maybepromise)<`boolean`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `context` | [`ListingPageScraperContext`](ListingPageScraperContext.md)<`Ctx`, `UrlType`\> |
| `filter` | [`ListingPageFilter`](ListingPageFilter.md) |
| `filters` | [`ListingPageFilter`](ListingPageFilter.md)[] |

##### Returns

[`MaybePromise`](../modules.md#maybepromise)<`boolean`\>

#### Inherited from

Omit.shouldApplyFilter

#### Defined in

[src/lib/actions/scrapeListing.ts:30](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/actions/scrapeListing.ts#L30)

___

### startUrls

• **startUrls**: `UrlType`[]

#### Defined in

[src/lib/actions/scrapeListing.ts:56](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/actions/scrapeListing.ts#L56)
