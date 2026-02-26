[**crawlee-one**](../README.md)

---

[crawlee-one](../README.md) / defineCrawler

# Function: defineCrawler()

> **defineCrawler**\<`TActorInput`\>(`config`): [`CrawleeOneConfigSchemaCrawler`](../interfaces/CrawleeOneConfigSchemaCrawler.md)\<`Partial`\<`TActorInput`\>\>

Defined in: [packages/crawlee-one/src/lib/config/types.ts:168](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/config/types.ts#L168)

Type-safe crawler config helper.

## Type Parameters

### TActorInput

`TActorInput` _extends_ `Record`\<`string`, `unknown`\>

Actor input shape. Use `Partial<ActorInput>` for config overrides.

## Parameters

### config

[`CrawleeOneConfigSchemaCrawler`](../interfaces/CrawleeOneConfigSchemaCrawler.md)\<`Partial`\<`TActorInput`\>\>

## Returns

[`CrawleeOneConfigSchemaCrawler`](../interfaces/CrawleeOneConfigSchemaCrawler.md)\<`Partial`\<`TActorInput`\>\>

## Example

```ts
import { defineCrawler } from 'crawlee-one';
import type { ActorInput } from './src/config.js';

defineCrawler<Partial<ActorInput>>({
  type: 'cheerio',
  routes: ['main'],
  input: { startUrls: [...] }, // typed as Partial<ActorInput>
  devInput: { startUrls: [] }, // typed as Partial<ActorInput>
});
```
