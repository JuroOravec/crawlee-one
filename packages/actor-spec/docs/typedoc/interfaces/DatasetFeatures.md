[**actor-spec**](../README.md)

***

[actor-spec](../globals.md) / DatasetFeatures

# Interface: DatasetFeatures

Defined in: [actorSpec.ts:176](https://github.com/JuroOravec/crawlee-one/blob/main/packages/actor-spec/src/types/actorSpec.ts#L176)

Describes what features a given dataset has in a binary
yes/no manner.

## Properties

### changeMonitoring

> **changeMonitoring**: `boolean`

Defined in: [actorSpec.ts:225](https://github.com/JuroOravec/crawlee-one/blob/main/packages/actor-spec/src/types/actorSpec.ts#L225)

Whether the scraper detects and notifies on changes to its own
schema changes, or when the scraped website / API changes.

***

### configurable

> **configurable**: `boolean`

Defined in: [actorSpec.ts:195](https://github.com/JuroOravec/crawlee-one/blob/main/packages/actor-spec/src/types/actorSpec.ts#L195)

Whether the way the scraper works can be configured -
e.g. retry strategy, rate limiting, etc.

***

### downstreamAutomation

> **downstreamAutomation**: `boolean`

Defined in: [actorSpec.ts:231](https://github.com/JuroOravec/crawlee-one/blob/main/packages/actor-spec/src/types/actorSpec.ts#L231)

Whether the scraper supports some way to configure
automation / integration that's triggered after the
scraper has finished.

***

### errorMonitoring

> **errorMonitoring**: `boolean`

Defined in: [actorSpec.ts:220](https://github.com/JuroOravec/crawlee-one/blob/main/packages/actor-spec/src/types/actorSpec.ts#L220)

Whether the scraper captures and reports errors.

***

### integratedCache

> **integratedCache**: `boolean`

Defined in: [actorSpec.ts:218](https://github.com/JuroOravec/crawlee-one/blob/main/packages/actor-spec/src/types/actorSpec.ts#L218)

Whether the scraper offers a cache that can persist info on scraped entries
across different scraper runs.

Such cache allows for use cases like scraping only NEW entries.

***

### integratedETL

> **integratedETL**: `boolean`

Defined in: [actorSpec.ts:211](https://github.com/JuroOravec/crawlee-one/blob/main/packages/actor-spec/src/types/actorSpec.ts#L211)

Whether the scraper offers a way to filter and modify the scraped
data out of the box, without needing other tools.

***

### limitResultsCount

> **limitResultsCount**: `boolean`

Defined in: [actorSpec.ts:181](https://github.com/JuroOravec/crawlee-one/blob/main/packages/actor-spec/src/types/actorSpec.ts#L181)

Whether the scraper can be configured to extract only a certain
number of results.

***

### privacyCompliance

> **privacyCompliance**: `boolean`

Defined in: [actorSpec.ts:206](https://github.com/JuroOravec/crawlee-one/blob/main/packages/actor-spec/src/types/actorSpec.ts#L206)

Whether the scraper complies with data / privacy
regulations, e.g. that personal data is omitted or
redacted by default.

***

### proxySupport

> **proxySupport**: `boolean`

Defined in: [actorSpec.ts:190](https://github.com/JuroOravec/crawlee-one/blob/main/packages/actor-spec/src/types/actorSpec.ts#L190)

Whether the scraper allows to configure proxy.

***

### regularlyTested

> **regularlyTested**: `boolean`

Defined in: [actorSpec.ts:200](https://github.com/JuroOravec/crawlee-one/blob/main/packages/actor-spec/src/types/actorSpec.ts#L200)

Whether the scraper is tested on regular basis,
e.g. once per day or week.

***

### usesBrowser

> **usesBrowser**: `boolean`

Defined in: [actorSpec.ts:188](https://github.com/JuroOravec/crawlee-one/blob/main/packages/actor-spec/src/types/actorSpec.ts#L188)

Whether the scraper needs browser (e.g. using Playwright or Puppeteer)
to interact with the browser.

Scrapers that don't use browser may be faster.
