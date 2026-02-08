[**crawlee-one**](../README.md) • **Docs**

***

[crawlee-one](../globals.md) / RunCrawler

# Type alias: RunCrawler()\<Ctx\>

> **RunCrawler**\<`Ctx`\>: (`requests`?, `options`?) => `ReturnType`\<`OrigRunCrawler`\<`Ctx`\>\>

Extended type of `crawler.run()` function

## Type parameters

• **Ctx** *extends* `CrawlingContext` = `CrawlingContext`\<`BasicCrawler`\>

## Parameters

• **requests?**: [`CrawlerUrl`](CrawlerUrl.md)[]

• **options?**: `Parameters`\<`OrigRunCrawler`\<`Ctx`\>\>\[`1`\]

## Returns

`ReturnType`\<`OrigRunCrawler`\<`Ctx`\>\>

## Source

[src/lib/actor/types.ts:32](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/actor/types.ts#L32)
