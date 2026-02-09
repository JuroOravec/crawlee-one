# 11. Error capture

> **TL;DR:** Errors are automatically saved to a dedicated dataset for persistent, centralized monitoring across scrapers.

> **Note on input format:** Examples show input as JSON. When using `crawlee-one` directly, pass the same fields via the `input` option:
>
> ```ts
> await crawleeOne({ type: '...', input: { startUrls: ['https://...'] } });
> ```

## The problem

At scale, errors are inevitable. A site changes its layout, a server returns unexpected responses, or a configuration change introduces regressions. When you're scraping tens of thousands of entries daily, tracking errors through logs alone is unreliable -- they're easily lost or overlooked.

## The solution

CrawleeOne automatically records errors in a dedicated Apify Dataset. This provides:

- **Persistence** -- Errors are saved as structured data, not ephemeral log lines. They can be reviewed at any time.
- **Centralization** -- Multiple scrapers can write to the same error dataset, giving you a single view across all your crawlers.

Configure it with the `errorReportingDatasetId` input:

```json
{
  "errorReportingDatasetId": "REPORTING"
}
```

For more advanced error tracking, CrawleeOne also supports pluggable telemetry integrations (e.g. Sentry). See the [integrations guide](./integrations.md).
