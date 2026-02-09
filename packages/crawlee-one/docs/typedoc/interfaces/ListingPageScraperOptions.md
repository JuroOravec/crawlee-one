[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / ListingPageScraperOptions

# Interface: ListingPageScraperOptions\<Ctx, UrlType\>

Defined in: packages/crawlee-one/src/lib/actions/scrapeListing.ts:54

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

Defined in: packages/crawlee-one/src/lib/actions/scrapeListing.ts:55

***

### extractEntries()

> **extractEntries**: (`context`, `retryIndex`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`UrlType`[]\>

Defined in: packages/crawlee-one/src/lib/actions/scrapeListing.ts:84

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

Defined in: packages/crawlee-one/src/lib/actions/scrapeListing.ts:86

How many attempts are retried after failed to scrape entries from a listing. Defaults to 3

***

### filters?

> `optional` **filters**: [`ListingPageFilter`](ListingPageFilter.md)[]

Defined in: packages/crawlee-one/src/lib/actions/scrapeListing.ts:29

#### Inherited from

`Omit.filters`

***

### listingCountOnly?

> `optional` **listingCountOnly**: `boolean`

Defined in: packages/crawlee-one/src/lib/actions/scrapeListing.ts:57

***

### loadFiltersRetries?

> `optional` **loadFiltersRetries**: `number`

Defined in: packages/crawlee-one/src/lib/actions/scrapeListing.ts:71

How many attempts are retried after filters failed to load. Defaults to 3

***

### log

> **log**: [`ListingLogger`](ListingLogger.md)

Defined in: packages/crawlee-one/src/lib/actions/scrapeListing.ts:60

#### Overrides

`Omit.log`

***

### nextPageWait?

> `optional` **nextPageWait**: `number`

Defined in: packages/crawlee-one/src/lib/actions/scrapeListing.ts:111

How long to wait after we've navigated to the next page and before we start extracting?

***

### onAfterNavigation()?

> `optional` **onAfterNavigation**: (`context`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

Defined in: packages/crawlee-one/src/lib/actions/scrapeListing.ts:68

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

Defined in: packages/crawlee-one/src/lib/actions/scrapeListing.ts:97

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

Defined in: packages/crawlee-one/src/lib/actions/scrapeListing.ts:92

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

Defined in: packages/crawlee-one/src/lib/actions/scrapeListing.ts:36

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

Defined in: packages/crawlee-one/src/lib/actions/scrapeListing.ts:106

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

Defined in: packages/crawlee-one/src/lib/actions/scrapeListing.ts:77

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

Defined in: packages/crawlee-one/src/lib/actions/scrapeListing.ts:62

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

Defined in: packages/crawlee-one/src/lib/actions/scrapeListing.ts:35

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

Defined in: packages/crawlee-one/src/lib/actions/scrapeListing.ts:59

Get ID of the current page in the pagination, so it can be logged

#### Parameters

##### context

[`ListingPageScraperContext`](ListingPageScraperContext.md)\<`Ctx`, `UrlType`\>

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`string`\>

***

### shouldApplyFilter()?

> `optional` **shouldApplyFilter**: (`context`, `filter`, `filters`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`boolean`\>

Defined in: packages/crawlee-one/src/lib/actions/scrapeListing.ts:30

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

Defined in: packages/crawlee-one/src/lib/actions/scrapeListing.ts:56
