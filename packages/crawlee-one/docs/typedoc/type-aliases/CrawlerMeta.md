[**crawlee-one**](../README.md)

---

[crawlee-one](../README.md) / CrawlerMeta

# Type Alias: CrawlerMeta\<T, Ctx, TData\>

> **CrawlerMeta**\<`T`, `Ctx`, `TData`\> = `T` _extends_ `"http"` ? `Ctx` _extends_ `InternalHttpCrawlingContext` ? `object` : `never` : `T` _extends_ `"jsdom"` ? `object` : `T` _extends_ `"cheerio"` ? `object` : `T` _extends_ `"playwright"` ? `object` : `T` _extends_ `"adaptive-playwright"` ? `object` : `T` _extends_ `"puppeteer"` ? `object` : `T` _extends_ `"basic"` ? `Ctx` _extends_ `CrawlingContext` ? `object` : `never` : `never`

Defined in: [packages/crawlee-one/src/types.ts:58](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/types.ts#L58)

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

`T` _extends_ [`CrawlerType`](CrawlerType.md)

### Ctx

`Ctx` _extends_ `CrawlingContext` = `CrawlingContext`

### TData

`TData` _extends_ `Record`\<`string`, `any`\> = `Record`\<`string`, `any`\>
