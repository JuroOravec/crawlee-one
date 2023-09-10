[crawlee-one](../README.md) / [Exports](../modules.md) / ListingPageScraperContext

# Interface: ListingPageScraperContext<Ctx, UrlType\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `Ctx` | extends `object` |
| `UrlType` | `UrlType` |

## Table of contents

### Properties

- [abort](ListingPageScraperContext.md#abort)
- [context](ListingPageScraperContext.md#context)
- [filters](ListingPageScraperContext.md#filters)
- [loadFilterState](ListingPageScraperContext.md#loadfilterstate)
- [log](ListingPageScraperContext.md#log)
- [startUrl](ListingPageScraperContext.md#starturl)

## Properties

### abort

• **abort**: () => `void`

#### Type declaration

▸ (): `void`

Call this function from any callback to stop scraping

##### Returns

`void`

#### Defined in

[src/lib/actions/scrapeListing.ts:50](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/actions/scrapeListing.ts#L50)

___

### context

• **context**: `Ctx`

#### Defined in

[src/lib/actions/scrapeListing.ts:43](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/actions/scrapeListing.ts#L43)

___

### filters

• **filters**: [`ListingPageFilter`](ListingPageFilter.md)[]

#### Defined in

[src/lib/actions/scrapeListing.ts:46](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/actions/scrapeListing.ts#L46)

___

### loadFilterState

• **loadFilterState**: () => [`MaybePromise`](../modules.md#maybepromise)<`void`\>

#### Type declaration

▸ (): [`MaybePromise`](../modules.md#maybepromise)<`void`\>

Use this if you need to load filters again (eg after reloading page manually)

##### Returns

[`MaybePromise`](../modules.md#maybepromise)<`void`\>

#### Defined in

[src/lib/actions/scrapeListing.ts:48](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/actions/scrapeListing.ts#L48)

___

### log

• **log**: [`ListingLogger`](ListingLogger.md)

#### Defined in

[src/lib/actions/scrapeListing.ts:44](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/actions/scrapeListing.ts#L44)

___

### startUrl

• **startUrl**: `UrlType`

#### Defined in

[src/lib/actions/scrapeListing.ts:45](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/actions/scrapeListing.ts#L45)
