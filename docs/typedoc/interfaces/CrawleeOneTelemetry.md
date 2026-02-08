[**crawlee-one**](../README.md) • **Docs**

***

[crawlee-one](../globals.md) / CrawleeOneTelemetry

# Interface: CrawleeOneTelemetry\<T, THandlerOptions\>

Interface for storing and retrieving:
- Scraped data
- Requests (URLs) to scrape
- Cache data

This interface is based on Crawlee/Apify, but defined separately to allow
drop-in replacement with other integrations.

## Type parameters

• **T** *extends* [`CrawleeOneCtx`](CrawleeOneCtx.md)

• **THandlerOptions** *extends* [`CrawleeOneErrorHandlerOptions`](CrawleeOneErrorHandlerOptions.md)\<`any`\> = [`CrawleeOneErrorHandlerOptions`](CrawleeOneErrorHandlerOptions.md)

## Properties

### onSendErrorToTelemetry()

> **onSendErrorToTelemetry**: (`error`, `report`, `options`, `ctx`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

#### Parameters

• **error**: `Error`

• **report**: [`ExtractErrorHandlerOptionsReport`](../type-aliases/ExtractErrorHandlerOptionsReport.md)\<`THandlerOptions`\>

• **options**: `Omit`\<`THandlerOptions`, `"onErrorCapture"`\>

• **ctx**: `T`\[`"context"`\]

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

#### Source

[src/lib/telemetry/types.ts:22](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/telemetry/types.ts#L22)

***

### setup()

> **setup**: (`actor`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

#### Parameters

• **actor**: [`CrawleeOneActorInst`](CrawleeOneActorInst.md)\<`T`\>

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

#### Source

[src/lib/telemetry/types.ts:21](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/telemetry/types.ts#L21)
