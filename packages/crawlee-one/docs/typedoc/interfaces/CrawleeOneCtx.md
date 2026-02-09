[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / CrawleeOneCtx

# Interface: CrawleeOneCtx\<Ctx, Labels, Input, TIO, Telem\>

Defined in: packages/crawlee-one/src/lib/actor/types.ts:46

Abstract type that holds all variable (generic) types used in CrawleeOne.

This type is not constructed anywhere. It is simply a shorthand, so we don't
have to pass through many times, but only one that describes them all.

## Type Parameters

### Ctx

`Ctx` *extends* `CrawlingContext`\<`BasicCrawler` \| `HttpCrawler`\<`InternalHttpCrawlingContext`\> \| `JSDOMCrawler` \| `CheerioCrawler` \| `PlaywrightCrawler` \| `PuppeteerCrawler`\> = `CrawlingContext`\<`BasicCrawler` \| `HttpCrawler`\<`InternalHttpCrawlingContext`\> \| `JSDOMCrawler` \| `CheerioCrawler` \| `PlaywrightCrawler` \| `PuppeteerCrawler`\>

### Labels

`Labels` *extends* `string` = `string`

### Input

`Input` *extends* `Record`\<`string`, `any`\> = `Record`\<`string`, `any`\>

### TIO

`TIO` *extends* [`CrawleeOneIO`](CrawleeOneIO.md) = [`CrawleeOneIO`](CrawleeOneIO.md)

### Telem

`Telem` *extends* [`CrawleeOneTelemetry`](CrawleeOneTelemetry.md)\<`any`, `any`\> = [`CrawleeOneTelemetry`](CrawleeOneTelemetry.md)\<`any`, `any`\>

## Properties

### context

> **context**: `Ctx`

Defined in: packages/crawlee-one/src/lib/actor/types.ts:67

***

### input

> **input**: `Input`

Defined in: packages/crawlee-one/src/lib/actor/types.ts:69

***

### io

> **io**: `TIO`

Defined in: packages/crawlee-one/src/lib/actor/types.ts:70

***

### labels

> **labels**: `Labels`

Defined in: packages/crawlee-one/src/lib/actor/types.ts:68

***

### telemetry

> **telemetry**: `Telem`

Defined in: packages/crawlee-one/src/lib/actor/types.ts:71
