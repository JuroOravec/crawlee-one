[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / CrawleeOneConfigSchema

# Interface: CrawleeOneConfigSchema\<TCrawlers\>

Defined in: packages/crawlee-one/src/lib/config/types.ts:207

Schema defining the crawlers in a project. This schema is used for code generation.

## Type Parameters

### TCrawlers

`TCrawlers` *extends* [`CrawlersRecord`](../type-aliases/CrawlersRecord.md) = [`CrawlersRecord`](../type-aliases/CrawlersRecord.md)

## Properties

### crawlers

> **crawlers**: `TCrawlers`

Defined in: packages/crawlee-one/src/lib/config/types.ts:231

Object holding crawler configurations. Each crawler is identified by its key.

Use `defineCrawler<Partial<ActorInput>>({...})` for each entry to type input/devInput.

E.g.

```js
crawlers: {
  profesia: defineCrawler<Partial<ActorInput>>({
   type: 'cheerio',
   routes: [...],
   input: { startUrls: [...] }, // typed as Partial<ActorInput>
   devInput: { startUrls: [] }, // typed as Partial<ActorInput>
  }),
  another: defineCrawler<Partial<AnotherActorInput>>({
   type: 'playwright',
   routes: [...],
   input: { startUrls: [...] }, // typed as Partial<AnotherActorInput>
   devInput: { startUrls: [] }, // typed as Partial<AnotherActorInput>
  }),
}
```
