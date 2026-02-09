[**crawlee-one**](../README.md)

***

[crawlee-one](../globals.md) / ListingPageScraperOptions

# Interface: ListingPageScraperOptions\<Ctx, UrlType\>

Defined in: [src/lib/actions/scrapeListing.ts:54](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/actions/scrapeListing.ts#L54)

## Extends

- `Omit`\<[`ListingFiltersSetupOptions`](ListingFiltersSetupOptions.md)\<`Ctx`, `UrlType`\>, `"context"`\>

## Type Parameters

### Ctx

`Ctx` *extends* `object`

### UrlType

`UrlType`

## Properties

### context

> **context**: `Ctx`

Defined in: [src/lib/actions/scrapeListing.ts:55](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/actions/scrapeListing.ts#L55)

***

### extractEntries()

> **extractEntries**: (`context`, `retryIndex`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`UrlType`[]\>

Defined in: [src/lib/actions/scrapeListing.ts:84](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/actions/scrapeListing.ts#L84)

Main logic to extract entries from a page

#### Parameters

##### context

[`ListingPageScraperContext`](ListingPageScraperContext.md)\<`Ctx`, `UrlType`\>

##### retryIndex

`number`

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`UrlType`[]\>

***

### extractEntriesRetries?

> `optional` **extractEntriesRetries**: `number`

Defined in: [src/lib/actions/scrapeListing.ts:86](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/actions/scrapeListing.ts#L86)

How many attempts are retried after failed to scrape entries from a listing. Defaults to 3

***

### filters?

> `optional` **filters**: [`ListingPageFilter`](ListingPageFilter.md)[]

Defined in: [src/lib/actions/scrapeListing.ts:29](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/actions/scrapeListing.ts#L29)

#### Inherited from

`Omit.filters`

***

### listingCountOnly?

> `optional` **listingCountOnly**: `boolean`

Defined in: [src/lib/actions/scrapeListing.ts:57](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/actions/scrapeListing.ts#L57)

***

### loadFiltersRetries?

> `optional` **loadFiltersRetries**: `number`

Defined in: [src/lib/actions/scrapeListing.ts:71](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/actions/scrapeListing.ts#L71)

How many attempts are retried after filters failed to load. Defaults to 3

***

### log

> **log**: [`ListingLogger`](ListingLogger.md)

Defined in: [src/lib/actions/scrapeListing.ts:60](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/actions/scrapeListing.ts#L60)

#### Overrides

`Omit.log`

***

### nextPageWait?

> `optional` **nextPageWait**: `number`

Defined in: [src/lib/actions/scrapeListing.ts:111](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/actions/scrapeListing.ts#L111)

How long to wait after we've navigated to the next page and before we start extracting?

***

### onAfterNavigation()?

> `optional` **onAfterNavigation**: (`context`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

Defined in: [src/lib/actions/scrapeListing.ts:68](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/actions/scrapeListing.ts#L68)

Hook triggered after navigating to the url using Page.goto().

One use of this hook is to conditionally disable/enable filters based on the page content.

#### Parameters

##### context

[`ListingPageScraperContext`](ListingPageScraperContext.md)\<`Ctx`, `UrlType`\>

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

***

### onExtractEntriesDone()?

> `optional` **onExtractEntriesDone**: (`context`, `entries`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

Defined in: [src/lib/actions/scrapeListing.ts:97](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/actions/scrapeListing.ts#L97)

#### Parameters

##### context

[`ListingPageScraperContext`](ListingPageScraperContext.md)\<`Ctx`, `UrlType`\>

##### entries

`UrlType`[] | `null`

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

***

### onExtractEntriesError()?

> `optional` **onExtractEntriesError**: (`context`, `error`, `retryIndex`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

Defined in: [src/lib/actions/scrapeListing.ts:92](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/actions/scrapeListing.ts#L92)

Hook triggered after a failed attempt at scraping entries from a listing.

One use of this hook is to reload the page on failed attemp in case something didn't load correctly.

#### Parameters

##### context

[`ListingPageScraperContext`](ListingPageScraperContext.md)\<`Ctx`, `UrlType`\>

##### error

`any`

##### retryIndex

`number`

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

***

### onFiltersLoaded()?

> `optional` **onFiltersLoaded**: (`context`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

Defined in: [src/lib/actions/scrapeListing.ts:36](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/actions/scrapeListing.ts#L36)

#### Parameters

##### context

[`ListingPageScraperContext`](ListingPageScraperContext.md)\<`Ctx`, `UrlType`\>

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

#### Inherited from

`Omit.onFiltersLoaded`

***

### onGoToNextPage()?

> `optional` **onGoToNextPage**: (`context`, `entries`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

Defined in: [src/lib/actions/scrapeListing.ts:106](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/actions/scrapeListing.ts#L106)

If goToNextPage hook is defined, it will be called after each page. To indicate that there's no more
pages left, throw an error.

#### Parameters

##### context

[`ListingPageScraperContext`](ListingPageScraperContext.md)\<`Ctx`, `UrlType`\>

##### entries

`UrlType`[] | `null`

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

***

### onLoadFiltersError()?

> `optional` **onLoadFiltersError**: (`context`, `error`, `retryIndex`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

Defined in: [src/lib/actions/scrapeListing.ts:77](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/actions/scrapeListing.ts#L77)

Hook triggered after a failed attempt at loading listings page filters.

One use of this hook is to reload the page on failed attemp in case something didn't load correctly.

#### Parameters

##### context

[`ListingPageScraperContext`](ListingPageScraperContext.md)\<`Ctx`, `UrlType`\>

##### error

`any`

##### retryIndex

`number`

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

***

### onNavigate()?

> `optional` **onNavigate**: (`context`, `url`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

Defined in: [src/lib/actions/scrapeListing.ts:62](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/actions/scrapeListing.ts#L62)

#### Parameters

##### context

[`ListingPageScraperContext`](ListingPageScraperContext.md)\<`Ctx`, `UrlType`\>

##### url

`UrlType`

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

***

### onResetFilters()?

> `optional` **onResetFilters**: (`context`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

Defined in: [src/lib/actions/scrapeListing.ts:35](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/actions/scrapeListing.ts#L35)

#### Parameters

##### context

[`ListingPageScraperContext`](ListingPageScraperContext.md)\<`Ctx`, `UrlType`\>

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

#### Inherited from

`Omit.onResetFilters`

***

### pageId()?

> `optional` **pageId**: (`context`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`string`\>

Defined in: [src/lib/actions/scrapeListing.ts:59](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/actions/scrapeListing.ts#L59)

Get ID of the current page in the pagination, so it can be logged

#### Parameters

##### context

[`ListingPageScraperContext`](ListingPageScraperContext.md)\<`Ctx`, `UrlType`\>

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`string`\>

***

### shouldApplyFilter()?

> `optional` **shouldApplyFilter**: (`context`, `filter`, `filters`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`boolean`\>

Defined in: [src/lib/actions/scrapeListing.ts:30](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/actions/scrapeListing.ts#L30)

#### Parameters

##### context

[`ListingPageScraperContext`](ListingPageScraperContext.md)\<`Ctx`, `UrlType`\>

##### filter

[`ListingPageFilter`](ListingPageFilter.md)

##### filters

[`ListingPageFilter`](ListingPageFilter.md)[]

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`boolean`\>

#### Inherited from

`Omit.shouldApplyFilter`

***

### startUrls

> **startUrls**: `UrlType`[]

Defined in: [src/lib/actions/scrapeListing.ts:56](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/actions/scrapeListing.ts#L56)
