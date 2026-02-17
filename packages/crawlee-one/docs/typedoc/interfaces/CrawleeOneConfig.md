[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / CrawleeOneConfig

# Interface: CrawleeOneConfig\<TCrawlers, TRenderer\>

Defined in: packages/crawlee-one/src/lib/config/types.ts:52

## Type Parameters

### TCrawlers

`TCrawlers` *extends* [`CrawlersRecord`](../type-aliases/CrawlersRecord.md) = [`CrawlersRecord`](../type-aliases/CrawlersRecord.md)

### TRenderer

`TRenderer` *extends* [`ReadmeRenderer`](../type-aliases/ReadmeRenderer.md)\<`any`\> = [`ReadmeRenderer`](../type-aliases/ReadmeRenderer.md)\<`any`\>

## Properties

### generate?

> `optional` **generate**: [`CrawleeOneConfigGenerate`](CrawleeOneConfigGenerate.md)\<`TRenderer`\>

Defined in: packages/crawlee-one/src/lib/config/types.ts:61

Code generation settings. If omitted, all generation is skipped.

***

### schema

> **schema**: [`CrawleeOneConfigSchema`](CrawleeOneConfigSchema.md)\<`TCrawlers`\>

Defined in: packages/crawlee-one/src/lib/config/types.ts:59

Schema defining the crawlers in this project. This schema is used for code generation.

***

### version

> **version**: `1`

Defined in: packages/crawlee-one/src/lib/config/types.ts:57

Version of the CrawleeOne config.
