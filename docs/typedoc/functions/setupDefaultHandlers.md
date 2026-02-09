[**crawlee-one**](../README.md)

***

[crawlee-one](../globals.md) / setupDefaultHandlers

# Function: setupDefaultHandlers()

> **setupDefaultHandlers**\<`T`, `RouterCtx`\>(`__namedParameters`): `Promise`\<`void`\>

Defined in: [src/lib/router/router.ts:326](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/router/router.ts#L326)

Configures the default router handler to redirect URLs to labelled route handlers
based on which route the URL matches first.

NOTE: This does mean that the URLs passed to this default handler will be fetched
twice (as the URL will be requeued to the correct handler). We recommend to use this
function only in the scenarios where there is a small number of startUrls, yet these
may need various ways of processing based on different paths or etc.

## Type Parameters

### T

`T` *extends* [`CrawleeOneCtx`](../interfaces/CrawleeOneCtx.md)\<`CrawlingContext`\<`JSDOMCrawler` \| `CheerioCrawler` \| `PlaywrightCrawler` \| `PuppeteerCrawler` \| `BasicCrawler`\<`BasicCrawlingContext`\<`Dictionary`\>\> \| `HttpCrawler`\<`InternalHttpCrawlingContext`\<`any`, `any`, `HttpCrawler`\<`any`\>\>\>, `Dictionary`\>, `string`, `Record`\<`string`, `any`\>, [`CrawleeOneIO`](../interfaces/CrawleeOneIO.md)\<`object`, `object`, `object`\>, [`CrawleeOneTelemetry`](../interfaces/CrawleeOneTelemetry.md)\<`any`, `any`\>\>

### RouterCtx

`RouterCtx` *extends* `Record`\<`string`, `any`\> = [`CrawleeOneRouteCtx`](../type-aliases/CrawleeOneRouteCtx.md)\<`T`\>

## Parameters

### \_\_namedParameters

#### input?

`T`\[`"input"`\] \| `null`

#### io

`T`\[`"io"`\]

#### onSetCtx?

(`ctx`) => `void`

#### routeHandlerWrappers?

[`CrawleeOneRouteWrapper`](../type-aliases/CrawleeOneRouteWrapper.md)\<`T`, `RouterCtx`\>[]

#### router

`RouterHandler`\<`T`\[`"context"`\]\>

#### routerContext?

`RouterCtx`

#### routes

`Record`\<`T`\[`"labels"`\], [`CrawleeOneRoute`](../interfaces/CrawleeOneRoute.md)\<`T`, `RouterCtx`\>\>

## Returns

`Promise`\<`void`\>

## Example

```ts
const routeLabels = {
  MAIN_PAGE: 'MAIN_PAGE',
  JOB_LISTING: 'JOB_LISTING',
  JOB_DETAIL: 'JOB_DETAIL',
  JOB_RELATED_LIST: 'JOB_RELATED_LIST',
  PARTNERS: 'PARTNERS',
} as const;

const router = createPlaywrightRouter();

const routes = createPlaywrightCrawleeOneRouteMatchers<typeof routeLabels>([
 // URLs that match this route are redirected to router.addHandler(routeLabels.MAIN_PAGE)
 {
    route: routeLabels.MAIN_PAGE,
    // Check for main page like https://www.profesia.sk/?#
    match: (url) => url.match(/[\W]profesia\.sk/?(?:[?#~]|$)/i),
  },

 // Optionally override the logic that assigns the URL to the route by specifying the `action` prop
 {
    route: routeLabels.MAIN_PAGE,
    // Check for main page like https://www.profesia.sk/?#
    match: (url) => url.match(/[\W]profesia\.sk/?(?:[?#~]|$)/i),
    action: async (ctx) => {
      await ctx.crawler.addRequests([{
        url: 'https://profesia.sk/praca',
        label: routeLabels.JOB_LISTING,
      }]);
    },
  },
]);

// Set up default route to redirect to labelled routes
setupDefaultHandlers({ router, routes });

// Now set up the labelled routes
await router.addHandler(routeLabels.JOB_LISTING, async (ctx) => { ... }
```
