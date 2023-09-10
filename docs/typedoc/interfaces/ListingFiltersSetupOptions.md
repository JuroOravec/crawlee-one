[crawlee-one](../README.md) / [Exports](../modules.md) / ListingFiltersSetupOptions

# Interface: ListingFiltersSetupOptions<Ctx, UrlType\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `Ctx` | extends `object` |
| `UrlType` | `UrlType` |

## Table of contents

### Properties

- [context](ListingFiltersSetupOptions.md#context)
- [filters](ListingFiltersSetupOptions.md#filters)
- [log](ListingFiltersSetupOptions.md#log)
- [onFiltersLoaded](ListingFiltersSetupOptions.md#onfiltersloaded)
- [onResetFilters](ListingFiltersSetupOptions.md#onresetfilters)
- [shouldApplyFilter](ListingFiltersSetupOptions.md#shouldapplyfilter)

## Properties

### context

• **context**: [`ListingPageScraperContext`](ListingPageScraperContext.md)<`Ctx`, `UrlType`\>

#### Defined in

[src/lib/actions/scrapeListing.ts:28](https://github.com/JuroOravec/crawlee-one/blob/490b500/src/lib/actions/scrapeListing.ts#L28)

___

### filters

• `Optional` **filters**: [`ListingPageFilter`](ListingPageFilter.md)[]

#### Defined in

[src/lib/actions/scrapeListing.ts:29](https://github.com/JuroOravec/crawlee-one/blob/490b500/src/lib/actions/scrapeListing.ts#L29)

___

### log

• **log**: [`ListingLogger`](ListingLogger.md)

#### Defined in

[src/lib/actions/scrapeListing.ts:37](https://github.com/JuroOravec/crawlee-one/blob/490b500/src/lib/actions/scrapeListing.ts#L37)

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

#### Defined in

[src/lib/actions/scrapeListing.ts:36](https://github.com/JuroOravec/crawlee-one/blob/490b500/src/lib/actions/scrapeListing.ts#L36)

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

#### Defined in

[src/lib/actions/scrapeListing.ts:35](https://github.com/JuroOravec/crawlee-one/blob/490b500/src/lib/actions/scrapeListing.ts#L35)

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

#### Defined in

[src/lib/actions/scrapeListing.ts:30](https://github.com/JuroOravec/crawlee-one/blob/490b500/src/lib/actions/scrapeListing.ts#L30)
