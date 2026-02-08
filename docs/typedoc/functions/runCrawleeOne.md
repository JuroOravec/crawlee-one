[**crawlee-one**](../README.md) • **Docs**

***

[crawlee-one](../globals.md) / runCrawleeOne

# Function: runCrawleeOne()

> **runCrawleeOne**\<`TType`, `T`\>(`args`): `Promise`\<`void`\>

Create opinionated Crawlee crawler that uses, and run it within Apify's `Actor.main()` context.

Apify context can be replaced with custom implementation using the `actorConfig.io` option.

This function does the following for you:

1) Full TypeScript coverage - Ensure all components use the same Crawler / CrawlerContext.

2) Get Actor input from `io.getInput()`, which by default
corresponds to Apify's `Actor.getInput()`.

3) (Optional) Validate Actor input

4) Set up router such that requests that reach default route are
redirected to labelled routes based on which item from "routes" they match.

5) Register all route handlers for you.

6) (Optional) Wrap all route handlers in a wrapper. Use this e.g.
if you want to add a field to the context object, or handle errors
from a single place.

7) (Optional) Support transformation and filtering of (scraped) entries,
configured via Actor input.

8) (Optional) Support Actor metamorphing, configured via Actor input.

9) Apify context (e.g. calling `Actor.getInput`) can be replaced with custom
 implementation using the `io` option.

## Type parameters

• **TType** *extends* `"basic"` \| `"http"` \| `"jsdom"` \| `"cheerio"` \| `"playwright"` \| `"adaptive-playwright"` \| `"puppeteer"`

• **T** *extends* [`CrawleeOneCtx`](../interfaces/CrawleeOneCtx.md)\<`CrawlerMeta`\<`TType`\>\[`"context"`\], `string`, `Record`\<`string`, `any`\>, [`CrawleeOneIO`](../interfaces/CrawleeOneIO.md)\<`object`, `object`, `object`\>, [`CrawleeOneTelemetry`](../interfaces/CrawleeOneTelemetry.md)\<`any`, `any`\>\>

## Parameters

• **args**: [`RunCrawleeOneOptions`](../interfaces/RunCrawleeOneOptions.md)\<`TType`, `T`\>

## Returns

`Promise`\<`void`\>

## Source

[src/lib/actor/actor.ts:156](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/actor/actor.ts#L156)
