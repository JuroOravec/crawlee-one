[**crawlee-one**](../README.md)

***

[crawlee-one](../globals.md) / CrawleeOneTelemetry

# Interface: CrawleeOneTelemetry\<T, THandlerOptions\>

Defined in: [src/lib/telemetry/types.ts:17](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/telemetry/types.ts#L17)

Interface for storing and retrieving:
- Scraped data
- Requests (URLs) to scrape
- Cache data

This interface is based on Crawlee/Apify, but defined separately to allow
drop-in replacement with other integrations.

## Type Parameters

### T

`T` *extends* [`CrawleeOneCtx`](CrawleeOneCtx.md)

### THandlerOptions

`THandlerOptions` *extends* [`CrawleeOneErrorHandlerOptions`](CrawleeOneErrorHandlerOptions.md)\<`any`\> = [`CrawleeOneErrorHandlerOptions`](CrawleeOneErrorHandlerOptions.md)

## Properties

### onSendErrorToTelemetry()

> **onSendErrorToTelemetry**: (`error`, `report`, `options`, `ctx`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

Defined in: [src/lib/telemetry/types.ts:22](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/telemetry/types.ts#L22)

#### Parameters

##### error

`Error`

##### report

[`ExtractErrorHandlerOptionsReport`](../type-aliases/ExtractErrorHandlerOptionsReport.md)\<`THandlerOptions`\>

##### options

`Omit`\<`THandlerOptions`, `"onErrorCapture"`\>

##### ctx

`T`\[`"context"`\]

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

***

### setup()

> **setup**: (`actor`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

Defined in: [src/lib/telemetry/types.ts:21](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/telemetry/types.ts#L21)

#### Parameters

##### actor

[`CrawleeOneActorInst`](CrawleeOneActorInst.md)\<`T`\>

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>
