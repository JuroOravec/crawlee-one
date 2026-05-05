[**crawlee-one**](../README.md)

---

[crawlee-one](../README.md) / CrawleeOneTypes

# Interface: CrawleeOneTypes\<Ctx, Labels, Input, TIO, Telem\>

Defined in: [packages/crawlee-one/src/lib/context/types.ts:49](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/context/types.ts#L49)

Abstract type that holds all variable (generic) types used in CrawleeOne.

This type is not constructed anywhere. It is simply a shorthand, so we don't
have to pass through many times, but only one that describes them all.

## Type Parameters

### Ctx

`Ctx` _extends_ `CrawlingContext`\<`BasicCrawler` \| `HttpCrawler`\<`InternalHttpCrawlingContext`\> \| `JSDOMCrawler` \| `CheerioCrawler` \| `PlaywrightCrawler` \| `PuppeteerCrawler`\> = `CrawlingContext`\<`BasicCrawler` \| `HttpCrawler`\<`InternalHttpCrawlingContext`\> \| `JSDOMCrawler` \| `CheerioCrawler` \| `PlaywrightCrawler` \| `PuppeteerCrawler`\>

### Labels

`Labels` _extends_ `string` = `string`

### Input

`Input` _extends_ `Record`\<`string`, `any`\> = `Record`\<`string`, `any`\>

### TIO

`TIO` _extends_ [`CrawleeOneIO`](CrawleeOneIO.md) = [`CrawleeOneIO`](CrawleeOneIO.md)

### Telem

`Telem` _extends_ [`CrawleeOneTelemetry`](CrawleeOneTelemetry.md)\<`any`, `any`\> = [`CrawleeOneTelemetry`](CrawleeOneTelemetry.md)\<`any`, `any`\>

## Properties

### context

> **context**: `Ctx`

Defined in: [packages/crawlee-one/src/lib/context/types.ts:70](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/context/types.ts#L70)

---

### input

> **input**: `Input`

Defined in: [packages/crawlee-one/src/lib/context/types.ts:72](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/context/types.ts#L72)

---

### io

> **io**: `TIO`

Defined in: [packages/crawlee-one/src/lib/context/types.ts:73](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/context/types.ts#L73)

---

### labels

> **labels**: `Labels`

Defined in: [packages/crawlee-one/src/lib/context/types.ts:71](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/context/types.ts#L71)

---

### telemetry

> **telemetry**: `Telem`

Defined in: [packages/crawlee-one/src/lib/context/types.ts:74](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/context/types.ts#L74)
