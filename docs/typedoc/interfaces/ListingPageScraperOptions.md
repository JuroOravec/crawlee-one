[**crawlee-one**](../README.md) • **Docs**

***

[crawlee-one](../globals.md) / ListingPageScraperOptions

# Interface: ListingPageScraperOptions\<Ctx, UrlType\>

## Extends

- `Omit`\<[`ListingFiltersSetupOptions`](ListingFiltersSetupOptions.md)\<`Ctx`, `UrlType`\>, `"context"`\>

## Type parameters

• **Ctx** *extends* `object`

• **UrlType**

## Properties

### context

> **context**: `Ctx`

#### Source

[src/lib/actions/scrapeListing.ts:55](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/actions/scrapeListing.ts#L55)

***

### extractEntries()

> **extractEntries**: (`context`, `retryIndex`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`UrlType`[]\>

Main logic to extract entries from a page

#### Parameters

• **context**: [`ListingPageScraperContext`](ListingPageScraperContext.md)\<`Ctx`, `UrlType`\>

• **retryIndex**: `number`

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`UrlType`[]\>

#### Source

[src/lib/actions/scrapeListing.ts:84](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/actions/scrapeListing.ts#L84)

***

### extractEntriesRetries?

> `optional` **extractEntriesRetries**: `number`

How many attempts are retried after failed to scrape entries from a listing. Defaults to 3

#### Source

[src/lib/actions/scrapeListing.ts:86](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/actions/scrapeListing.ts#L86)

***

### filters?

> `optional` **filters**: [`ListingPageFilter`](ListingPageFilter.md)[]

#### Inherited from

`Omit.filters`

#### Source

[src/lib/actions/scrapeListing.ts:29](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/actions/scrapeListing.ts#L29)

***

### listingCountOnly?

> `optional` **listingCountOnly**: `boolean`

#### Source

[src/lib/actions/scrapeListing.ts:57](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/actions/scrapeListing.ts#L57)

***

### loadFiltersRetries?

> `optional` **loadFiltersRetries**: `number`

How many attempts are retried after filters failed to load. Defaults to 3

#### Source

[src/lib/actions/scrapeListing.ts:71](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/actions/scrapeListing.ts#L71)

***

### log

> **log**: [`ListingLogger`](ListingLogger.md)

#### Overrides

`Omit.log`

#### Source

[src/lib/actions/scrapeListing.ts:60](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/actions/scrapeListing.ts#L60)

***

### nextPageWait?

> `optional` **nextPageWait**: `number`

How long to wait after we've navigated to the next page and before we start extracting?

#### Source

[src/lib/actions/scrapeListing.ts:111](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/actions/scrapeListing.ts#L111)

***

### onAfterNavigation()?

> `optional` **onAfterNavigation**: (`context`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

Hook triggered after navigating to the url using Page.goto().

One use of this hook is to conditionally disable/enable filters based on the page content.

#### Parameters

• **context**: [`ListingPageScraperContext`](ListingPageScraperContext.md)\<`Ctx`, `UrlType`\>

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

#### Source

[src/lib/actions/scrapeListing.ts:68](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/actions/scrapeListing.ts#L68)

***

### onExtractEntriesDone()?

> `optional` **onExtractEntriesDone**: (`context`, `entries`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

#### Parameters

• **context**: [`ListingPageScraperContext`](ListingPageScraperContext.md)\<`Ctx`, `UrlType`\>

• **entries**: `null` \| `UrlType`[]

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

#### Source

[src/lib/actions/scrapeListing.ts:97](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/actions/scrapeListing.ts#L97)

***

### onExtractEntriesError()?

> `optional` **onExtractEntriesError**: (`context`, `error`, `retryIndex`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

Hook triggered after a failed attempt at scraping entries from a listing.

One use of this hook is to reload the page on failed attemp in case something didn't load correctly.

#### Parameters

• **context**: [`ListingPageScraperContext`](ListingPageScraperContext.md)\<`Ctx`, `UrlType`\>

• **error**: `any`

• **retryIndex**: `number`

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

#### Source

[src/lib/actions/scrapeListing.ts:92](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/actions/scrapeListing.ts#L92)

***

### onFiltersLoaded()?

> `optional` **onFiltersLoaded**: (`context`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

#### Parameters

• **context**: [`ListingPageScraperContext`](ListingPageScraperContext.md)\<`Ctx`, `UrlType`\>

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

#### Inherited from

`Omit.onFiltersLoaded`

#### Source

[src/lib/actions/scrapeListing.ts:36](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/actions/scrapeListing.ts#L36)

***

### onGoToNextPage()?

> `optional` **onGoToNextPage**: (`context`, `entries`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

If goToNextPage hook is defined, it will be called after each page. To indicate that there's no more
pages left, throw an error.

#### Parameters

• **context**: [`ListingPageScraperContext`](ListingPageScraperContext.md)\<`Ctx`, `UrlType`\>

• **entries**: `null` \| `UrlType`[]

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

#### Source

[src/lib/actions/scrapeListing.ts:106](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/actions/scrapeListing.ts#L106)

***

### onLoadFiltersError()?

> `optional` **onLoadFiltersError**: (`context`, `error`, `retryIndex`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

Hook triggered after a failed attempt at loading listings page filters.

One use of this hook is to reload the page on failed attemp in case something didn't load correctly.

#### Parameters

• **context**: [`ListingPageScraperContext`](ListingPageScraperContext.md)\<`Ctx`, `UrlType`\>

• **error**: `any`

• **retryIndex**: `number`

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

#### Source

[src/lib/actions/scrapeListing.ts:77](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/actions/scrapeListing.ts#L77)

***

### onNavigate()?

> `optional` **onNavigate**: (`context`, `url`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

#### Parameters

• **context**: [`ListingPageScraperContext`](ListingPageScraperContext.md)\<`Ctx`, `UrlType`\>

• **url**: `UrlType`

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

#### Source

[src/lib/actions/scrapeListing.ts:62](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/actions/scrapeListing.ts#L62)

***

### onResetFilters()?

> `optional` **onResetFilters**: (`context`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

#### Parameters

• **context**: [`ListingPageScraperContext`](ListingPageScraperContext.md)\<`Ctx`, `UrlType`\>

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

#### Inherited from

`Omit.onResetFilters`

#### Source

[src/lib/actions/scrapeListing.ts:35](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/actions/scrapeListing.ts#L35)

***

### pageId()?

> `optional` **pageId**: (`context`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`string`\>

Get ID of the current page in the pagination, so it can be logged

#### Parameters

• **context**: [`ListingPageScraperContext`](ListingPageScraperContext.md)\<`Ctx`, `UrlType`\>

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`string`\>

#### Source

[src/lib/actions/scrapeListing.ts:59](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/actions/scrapeListing.ts#L59)

***

### shouldApplyFilter()?

> `optional` **shouldApplyFilter**: (`context`, `filter`, `filters`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`boolean`\>

#### Parameters

• **context**: [`ListingPageScraperContext`](ListingPageScraperContext.md)\<`Ctx`, `UrlType`\>

• **filter**: [`ListingPageFilter`](ListingPageFilter.md)

• **filters**: [`ListingPageFilter`](ListingPageFilter.md)[]

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`boolean`\>

#### Inherited from

`Omit.shouldApplyFilter`

#### Source

[src/lib/actions/scrapeListing.ts:30](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/actions/scrapeListing.ts#L30)

***

### startUrls

> **startUrls**: `UrlType`[]

#### Source

[src/lib/actions/scrapeListing.ts:56](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/actions/scrapeListing.ts#L56)
