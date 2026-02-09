[**crawlee-one**](../README.md)

***

[crawlee-one](../globals.md) / RunCrawler

# Type Alias: RunCrawler()\<Ctx\>

> **RunCrawler**\<`Ctx`\> = (`requests?`, `options?`) => `ReturnType`\<`OrigRunCrawler`\<`Ctx`\>\>

Defined in: [src/lib/actor/types.ts:32](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/actor/types.ts#L32)

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
