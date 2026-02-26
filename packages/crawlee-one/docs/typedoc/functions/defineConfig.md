[**crawlee-one**](../README.md)

---

[crawlee-one](../README.md) / defineConfig

# Function: defineConfig()

> **defineConfig**\<`TCrawlers`, `TRenderer`\>(`config`): [`CrawleeOneConfig`](../interfaces/CrawleeOneConfig.md)\<`TCrawlers`, `TRenderer`\>

Defined in: [packages/crawlee-one/src/lib/config/types.ts:220](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/config/types.ts#L220)

Type-safe config helper.

Both type params are inferred from the config. Use `defineCrawler<Partial<ActorInput>>()`
for each crawler to type `input`/`devInput` per crawler.

## Type Parameters

### TCrawlers

`TCrawlers` _extends_ [`CrawlersRecord`](../type-aliases/CrawlersRecord.md)

Inferred from `schema.crawlers`. Use `defineCrawler` for each entry.

### TRenderer

`TRenderer` _extends_ [`ReadmeRenderer`](../type-aliases/ReadmeRenderer.md)\<`any`\>

Inferred from `readme.renderer`.

## Parameters

### config

[`CrawleeOneConfig`](../interfaces/CrawleeOneConfig.md)\<`TCrawlers`, `TRenderer`\>

## Returns

[`CrawleeOneConfig`](../interfaces/CrawleeOneConfig.md)\<`TCrawlers`, `TRenderer`\>

## Example

```ts
import { defineConfig, defineCrawler } from 'crawlee-one';
import type { ActorInput } from './src/config.js';

export default defineConfig({
  version: 1,
  schema: {
    crawlers: {
      profesia: defineCrawler<Partial<ActorInput>>({
        type: 'cheerio',
        routes: ['main'],
        input: { startUrls: [...] },  // typed as Partial<ActorInput>
        devInput: { startUrls: [] },  // typed as Partial<ActorInput>
      }),
      another: defineCrawler<Partial<AnotherActorInput>>({
        type: 'playwright',
        routes: ['main'],
        input: { startUrls: [...] },  // typed as Partial<AnotherActorInput>
        devInput: { startUrls: [] },  // typed as Partial<AnotherActorInput>
      }),
    },
  },
  generate: {
    types: { outFile: './src/__generated__/crawler.ts' },
    actor: { config: actorConfig, outFile: '.actor/actor.json' },
    actorspec: { config: actorSpec, outFile: '.actor/actorspec.json' },
    readme: {
      outFile: '.actor/README.md',
      actorSpec,
      renderer: renderApifyReadme,
      input: { templates: ... },
    },
  },
});
```
