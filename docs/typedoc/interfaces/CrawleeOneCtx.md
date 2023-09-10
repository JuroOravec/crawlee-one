[crawlee-one](../README.md) / [Exports](../modules.md) / CrawleeOneCtx

# Interface: CrawleeOneCtx<Ctx, Labels, Input, TIO, Telem\>

Abstract type that holds all variable (generic) types used in CrawleeOne.

This type is not constructed anywhere. It is simply a shorthand, so we don't
have to pass through many times, but only one that describes them all.

## Type parameters

| Name | Type |
| :------ | :------ |
| `Ctx` | extends `CrawlingContext`<`BasicCrawler` \| `HttpCrawler`<`InternalHttpCrawlingContext`\> \| `JSDOMCrawler` \| `CheerioCrawler` \| `PlaywrightCrawler` \| `PuppeteerCrawler`\> = `CrawlingContext`<`BasicCrawler` \| `HttpCrawler`<`InternalHttpCrawlingContext`\> \| `JSDOMCrawler` \| `CheerioCrawler` \| `PlaywrightCrawler` \| `PuppeteerCrawler`\> |
| `Labels` | extends `string` = `string` |
| `Input` | extends `Record`<`string`, `any`\> = `Record`<`string`, `any`\> |
| `TIO` | extends [`CrawleeOneIO`](CrawleeOneIO.md) = [`CrawleeOneIO`](CrawleeOneIO.md) |
| `Telem` | extends [`CrawleeOneTelemetry`](CrawleeOneTelemetry.md)<`any`, `any`\> = [`CrawleeOneTelemetry`](CrawleeOneTelemetry.md)<`any`, `any`\> |

## Table of contents

### Properties

- [context](CrawleeOneCtx.md#context)
- [input](CrawleeOneCtx.md#input)
- [io](CrawleeOneCtx.md#io)
- [labels](CrawleeOneCtx.md#labels)
- [telemetry](CrawleeOneCtx.md#telemetry)

## Properties

### context

• **context**: `Ctx`

#### Defined in

[src/lib/actor/types.ts:67](https://github.com/JuroOravec/crawlee-one/blob/490b500/src/lib/actor/types.ts#L67)

___

### input

• **input**: `Input`

#### Defined in

[src/lib/actor/types.ts:69](https://github.com/JuroOravec/crawlee-one/blob/490b500/src/lib/actor/types.ts#L69)

___

### io

• **io**: `TIO`

#### Defined in

[src/lib/actor/types.ts:70](https://github.com/JuroOravec/crawlee-one/blob/490b500/src/lib/actor/types.ts#L70)

___

### labels

• **labels**: `Labels`

#### Defined in

[src/lib/actor/types.ts:68](https://github.com/JuroOravec/crawlee-one/blob/490b500/src/lib/actor/types.ts#L68)

___

### telemetry

• **telemetry**: `Telem`

#### Defined in

[src/lib/actor/types.ts:71](https://github.com/JuroOravec/crawlee-one/blob/490b500/src/lib/actor/types.ts#L71)
