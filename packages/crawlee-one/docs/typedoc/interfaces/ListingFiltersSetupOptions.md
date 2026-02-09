[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / ListingFiltersSetupOptions

# Interface: ListingFiltersSetupOptions\<Ctx, UrlType\>

Defined in: [packages/crawlee-one/src/lib/actions/scrapeListing.ts:27](https://github.com/JuroOravec/crawlee-one/blob/21f97db438b62ef45add1d44924b7781b5721667/packages/crawlee-one/src/lib/actions/scrapeListing.ts#L27)

## Type Parameters

### Ctx

`Ctx` *extends* `object`

### UrlType

`UrlType`

## Properties

### context

> **context**: [`ListingPageScraperContext`](ListingPageScraperContext.md)\<`Ctx`, `UrlType`\>

Defined in: [packages/crawlee-one/src/lib/actions/scrapeListing.ts:28](https://github.com/JuroOravec/crawlee-one/blob/21f97db438b62ef45add1d44924b7781b5721667/packages/crawlee-one/src/lib/actions/scrapeListing.ts#L28)

***

### filters?

> `optional` **filters**: [`ListingPageFilter`](ListingPageFilter.md)[]

Defined in: [packages/crawlee-one/src/lib/actions/scrapeListing.ts:29](https://github.com/JuroOravec/crawlee-one/blob/21f97db438b62ef45add1d44924b7781b5721667/packages/crawlee-one/src/lib/actions/scrapeListing.ts#L29)

***

### log

> **log**: [`ListingLogger`](ListingLogger.md)

Defined in: [packages/crawlee-one/src/lib/actions/scrapeListing.ts:37](https://github.com/JuroOravec/crawlee-one/blob/21f97db438b62ef45add1d44924b7781b5721667/packages/crawlee-one/src/lib/actions/scrapeListing.ts#L37)

***

### onFiltersLoaded()?

> `optional` **onFiltersLoaded**: (`context`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

Defined in: [packages/crawlee-one/src/lib/actions/scrapeListing.ts:36](https://github.com/JuroOravec/crawlee-one/blob/21f97db438b62ef45add1d44924b7781b5721667/packages/crawlee-one/src/lib/actions/scrapeListing.ts#L36)

#### Parameters

##### context

[`ListingPageScraperContext`](ListingPageScraperContext.md)\<`Ctx`, `UrlType`\>

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

***

### onResetFilters()?

> `optional` **onResetFilters**: (`context`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

Defined in: [packages/crawlee-one/src/lib/actions/scrapeListing.ts:35](https://github.com/JuroOravec/crawlee-one/blob/21f97db438b62ef45add1d44924b7781b5721667/packages/crawlee-one/src/lib/actions/scrapeListing.ts#L35)

#### Parameters

##### context

[`ListingPageScraperContext`](ListingPageScraperContext.md)\<`Ctx`, `UrlType`\>

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

***

### shouldApplyFilter()?

> `optional` **shouldApplyFilter**: (`context`, `filter`, `filters`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`boolean`\>

Defined in: [packages/crawlee-one/src/lib/actions/scrapeListing.ts:30](https://github.com/JuroOravec/crawlee-one/blob/21f97db438b62ef45add1d44924b7781b5721667/packages/crawlee-one/src/lib/actions/scrapeListing.ts#L30)

#### Parameters

##### context

[`ListingPageScraperContext`](ListingPageScraperContext.md)\<`Ctx`, `UrlType`\>

##### filter

[`ListingPageFilter`](ListingPageFilter.md)

##### filters

[`ListingPageFilter`](ListingPageFilter.md)[]

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`boolean`\>
