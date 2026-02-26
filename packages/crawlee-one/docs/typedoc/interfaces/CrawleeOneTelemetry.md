[**crawlee-one**](../README.md)

---

[crawlee-one](../README.md) / CrawleeOneTelemetry

# Interface: CrawleeOneTelemetry\<T, THandlerOptions\>

Defined in: [packages/crawlee-one/src/lib/telemetry/types.ts:15](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/telemetry/types.ts#L15)

Interface for sending error reports to a telemetry service:

- Error reports

This interface is based on Sentry, but defined separately to allow
drop-in replacement with other telemetry services.

## Type Parameters

### T

`T` _extends_ [`CrawleeOneTypes`](CrawleeOneTypes.md)

### THandlerOptions

`THandlerOptions` _extends_ [`CrawleeOneErrorHandlerOptions`](CrawleeOneErrorHandlerOptions.md)\<`any`\> = [`CrawleeOneErrorHandlerOptions`](CrawleeOneErrorHandlerOptions.md)

## Properties

### onSendErrorToTelemetry()

> **onSendErrorToTelemetry**: (`error`, `report`, `options`, `ctx`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

Defined in: [packages/crawlee-one/src/lib/telemetry/types.ts:20](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/telemetry/types.ts#L20)

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

---

### setup()

> **setup**: (`context`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

Defined in: [packages/crawlee-one/src/lib/telemetry/types.ts:19](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/telemetry/types.ts#L19)

#### Parameters

##### context

[`CrawleeOneContext`](CrawleeOneContext.md)\<`T`\>

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>
