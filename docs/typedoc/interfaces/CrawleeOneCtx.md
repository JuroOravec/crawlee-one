[**crawlee-one**](../README.md) • **Docs**

***

[crawlee-one](../globals.md) / CrawleeOneCtx

# Interface: CrawleeOneCtx\<Ctx, Labels, Input, TIO, Telem\>

Abstract type that holds all variable (generic) types used in CrawleeOne.

This type is not constructed anywhere. It is simply a shorthand, so we don't
have to pass through many times, but only one that describes them all.

## Type parameters

• **Ctx** *extends* `CrawlingContext`\<`BasicCrawler` \| `HttpCrawler`\<`InternalHttpCrawlingContext`\> \| `JSDOMCrawler` \| `CheerioCrawler` \| `PlaywrightCrawler` \| `PuppeteerCrawler`\> = `CrawlingContext`\<`BasicCrawler` \| `HttpCrawler`\<`InternalHttpCrawlingContext`\> \| `JSDOMCrawler` \| `CheerioCrawler` \| `PlaywrightCrawler` \| `PuppeteerCrawler`\>

• **Labels** *extends* `string` = `string`

• **Input** *extends* `Record`\<`string`, `any`\> = `Record`\<`string`, `any`\>

• **TIO** *extends* [`CrawleeOneIO`](CrawleeOneIO.md) = [`CrawleeOneIO`](CrawleeOneIO.md)

• **Telem** *extends* [`CrawleeOneTelemetry`](CrawleeOneTelemetry.md)\<`any`, `any`\> = [`CrawleeOneTelemetry`](CrawleeOneTelemetry.md)\<`any`, `any`\>

## Properties

### context

> **context**: `Ctx`

#### Source

[src/lib/actor/types.ts:67](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/actor/types.ts#L67)

***

### input

> **input**: `Input`

#### Source

[src/lib/actor/types.ts:69](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/actor/types.ts#L69)

***

### io

> **io**: `TIO`

#### Source

[src/lib/actor/types.ts:70](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/actor/types.ts#L70)

***

### labels

> **labels**: `Labels`

#### Source

[src/lib/actor/types.ts:68](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/actor/types.ts#L68)

***

### telemetry

> **telemetry**: `Telem`

#### Source

[src/lib/actor/types.ts:71](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/actor/types.ts#L71)
