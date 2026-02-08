[**crawlee-one**](../README.md) • **Docs**

***

[crawlee-one](../globals.md) / ListingFiltersSetupOptions

# Interface: ListingFiltersSetupOptions\<Ctx, UrlType\>

## Type parameters

• **Ctx** *extends* `object`

• **UrlType**

## Properties

### context

> **context**: [`ListingPageScraperContext`](ListingPageScraperContext.md)\<`Ctx`, `UrlType`\>

#### Source

[src/lib/actions/scrapeListing.ts:28](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/actions/scrapeListing.ts#L28)

***

### filters?

> `optional` **filters**: [`ListingPageFilter`](ListingPageFilter.md)[]

#### Source

[src/lib/actions/scrapeListing.ts:29](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/actions/scrapeListing.ts#L29)

***

### log

> **log**: [`ListingLogger`](ListingLogger.md)

#### Source

[src/lib/actions/scrapeListing.ts:37](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/actions/scrapeListing.ts#L37)

***

### onFiltersLoaded()?

> `optional` **onFiltersLoaded**: (`context`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

#### Parameters

• **context**: [`ListingPageScraperContext`](ListingPageScraperContext.md)\<`Ctx`, `UrlType`\>

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

#### Source

[src/lib/actions/scrapeListing.ts:36](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/actions/scrapeListing.ts#L36)

***

### onResetFilters()?

> `optional` **onResetFilters**: (`context`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

#### Parameters

• **context**: [`ListingPageScraperContext`](ListingPageScraperContext.md)\<`Ctx`, `UrlType`\>

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

#### Source

[src/lib/actions/scrapeListing.ts:35](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/actions/scrapeListing.ts#L35)

***

### shouldApplyFilter()?

> `optional` **shouldApplyFilter**: (`context`, `filter`, `filters`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`boolean`\>

#### Parameters

• **context**: [`ListingPageScraperContext`](ListingPageScraperContext.md)\<`Ctx`, `UrlType`\>

• **filter**: [`ListingPageFilter`](ListingPageFilter.md)

• **filters**: [`ListingPageFilter`](ListingPageFilter.md)[]

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`boolean`\>

#### Source

[src/lib/actions/scrapeListing.ts:30](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/actions/scrapeListing.ts#L30)
