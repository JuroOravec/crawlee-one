[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / CrawleeOneConfigRun

# Type Alias: CrawleeOneConfigRun()\<TCrawlerType, TInput\>

> **CrawleeOneConfigRun**\<`TCrawlerType`, `TInput`\> = (`opts?`) => `Promise`\<`void`\>

Defined in: [packages/crawlee-one/src/lib/config/types.ts:346](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/config/types.ts#L346)

The scraper entry point. Must be the default export.

Routes are defined inside the function and passed to the crawler config;
they are not exported (dev mode resolves them from actor.routes).

## Type Parameters

### TCrawlerType

`TCrawlerType` *extends* [`CrawlerType`](CrawlerType.md) = [`CrawlerType`](CrawlerType.md)

Crawler type; passed through to run options.

### TInput

`TInput` *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

Actor input shape; passed through to run options.

## Parameters

### opts?

[`CrawleeOneConfigRunOptions`](CrawleeOneConfigRunOptions.md)\<`TCrawlerType`, `TInput`\>

## Returns

`Promise`\<`void`\>

## Example

```ts
const run = async (opts?: CrawleeOneConfigRunOptions<'cheerio', ActorInput>) => {
  const { crawlerOptions, input, crawleeOneOptions } = opts ?? {};
  await myCrawler({
    crawlerConfigOverrides: crawlerOptions,
    input,
    crawleeOneOptions,
    routes: { ... },
  });
};
export default run;
```
