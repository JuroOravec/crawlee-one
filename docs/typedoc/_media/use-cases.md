# Use Cases

CrawleeOne scrapers are highly configurable via their `input` field. Below is an overview of the use cases that come built in. Each links to a detailed guide with examples.

| # | Use case | What it solves | Guide |
|---|----------|----------------|-------|
| 1 | **Import URLs** | Load starting URLs from a database, Apify Dataset, or custom function -- no separate loader script needed. | [Guide](./playbook-01-import-urls.md) |
| 2 | **Proxy** | Avoid rate limiting and geo-blocking with configurable proxy settings. | [Guide](./playbook-02-proxy.md) |
| 3 | **Simple transforms** | Rename fields, select columns, and limit entry count -- directly from the UI, no code required. | [Guide](./playbook-03-results-mapping-simple.md) |
| 4 | **Advanced transforms** | Custom functions for enrichment, computed fields, and cross-entry aggregation. | [Guide](./playbook-04-results-mapping-advanced.md) |
| 5 | **Result filtering** | Include or exclude entries based on conditions to reduce dataset size and storage costs. | [Guide](./playbook-05-results-filtering.md) |
| 6 | **Request filtering** | Filter and transform URLs before scraping to avoid wasting time on unwanted pages. | [Guide](./playbook-06-requests-mapping-filtering.md) |
| 7 | **Caching** | Incremental scraping -- only process new entries or skip previously-seen ones. | [Guide](./playbook-07-caching.md) |
| 8 | **Settings & performance** | Tune concurrency, retries, timeouts, and batching without code changes. | [Guide](./playbook-08-settings-performance.md) |
| 9 | **Data pipelines** | Chain scrapers together with metamorph -- the downstream actor shares the same datasets. | [Guide](./playbook-09-data-pipelines-metamorph.md) |
| 10 | **Privacy compliance** | Toggle personal data inclusion with a single flag. PII fields are redacted automatically. | [Guide](./playbook-10-privacy-compliance.md) |
| 11 | **Error capture** | Errors are saved to a dedicated dataset for centralized monitoring across scrapers. | [Guide](./playbook-11-errors.md) |
| 12 | **Source control** | Import scraper configuration from a remote URL or source control to keep multiple instances in sync. | [Guide](./playbook-12-source-control.md) |

## Related

- [Features overview](./features.md) -- full catalog of CrawleeOne capabilities.
- [Input reference](./reference-input.md) -- all available input fields.
