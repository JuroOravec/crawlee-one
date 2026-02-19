[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / CrawleeOneConfig

# Interface: CrawleeOneConfig\<TCrawlers, TRenderer\>

Defined in: [packages/crawlee-one/src/lib/config/types.ts:66](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/config/types.ts#L66)

## Type Parameters

### TCrawlers

`TCrawlers` *extends* [`CrawlersRecord`](../type-aliases/CrawlersRecord.md) = [`CrawlersRecord`](../type-aliases/CrawlersRecord.md)

### TRenderer

`TRenderer` *extends* [`ReadmeRenderer`](../type-aliases/ReadmeRenderer.md)\<`any`\> = [`ReadmeRenderer`](../type-aliases/ReadmeRenderer.md)\<`any`\>

## Properties

### generate?

> `optional` **generate**: [`CrawleeOneConfigGenerate`](CrawleeOneConfigGenerate.md)\<`TRenderer`\>

Defined in: [packages/crawlee-one/src/lib/config/types.ts:75](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/config/types.ts#L75)

Code generation settings. If omitted, all generation is skipped.

***

### llm?

> `optional` **llm**: `object`

Defined in: [packages/crawlee-one/src/lib/config/types.ts:77](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/config/types.ts#L77)

LLM-related settings

#### compare?

> `optional` **compare**: `object`

##### compare.reports?

> `optional` **reports**: `Record`\<`string`, [`LlmCompareReportDefinition`](LlmCompareReportDefinition.md)\>

Reports that compare different models against each other

Run with `crawlee-one llm compare`

***

### schema

> **schema**: [`CrawleeOneConfigSchema`](CrawleeOneConfigSchema.md)\<`TCrawlers`\>

Defined in: [packages/crawlee-one/src/lib/config/types.ts:73](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/config/types.ts#L73)

Schema defining the crawlers in this project. This schema is used for code generation.

***

### version

> **version**: `1`

Defined in: [packages/crawlee-one/src/lib/config/types.ts:71](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/config/types.ts#L71)

Version of the CrawleeOne config.
