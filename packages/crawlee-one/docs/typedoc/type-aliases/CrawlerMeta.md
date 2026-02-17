[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / CrawlerMeta

# Type Alias: CrawlerMeta\<T, Ctx, TData\>

> **CrawlerMeta**\<`T`, `Ctx`, `TData`\> = `T` *extends* `"http"` ? `Ctx` *extends* `InternalHttpCrawlingContext` ? `object` : `never` : `T` *extends* `"jsdom"` ? `object` : `T` *extends* `"cheerio"` ? `object` : `T` *extends* `"playwright"` ? `object` : `T` *extends* `"adaptive-playwright"` ? `object` : `T` *extends* `"puppeteer"` ? `object` : `T` *extends* `"basic"` ? `Ctx` *extends* `CrawlingContext` ? `object` : `never` : `never`

Defined in: packages/crawlee-one/src/types.ts:58

Type utility that retrieves types related to specific Crawlee crawlers.

E.g. `CrawleeMeta<'jsdom'>` will return types for JSDOM crawler:

```ts
{
  crawler: JSDOMCrawler,
  context: JSDOMCrawlingContext<TData>,
  options: JSDOMCrawlerOptions<TData>
}
```

Which can then be used like so:
```ts
type MyType = CrawleeMeta<'jsdom'>['context'];
```

## Type Parameters

### T

`T` *extends* [`CrawlerType`](CrawlerType.md)

### Ctx

`Ctx` *extends* `CrawlingContext` = `CrawlingContext`

### TData

`TData` *extends* `Record`\<`string`, `any`\> = `Record`\<`string`, `any`\>
