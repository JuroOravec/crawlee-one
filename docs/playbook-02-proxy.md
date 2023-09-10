# 2. Proxy: Avoid rate limiting and geo-blocking

> NOTE:
>
> In these examples, the input is mostly shown as a JSON, e.g.:
> ```json
> {
>   "startUrls": ["https://www.example.com/path/1"],
> }
> ```
> If you are using the `crawlee-one` package directly, then that is the same as:
> ```ts
> import { crawleeOne } from 'crawlee-one';
> await crawleeOne({
>   type: '...',
>   input: {
>     startUrls: ['https://www.example.com/path/1'],
>   },
> });
> ```

Consider these scenarios:

- You need to extract data from a governmental website that blocks access from IPs from other countries.
- You need contextualised data - e.g. Google search results or Facebook events for a specific country.
- The website you need the data has stringent anti-bot policies. If you visit too many pages too fast, you get slowed down.

All of these ask for the same - The use of proxy during scraping to mask or rotate the perceived IP.

Apify offers a convenient yet robust [proxy integration](https://apify.com/proxy). As a developer, you can easily configure whether the scraper should use proxy.

**However, when you use 3rd party scrapers on Apify, not all of them allow you to modify (or use at all) proxy.** So if you need country-specific results, you're out of luck.

That's why CrawleeOne gives you the option to configure the proxy from within Apify UI. So you can always be in control if you need to.

Use the `proxy` input field like below. [Read more about Apify Proxy here](https://docs.apify.com/platform/proxy).

```json
{
  "proxy": {
    "useApifyProxy": true,
    "apifyProxyCountry": "US"
  }
}
```
