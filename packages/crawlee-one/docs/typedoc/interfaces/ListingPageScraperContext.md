[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / ListingPageScraperContext

# Interface: ListingPageScraperContext\<Ctx, UrlType\>

Defined in: [packages/crawlee-one/src/lib/actions/scrapeListing.ts:42](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actions/scrapeListing.ts#L42)

## Type Parameters

### Ctx

`Ctx` *extends* `object`

### UrlType

`UrlType`

## Properties

### abort()

> **abort**: () => `void`

Defined in: [packages/crawlee-one/src/lib/actions/scrapeListing.ts:50](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actions/scrapeListing.ts#L50)

Call this function from any callback to stop scraping

#### Returns

`void`

***

### context

> **context**: `Ctx`

Defined in: [packages/crawlee-one/src/lib/actions/scrapeListing.ts:43](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actions/scrapeListing.ts#L43)

***

### filters

> **filters**: [`ListingPageFilter`](ListingPageFilter.md)[]

Defined in: [packages/crawlee-one/src/lib/actions/scrapeListing.ts:46](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actions/scrapeListing.ts#L46)

***

### loadFilterState()

> **loadFilterState**: () => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

Defined in: [packages/crawlee-one/src/lib/actions/scrapeListing.ts:48](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actions/scrapeListing.ts#L48)

Use this if you need to load filters again (eg after reloading page manually)

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

***

### log

> **log**: [`ListingLogger`](ListingLogger.md)

Defined in: [packages/crawlee-one/src/lib/actions/scrapeListing.ts:44](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actions/scrapeListing.ts#L44)

***

### startUrl

> **startUrl**: `UrlType`

Defined in: [packages/crawlee-one/src/lib/actions/scrapeListing.ts:45](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actions/scrapeListing.ts#L45)
