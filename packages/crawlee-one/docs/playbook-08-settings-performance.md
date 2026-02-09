# 8. Crawler settings and performance

> **TL;DR:** Tune concurrency, retries, timeouts, rate limits, and request batching via input -- without modifying scraper code.

> **Note on input format:** Examples show input as JSON. When using `crawlee-one` directly, pass the same fields via the `input` option:
>
> ```ts
> await crawleeOne({ type: '...', input: { startUrls: ['https://...'] } });
> ```

## The problem

Crawlee crawlers are highly configurable -- retries, concurrency, timeouts, rate limits. But most scrapers don't expose these settings to end users.

If a target server is slow, you can't increase the timeout. If it handles high load well, you can't increase concurrency. You either accept the defaults or rewrite the scraper.

CrawleeOne exposes these options as input fields, so they can be adjusted per run without code changes.

## Crawlee options

Many [Crawlee crawler options](https://crawlee.dev/api/basic-crawler/interface/BasicCrawlerOptions) are available as CrawleeOne input fields:

- **Concurrency** --
  [minConcurrency](https://crawlee.dev/api/basic-crawler/interface/BasicCrawlerOptions#minConcurrency),
  [maxConcurrency](https://crawlee.dev/api/basic-crawler/interface/BasicCrawlerOptions#maxConcurrency)
- **Retries** --
  [maxRequestRetries](https://crawlee.dev/api/basic-crawler/interface/BasicCrawlerOptions#maxRequestRetries)
- **Rate limiting** --
  [maxRequestsPerMinute](https://crawlee.dev/api/basic-crawler/interface/BasicCrawlerOptions#maxRequestsPerMinute),
  [maxRequestsPerCrawl](https://crawlee.dev/api/basic-crawler/interface/BasicCrawlerOptions#maxRequestsPerCrawl)
- **Timeouts** --
  [navigationTimeoutSecs](https://crawlee.dev/api/browser-crawler/interface/BrowserCrawlerOptions#navigationTimeoutSecs),
  [requestHandlerTimeoutSecs](https://crawlee.dev/api/playwright-crawler/interface/PlaywrightCrawlerOptions#requestHandlerTimeoutSecs)
- **Response encoding** --
  [suggestResponseEncoding](https://crawlee.dev/api/http-crawler/interface/HttpCrawlerOptions#suggestResponseEncoding),
  [forceResponseEncoding](https://crawlee.dev/api/http-crawler/interface/HttpCrawlerOptions#forceResponseEncoding),
  [additionalMimeTypes](https://crawlee.dev/api/http-crawler/interface/HttpCrawlerOptions#additionalMimeTypes)
- **Other** --
  [keepAlive](https://crawlee.dev/api/http-crawler/interface/HttpCrawlerOptions#keepAlive),
  [logLevel](https://crawlee.dev/api/core/interface/ConfigurationOptions#logLevel)\*

\* CrawleeOne uses different values than Crawlee for `logLevel`.

### Example

```json
{
  "logLevel": "info",
  "minConcurrency": 1,
  "maxConcurrency": 5,
  "maxRequestRetries": 5,
  "maxRequestsPerMinute": 120,
  "requestHandlerTimeoutSecs": 86400,
  "keepAlive": false
}
```

## Request batching

CrawleeOne adds a batching mechanism for browser-based crawlers (Playwright, Puppeteer).

Without batching, each request launches its own browser instance, processes the page, and closes. With batching, multiple requests share a single browser session, reducing startup overhead significantly.

```json
{
  "perfBatchSize": 20,
  "perfBatchWaitSecs": 1.5
}
```

This processes 20 requests per browser session, with a 1.5-second delay between each.

[Read more about batching on Apify](https://docs.apify.com/platform/actors/development/performance#batch-jobs-win-over-the-single-jobs).

> Batching is supported only for browser-based crawlers (`PlaywrightCrawler`, `PuppeteerCrawler`). Custom crawler classes need a `page` property with `page.goto` and `page.url` methods.
