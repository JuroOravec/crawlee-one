[**crawlee-one**](../README.md)

***

[crawlee-one](../globals.md) / CrawleeOneCtx

# Interface: CrawleeOneCtx\<Ctx, Labels, Input, TIO, Telem\>

Defined in: [src/lib/actor/types.ts:46](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/actor/types.ts#L46)

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

Defined in: [src/lib/actor/types.ts:67](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/actor/types.ts#L67)

***

### input

> **input**: `Input`

Defined in: [src/lib/actor/types.ts:69](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/actor/types.ts#L69)

***

### io

> **io**: `TIO`

Defined in: [src/lib/actor/types.ts:70](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/actor/types.ts#L70)

***

### labels

> **labels**: `Labels`

Defined in: [src/lib/actor/types.ts:68](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/actor/types.ts#L68)

***

### telemetry

> **telemetry**: `Telem`

Defined in: [src/lib/actor/types.ts:71](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/actor/types.ts#L71)
