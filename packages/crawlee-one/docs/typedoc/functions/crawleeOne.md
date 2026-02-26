[**crawlee-one**](../README.md)

---

[crawlee-one](../README.md) / crawleeOne

# Function: crawleeOne()

> **crawleeOne**\<`TType`, `T`\>(`opts`, `onReady?`): `Promise`\<`void`\>

Defined in: [packages/crawlee-one/src/lib/context/context.ts:210](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/context/context.ts#L210)

Create and run an opinionated Crawlee crawler that uses router for handling requests,
and runs within Apify's `Actor.main()` context.

Apify context can be replaced with custom implementation using the `io` option.

This function does the following for you:

1. Full TypeScript coverage - Ensure all components use the same Crawler / CrawlerContext.

2. Get Actor input from `io.getInput()`, which by default
   corresponds to Apify's `Actor.getInput()`.

3. (Optional) Validate Actor input

4. Set up router such that requests that reach default route are
   redirected to labelled routes based on which item from "routes" they match.

5. Register all route handlers for you.

6. (Optional) Wrap all route handlers in a wrapper. Use this e.g.
   if you want to add a field to the context object, or handle errors
   from a single place.

7. (Optional) Support transformation and filtering of (scraped) entries,
   configured via Actor input.

8. (Optional) Support Actor metamorphing, configured via Actor input.

9. Apify context (e.g. calling `Actor.getInput`) can be replaced with custom
   implementation using the `io` option.

## Type Parameters

### TType

`TType` _extends_ `"basic"` \| `"http"` \| `"jsdom"` \| `"cheerio"` \| `"playwright"` \| `"adaptive-playwright"` \| `"puppeteer"`

### T

`T` _extends_ [`CrawleeOneTypes`](../interfaces/CrawleeOneTypes.md)\<[`CrawlerMeta`](../type-aliases/CrawlerMeta.md)\<`TType`\>\[`"context"`\], `string`, `Record`\<`string`, `any`\>, [`CrawleeOneIO`](../interfaces/CrawleeOneIO.md)\<`object`, `object`, `object`\>, [`CrawleeOneTelemetry`](../interfaces/CrawleeOneTelemetry.md)\<`any`, `any`\>\> = [`CrawleeOneTypes`](../interfaces/CrawleeOneTypes.md)\<[`CrawlerMeta`](../type-aliases/CrawlerMeta.md)\<`TType`\>\[`"context"`\], `string`, `Record`\<`string`, `any`\>, [`CrawleeOneIO`](../interfaces/CrawleeOneIO.md)\<`object`, `object`, `object`\>, [`CrawleeOneTelemetry`](../interfaces/CrawleeOneTelemetry.md)\<`any`, `any`\>\>

## Parameters

### opts

[`CrawleeOneOptions`](../interfaces/CrawleeOneOptions.md)\<`TType`, `T`\>

### onReady?

(`context`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

## Returns

`Promise`\<`void`\>
