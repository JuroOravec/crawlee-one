[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / CrawleeOneRoute

# Interface: CrawleeOneRoute\<T, RouterCtx\>

Defined in: [packages/crawlee-one/src/lib/router/types.ts:37](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/router/types.ts#L37)

Route that a request will be sent to if the request doesn't have a label yet,
and if the `match` function returns truthy value.

If `match` function returns truthy value, the request is passed to the `action`
function for processing.

NOTE: If multiple records would match the request, then the first record to match
a request will process that request.

## Type Parameters

### T

`T` *extends* [`CrawleeOneCtx`](CrawleeOneCtx.md)

### RouterCtx

`RouterCtx` *extends* `Record`\<`string`, `any`\> = [`CrawleeOneRouteCtx`](../type-aliases/CrawleeOneRouteCtx.md)\<`T`\>

## Properties

### handler()

> **handler**: (`ctx`) => `Awaitable`\<`void`\>

Defined in: [packages/crawlee-one/src/lib/router/types.ts:42](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/router/types.ts#L42)

#### Parameters

##### ctx

`Omit`\<`T`\[`"context"`\] & `RouterCtx`, `"request"`\> & `object`

#### Returns

`Awaitable`\<`void`\>

***

### match

> **match**: [`CrawleeOneRouteMatcher`](../type-aliases/CrawleeOneRouteMatcher.md)\<`T`, `RouterCtx`\>

Defined in: [packages/crawlee-one/src/lib/router/types.ts:41](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/router/types.ts#L41)

***

### sampleUrls?

> `optional` **sampleUrls**: ([`SampleUrlItem`](../type-aliases/SampleUrlItem.md) \| () => [`MaybePromise`](../type-aliases/MaybePromise.md)\<[`MaybeArray`](../type-aliases/MaybeArray.md)\<[`SampleUrlItem`](../type-aliases/SampleUrlItem.md)\>\>)[]

Defined in: [packages/crawlee-one/src/lib/router/types.ts:86](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/router/types.ts#L86)

Sample URLs used by `crawlee-one dev`.

Can be URL strings, RequestOptions-like objects, pre-loaded `{ request, response }`
pairs, or a function that returns any of these (for dynamic/auth-gated pages).

#### Example

```ts
{
   *   sampleUrls: [
   *     // URL string - make a GET request to the server
   *     'https://example.com/',
   *     // Request object - make a custom request to the server
   *     {
   *       url: 'https://example.com/page/2',
   *       method: 'POST',
   *       headers: { 'Content-Type': 'application/json' }
   *       body: '...',
   *     },
   *     // Pre-loaded `{ request, response }` pair - will skip server request
   *     // and instead return the pre-loaded response (useful for testing).
   *     {
   *       request: { url: 'https://example.com/page/3' },
   *       response: { statusCode: 200, body: '...' }
   *     },
   *     // Async function that returns `SampleUrlItem[]`.
   *     // Use if the page requires authentication - you can load the page,
   *     // authenticate, and then return the `SampleUrlItem[]`.
   *     async () => {
   *       const browser = await chromium.launch();
   *       const page = await browser.newPage();
   *       await page.goto('https://example.com/login');
   *       await page.fill('input[name="username"]', 'username');
   *       await page.fill('input[name="password"]', 'password');
   *       await page.click('button[type="submit"]');
   *       const body = await page.content();
   *       return {
   *         request: { url: 'https://example.com/page/4' },
   *         response: { statusCode: 200, body }
   *       };
   *     },
   *   ],
   * }
```
