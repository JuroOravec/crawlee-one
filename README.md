# Crawlee One

_The crawler template you can't refuse._

Crawlee One is a framework built on top of Crawlee and Apify\* for writing robust and highly configurable web scrapers.

Crawlee One should be your choice if:

- You're developing a long-lasting integration.
- Or your scraper will be part of a data pipeline.
- Or you wish to make your scrapers available to others in your team / org, whether it's programmatically or via Apify UI.

Conversely, Crawlee One is NOT suitable for:

- People not familiar with web scraping or Apify
- One-off data extractions

[Read here](./docs/scraping-workflow-summary.md) for the recap of how Crawlee and Apify work.

## Use cases

Web crawlers written with Crawlee One can be configured via their input to handle following advanced use cases:

- [1. Import URLs to scrape from your database (or elsewhere)](./docs/playbook-01-import-urls.md)
- [2. Proxy: Avoid rate limiting and geo-blocking](./docs/playbook-02-proxy.md)
- [3. Simple transformations: Select and rename columns, set how many entries to scrape](./docs/playbook-03-results-mapping-simple.md)
- [4. Advanced transformations & aggregations](./docs/playbook-04-results-mapping-advanced.md)
- [5. Filtering results](./docs/playbook-05-results-filtering.md)
- [6. Deciding what URLs to scrape: Filtering and transforming requests](./docs/playbook-06-requests-mapping-filtering.md)
- [7. Caching: Extract only new or only previously-seen entries](./docs/playbook-07-caching.md)
- [8. Configure crawler settings and performance](./docs/playbook-08-settings-performance.md)
- [9. Create data pipelines from scrapers using metamorph](./docs/playbook-09-data-pipelines-metamorph.md)
- [10. Privacy compliance: Include or omit personal data](./docs/playbook-10-privacy-compliance.md)
- [11. Capture errors](./docs/playbook-11-errors.md)
- [12. Source control: Keep scraper configuration in sync](./docs/playbook-12-source-control.md)

## Library contents

Crawlee One includes a set of utility functions for:

- Actor boilterplating
  - Allows to set crawler settings from Apify input
  - Enrich data with metadata
  - Configure logging level
  - Routing
  - Error handling
    - Save errors to separate Apify dataset
    - Send errors to Sentry
- Testing actors
- Manipulating DOM
- Actor migration (conceptually similar to database migration)
  - CLI utility for updating actors via apify-client
- Apify's `actor.json` generation
- Privacy compliance
- Metamorphing

## Actor Input Reference

[See here](./docs/reference-input.md) the full list of all possible input options that a Crawlee One crawler can have.

Crawlee One allows you to configure the following via the input:

- [Programmatically-defined input](./docs/reference-input.md#programmatic-input-advanced)
- [Starting URLs](./docs/reference-input.md#starting-urls)
- [Proxy](./docs/reference-input.md#proxy)
- [Privacy & Data governance (GDPR)](./docs/reference-input.md#privacy--data-governance-gdpr)
- [Requests limit, transformation & filtering](./docs/reference-input.md#requests-limit-transformation--filtering-advanced)
- [Output size, transformation & filtering (T in ETL)](./docs/reference-input.md#output-size-transformation--filtering-t-in-etl-advanced)
- [Output Dataset & Caching (L in ETL)](./docs/reference-input.md#output-dataset--caching-l-in-etl-advanced)
- [Crawler configuration](./docs/reference-input.md#crawler-configuration-advanced)
- [Performance configuration](./docs/reference-input.md#performance-configuration-advanced)
- [Logging & Error handling](./docs/reference-input.md#logging--error-handling-advanced)
- [Integrations (Metamorphing)](./docs/reference-input.md#integrations-metamorphing-advanced)

## Example project

TODO

---

\* Apify can be replaced with your own implementation, so the data can be sent elsewhere, not just to Apify. This is set by the `io` options.
