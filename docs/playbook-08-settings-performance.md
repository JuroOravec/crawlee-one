# 8. Configure crawler settings and performance

> NOTE:
>
> In these examples, the input is mostly shown as a JSON, e.g.:
>
> ```json
> {
>   "startUrls": ["https://www.example.com/path/1"]
> }
> ```
>
> If you are using the `crawlee-one` package directly, then that is the same as:
>
> ```ts
> import { crawleeOne } from 'crawlee-one';
> await crawleeOne({
>   type: '...',
>   input: {
>     startUrls: ['https://www.example.com/path/1'],
>   },
> });
> ```

CrawleeOne is built on Crawlee. People behind Crawlee did amazing job, and crawlers
are highly configurable - how many retries on failures, concurrency, how long to wait, etc.

### Scenario

Although crawlers have been pre-confugured for you, sometimes you need to take control
and override the settings. Consider following:

> _Imagine you need to scrape data from a website like SKCRIS (www.skcris.sk). This is a database
> of Slovak researchers, and research organisations, projects, patents, and more. What's important to us is that:_
>
> 1. _Server response can be 2 seconds and more._
> 2. _Largest entries can take a **few hours** to extract._
> 3. _Server can handle larger load during working hours compared to at night and on weekends._
>
> _Knowing this, you might want to configure your scraper like so:_
>
> 1. _Avoid timeout errors, which happen when the scraper waits for too long for some action or response._ > _You might want to set unlimited wait time or some high value like **4 hours**. For comparison, this is_ > \*usually set to 30-60 **seconds\***.
> 2. _Make scraper faster by making use of concurrency options. When the server can handle heavier network load,_ > _you can have more concurrent connections to the server. And, conversely, you lower it in off-peak times._
>
> **_The issue is, these options are usually not available on most scrapers._** _So you either accept that you cannot modify these, or you re-implement the scraper. Neither of these options is great, so what do we do?_

### Crawlee options

If you need to modify the scraper configuration, CrawleeOne makes it very easy for you. Many of
[Crawlee crawler options](https://crawlee.dev/api/basic-crawler/interface/BasicCrawlerOptions)
can be passed to CrawleeOne too, including:

- Concurrency -
  [minConcurrency](https://crawlee.dev/api/basic-crawler/interface/BasicCrawlerOptions#minConcurrency),
  [maxConcurrency](https://crawlee.dev/api/basic-crawler/interface/BasicCrawlerOptions#maxConcurrency)
- Retries -
  [maxRequestRetries](https://crawlee.dev/api/basic-crawler/interface/BasicCrawlerOptions#maxRequestRetries)
- Rate-limiting -
  [maxRequestsPerMinute](https://crawlee.dev/api/basic-crawler/interface/BasicCrawlerOptions#maxRequestsPerMinute),
  [maxRequestsPerCrawl](https://crawlee.dev/api/basic-crawler/interface/BasicCrawlerOptions#maxRequestsPerCrawl)
- Timeouts -
  [navigationTimeoutSecs](https://crawlee.dev/api/browser-crawler/interface/BrowserCrawlerOptions#navigationTimeoutSecs),
  [requestHandlerTimeoutSecs](https://crawlee.dev/api/playwright-crawler/interface/PlaywrightCrawlerOptions#requestHandlerTimeoutSecs)
- Response encoding -
  [suggestResponseEncoding](https://crawlee.dev/api/http-crawler/interface/HttpCrawlerOptions#suggestResponseEncoding),
  [forceResponseEncoding](https://crawlee.dev/api/http-crawler/interface/HttpCrawlerOptions#forceResponseEncoding),
  [additionalMimeTypes](https://crawlee.dev/api/http-crawler/interface/HttpCrawlerOptions#additionalMimeTypes)
- Other -
  [keepAlive](https://crawlee.dev/api/http-crawler/interface/HttpCrawlerOptions#keepAlive),
  [logLevel](https://crawlee.dev/api/core/interface/ConfigurationOptions#logLevel)\*

\* NOTE: CrawleeOne uses different values than Crawlee to set the log level.

Example scraper input:

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

### CrawleeOne options

CrawleeOne also exposes a lot of its own options. Most of them are described in other sections dedicated to these options

#### Batching

When it comes to performance, CrawleeOne adds a batching mechanism. Batching, in this context, means following:

- Normally, a Crawlee scraper would be written to handle a single Request, and quit.
- Batching here means that the scraper will handle a batch of Requests in a single "go" before quitting or terminating the session.

This can be useful for scrapers that use browser automation tools like Playwright to extract the data. Without batching, each Request would start it's own instance of Chromium, process the data, and then close the browser. If we instead set batching to 20 items, then 20 Requests will be processed in a single instance of Chromium.

[Read more about this on Apify documentation](https://docs.apify.com/platform/actors/development/performance#batch-jobs-win-over-the-single-jobs).

The following config would handle 20 Requests in a single session, and wait 1.5 seconds between each Request:

```json
{
  "perfBatchSize": 20,
  "perfBatchWaitSecs": 1.5
}
```
