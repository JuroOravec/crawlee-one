[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / defineConfig

# Function: defineConfig()

> **defineConfig**\<`TRenderer`\>(`config`): [`CrawleeOneConfig`](../interfaces/CrawleeOneConfig.md)

Defined in: [packages/crawlee-one/src/types/config.ts:165](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/types/config.ts#L165)

Type-safe config helper.

When a `renderer` is provided, TypeScript infers the expected shape of
`input` from the `renderer`'s generic parameter.

## Type Parameters

### TRenderer

`TRenderer` *extends* [`ReadmeRenderer`](../type-aliases/ReadmeRenderer.md)\<`any`\> = [`ReadmeRenderer`](../type-aliases/ReadmeRenderer.md)\<`unknown`\>

## Parameters

### config

`DefineConfigInput`\<`TRenderer`\>

## Returns

[`CrawleeOneConfig`](../interfaces/CrawleeOneConfig.md)

## Example

```ts
import { defineConfig } from 'crawlee-one';
import { renderApifyReadme } from './src/readme.js';

export default defineConfig({
  version: 1,
  schema: {
    crawlers: {
      myCrawler: {
        type: 'cheerio',
        routes: ['main'],
      },
    },
  },
  readme: {
    renderer: renderApifyReadme,
    input: {
      templates: { ... }, // autocompleted from ApifyReadmeInput
    },
  },
});
```
