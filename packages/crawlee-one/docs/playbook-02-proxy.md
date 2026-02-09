# 2. Proxy: Avoid rate limiting and geo-blocking

> **TL;DR:** Configure proxy settings via input to bypass rate limits, geo-blocking, and anti-bot measures -- no code changes required.

> **Note on input format:** Examples show input as JSON. When using `crawlee-one` directly, pass the same fields via the `input` option:
>
> ```ts
> await crawleeOne({ type: '...', input: { startUrls: ['https://...'] } });
> ```

## The problem

Common scraping scenarios require proxy support:

- A government website blocks access from foreign IPs.
- You need localized results (e.g. Google Search or Facebook Events for a specific country).
- The target site has aggressive anti-bot measures that throttle rapid requests.

Apify provides a robust [proxy integration](https://apify.com/proxy), but many third-party scrapers on the platform don't expose proxy configuration to end users. If you need country-specific results from someone else's scraper, you're stuck.

## The solution

CrawleeOne exposes proxy configuration as an input field, so it can always be controlled by the user running the scraper.

```json
{
  "proxy": {
    "useApifyProxy": true,
    "apifyProxyCountry": "US"
  }
}
```

[Read more about Apify Proxy](https://docs.apify.com/platform/proxy).
