[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / RunCrawler

# Type Alias: RunCrawler()\<Ctx\>

> **RunCrawler**\<`Ctx`\> = (`requests?`, `options?`) => `ReturnType`\<`OrigRunCrawler`\<`Ctx`\>\>

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:32](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L32)

Extended type of `crawler.run()` function

## Type Parameters

### Ctx

`Ctx` *extends* `CrawlingContext` = `CrawlingContext`\<`BasicCrawler`\>

## Parameters

### requests?

[`CrawlerUrl`](CrawlerUrl.md)[]

### options?

`Parameters`\<`OrigRunCrawler`\<`Ctx`\>\>\[`1`\]

## Returns

`ReturnType`\<`OrigRunCrawler`\<`Ctx`\>\>
