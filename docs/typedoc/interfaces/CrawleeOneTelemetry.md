[crawlee-one](../README.md) / [Exports](../modules.md) / CrawleeOneTelemetry

# Interface: CrawleeOneTelemetry<T, THandlerOptions\>

Interface for storing and retrieving:
- Scraped data
- Requests (URLs) to scrape
- Cache data

This interface is based on Crawlee/Apify, but defined separately to allow
drop-in replacement with other integrations.

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`CrawleeOneCtx`](CrawleeOneCtx.md) |
| `THandlerOptions` | extends [`CrawleeOneErrorHandlerOptions`](CrawleeOneErrorHandlerOptions.md)<`any`\> = [`CrawleeOneErrorHandlerOptions`](CrawleeOneErrorHandlerOptions.md) |

## Table of contents

### Properties

- [onSendErrorToTelemetry](CrawleeOneTelemetry.md#onsenderrortotelemetry)
- [setup](CrawleeOneTelemetry.md#setup)

## Properties

### onSendErrorToTelemetry

• **onSendErrorToTelemetry**: (`error`: `Error`, `report`: [`ExtractErrorHandlerOptionsReport`](../modules.md#extracterrorhandleroptionsreport)<`THandlerOptions`\>, `options`: `Omit`<`THandlerOptions`, ``"onErrorCapture"``\>, `ctx`: `T`[``"context"``]) => [`MaybePromise`](../modules.md#maybepromise)<`void`\>

#### Type declaration

▸ (`error`, `report`, `options`, `ctx`): [`MaybePromise`](../modules.md#maybepromise)<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `error` | `Error` |
| `report` | [`ExtractErrorHandlerOptionsReport`](../modules.md#extracterrorhandleroptionsreport)<`THandlerOptions`\> |
| `options` | `Omit`<`THandlerOptions`, ``"onErrorCapture"``\> |
| `ctx` | `T`[``"context"``] |

##### Returns

[`MaybePromise`](../modules.md#maybepromise)<`void`\>

#### Defined in

[src/lib/telemetry/types.ts:22](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/telemetry/types.ts#L22)

___

### setup

• **setup**: (`actor`: [`CrawleeOneActorInst`](CrawleeOneActorInst.md)<`T`\>) => [`MaybePromise`](../modules.md#maybepromise)<`void`\>

#### Type declaration

▸ (`actor`): [`MaybePromise`](../modules.md#maybepromise)<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `actor` | [`CrawleeOneActorInst`](CrawleeOneActorInst.md)<`T`\> |

##### Returns

[`MaybePromise`](../modules.md#maybepromise)<`void`\>

#### Defined in

[src/lib/telemetry/types.ts:21](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/telemetry/types.ts#L21)
