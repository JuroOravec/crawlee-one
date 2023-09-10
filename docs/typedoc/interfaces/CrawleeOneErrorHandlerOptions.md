[crawlee-one](../README.md) / [Exports](../modules.md) / CrawleeOneErrorHandlerOptions

# Interface: CrawleeOneErrorHandlerOptions<TIO\>

User-configurable options passed to the error handler

## Type parameters

| Name | Type |
| :------ | :------ |
| `TIO` | extends [`CrawleeOneIO`](CrawleeOneIO.md) = [`CrawleeOneIO`](CrawleeOneIO.md) |

## Table of contents

### Properties

- [allowScreenshot](CrawleeOneErrorHandlerOptions.md#allowscreenshot)
- [io](CrawleeOneErrorHandlerOptions.md#io)
- [onErrorCapture](CrawleeOneErrorHandlerOptions.md#onerrorcapture)
- [reportingDatasetId](CrawleeOneErrorHandlerOptions.md#reportingdatasetid)

## Properties

### allowScreenshot

• `Optional` **allowScreenshot**: `boolean`

#### Defined in

[src/lib/integrations/types.ts:317](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/integrations/types.ts#L317)

___

### io

• `Optional` **io**: `TIO`

#### Defined in

[src/lib/integrations/types.ts:316](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/integrations/types.ts#L316)

___

### onErrorCapture

• `Optional` **onErrorCapture**: (`input`: { `error`: `Error` ; `report`: [`ExtractIOReport`](../modules.md#extractioreport)<`TIO`\>  }) => [`MaybePromise`](../modules.md#maybepromise)<`void`\>

#### Type declaration

▸ (`input`): [`MaybePromise`](../modules.md#maybepromise)<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `Object` |
| `input.error` | `Error` |
| `input.report` | [`ExtractIOReport`](../modules.md#extractioreport)<`TIO`\> |

##### Returns

[`MaybePromise`](../modules.md#maybepromise)<`void`\>

#### Defined in

[src/lib/integrations/types.ts:319](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/integrations/types.ts#L319)

___

### reportingDatasetId

• `Optional` **reportingDatasetId**: `string`

#### Defined in

[src/lib/integrations/types.ts:318](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/integrations/types.ts#L318)
