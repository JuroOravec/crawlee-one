[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / ListingPageScraperContext

# Interface: ListingPageScraperContext\<Ctx, UrlType\>

Defined in: packages/crawlee-one/src/lib/actions/scrapeListing.ts:42

## Type Parameters

### Ctx

`Ctx` *extends* `object`

### UrlType

`UrlType`

## Properties

### abort()

> **abort**: () => `void`

Defined in: packages/crawlee-one/src/lib/actions/scrapeListing.ts:50

Call this function from any callback to stop scraping

#### Returns

`void`

***

### context

> **context**: `Ctx`

Defined in: packages/crawlee-one/src/lib/actions/scrapeListing.ts:43

***

### filters

> **filters**: [`ListingPageFilter`](ListingPageFilter.md)[]

Defined in: packages/crawlee-one/src/lib/actions/scrapeListing.ts:46

***

### loadFilterState()

> **loadFilterState**: () => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

Defined in: packages/crawlee-one/src/lib/actions/scrapeListing.ts:48

Use this if you need to load filters again (eg after reloading page manually)

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

***

### log

> **log**: [`ListingLogger`](ListingLogger.md)

Defined in: packages/crawlee-one/src/lib/actions/scrapeListing.ts:44

***

### startUrl

> **startUrl**: `UrlType`

Defined in: packages/crawlee-one/src/lib/actions/scrapeListing.ts:45
