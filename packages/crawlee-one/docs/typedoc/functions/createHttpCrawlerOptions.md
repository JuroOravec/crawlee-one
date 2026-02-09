[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / createHttpCrawlerOptions

# Function: createHttpCrawlerOptions()

> **createHttpCrawlerOptions**\<`T`, `TOpts`\>(`__namedParameters`): `Partial`\<`TOpts`\> & `Dictionary`\<`TOpts`\[`"requestHandler"`\] \| `TOpts`\[`"handleRequestFunction"`\] \| `TOpts`\[`"requestList"`\] \| `TOpts`\[`"requestQueue"`\] \| `TOpts`\[`"requestManager"`\] \| `TOpts`\[`"requestHandlerTimeoutSecs"`\] \| `TOpts`\[`"handleRequestTimeoutSecs"`\] \| `TOpts`\[`"errorHandler"`\] \| `TOpts`\[`"failedRequestHandler"`\] \| `TOpts`\[`"handleFailedRequestFunction"`\] \| `TOpts`\[`"maxRequestRetries"`\] \| `TOpts`\[`"sameDomainDelaySecs"`\] \| `TOpts`\[`"maxSessionRotations"`\] \| `TOpts`\[`"maxRequestsPerCrawl"`\] \| `TOpts`\[`"maxCrawlDepth"`\] \| `TOpts`\[`"autoscaledPoolOptions"`\] \| `TOpts`\[`"minConcurrency"`\] \| `TOpts`\[`"maxConcurrency"`\] \| `TOpts`\[`"maxRequestsPerMinute"`\] \| `TOpts`\[`"keepAlive"`\] \| `TOpts`\[`"useSessionPool"`\] \| `TOpts`\[`"sessionPoolOptions"`\] \| `TOpts`\[`"statusMessageLoggingInterval"`\] \| `TOpts`\[`"statusMessageCallback"`\] \| `TOpts`\[`"retryOnBlocked"`\] \| `TOpts`\[`"respectRobotsTxtFile"`\] \| `TOpts`\[`"onSkippedRequest"`\] \| `TOpts`\[`"log"`\] \| `TOpts`\[`"experiments"`\] \| `TOpts`\[`"statisticsOptions"`\] \| `TOpts`\[`"httpClient"`\]\>

Defined in: packages/crawlee-one/src/lib/actor/actor.ts:588

Given the actor input, create common crawler options.

## Type Parameters

### T

`T` *extends* [`CrawleeOneCtx`](../interfaces/CrawleeOneCtx.md)\<`CrawlingContext`\<`JSDOMCrawler` \| `CheerioCrawler` \| `PlaywrightCrawler` \| `PuppeteerCrawler` \| `BasicCrawler`\<`BasicCrawlingContext`\<`Dictionary`\>\> \| `HttpCrawler`\<`InternalHttpCrawlingContext`\<`any`, `any`, `HttpCrawler`\<`any`\>\>\>, `Dictionary`\>, `string`, `Record`\<`string`, `any`\>, [`CrawleeOneIO`](../interfaces/CrawleeOneIO.md)\<`object`, `object`, `object`\>, [`CrawleeOneTelemetry`](../interfaces/CrawleeOneTelemetry.md)\<`any`, `any`\>\>

### TOpts

`TOpts` *extends* `BasicCrawlerOptions`\<`T`\[`"context"`\]\>

## Parameters

### \_\_namedParameters

#### defaults?

`TOpts`

Default config options set by us. These may be overriden
by values from actor input (set by user).

#### input

`T`\[`"input"`\] \| `null`

Actor input

#### overrides?

`TOpts`

These config options will overwrite both the default and user
options. This is useful for hard-setting values e.g. in tests.

## Returns

`Partial`\<`TOpts`\> & `Dictionary`\<`TOpts`\[`"requestHandler"`\] \| `TOpts`\[`"handleRequestFunction"`\] \| `TOpts`\[`"requestList"`\] \| `TOpts`\[`"requestQueue"`\] \| `TOpts`\[`"requestManager"`\] \| `TOpts`\[`"requestHandlerTimeoutSecs"`\] \| `TOpts`\[`"handleRequestTimeoutSecs"`\] \| `TOpts`\[`"errorHandler"`\] \| `TOpts`\[`"failedRequestHandler"`\] \| `TOpts`\[`"handleFailedRequestFunction"`\] \| `TOpts`\[`"maxRequestRetries"`\] \| `TOpts`\[`"sameDomainDelaySecs"`\] \| `TOpts`\[`"maxSessionRotations"`\] \| `TOpts`\[`"maxRequestsPerCrawl"`\] \| `TOpts`\[`"maxCrawlDepth"`\] \| `TOpts`\[`"autoscaledPoolOptions"`\] \| `TOpts`\[`"minConcurrency"`\] \| `TOpts`\[`"maxConcurrency"`\] \| `TOpts`\[`"maxRequestsPerMinute"`\] \| `TOpts`\[`"keepAlive"`\] \| `TOpts`\[`"useSessionPool"`\] \| `TOpts`\[`"sessionPoolOptions"`\] \| `TOpts`\[`"statusMessageLoggingInterval"`\] \| `TOpts`\[`"statusMessageCallback"`\] \| `TOpts`\[`"retryOnBlocked"`\] \| `TOpts`\[`"respectRobotsTxtFile"`\] \| `TOpts`\[`"onSkippedRequest"`\] \| `TOpts`\[`"log"`\] \| `TOpts`\[`"experiments"`\] \| `TOpts`\[`"statisticsOptions"`\] \| `TOpts`\[`"httpClient"`\]\>
