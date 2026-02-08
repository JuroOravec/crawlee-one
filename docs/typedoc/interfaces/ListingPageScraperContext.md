[**crawlee-one**](../README.md) • **Docs**

***

[crawlee-one](../globals.md) / ListingPageScraperContext

# Interface: ListingPageScraperContext\<Ctx, UrlType\>

## Type parameters

• **Ctx** *extends* `object`

• **UrlType**

## Properties

### abort()

> **abort**: () => `void`

Call this function from any callback to stop scraping

#### Returns

`void`

#### Source

[src/lib/actions/scrapeListing.ts:50](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/actions/scrapeListing.ts#L50)

***

### context

> **context**: `Ctx`

#### Source

[src/lib/actions/scrapeListing.ts:43](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/actions/scrapeListing.ts#L43)

***

### filters

> **filters**: [`ListingPageFilter`](ListingPageFilter.md)[]

#### Source

[src/lib/actions/scrapeListing.ts:46](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/actions/scrapeListing.ts#L46)

***

### loadFilterState()

> **loadFilterState**: () => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

Use this if you need to load filters again (eg after reloading page manually)

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

#### Source

[src/lib/actions/scrapeListing.ts:48](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/actions/scrapeListing.ts#L48)

***

### log

> **log**: [`ListingLogger`](ListingLogger.md)

#### Source

[src/lib/actions/scrapeListing.ts:44](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/actions/scrapeListing.ts#L44)

***

### startUrl

> **startUrl**: `UrlType`

#### Source

[src/lib/actions/scrapeListing.ts:45](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/actions/scrapeListing.ts#L45)
