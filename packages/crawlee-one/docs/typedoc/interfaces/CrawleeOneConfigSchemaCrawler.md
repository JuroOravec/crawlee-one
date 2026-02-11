[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / CrawleeOneConfigSchemaCrawler

# Interface: CrawleeOneConfigSchemaCrawler

Defined in: [packages/crawlee-one/src/types/config.ts:194](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/types/config.ts#L194)

Part of the schema that defines a single crawler.

## Properties

### routes

> **routes**: `string`[]

Defined in: [packages/crawlee-one/src/types/config.ts:202](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/types/config.ts#L202)

***

### type

> **type**: `"basic"` \| `"http"` \| `"jsdom"` \| `"cheerio"` \| `"playwright"` \| `"adaptive-playwright"` \| `"puppeteer"`

Defined in: [packages/crawlee-one/src/types/config.ts:201](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/types/config.ts#L201)

Crawler type - Each type is linked to a different Crawlee crawler class.
Different classes may use different technologies / stack for scraping.

E.g. type `cheerio` will use `CheerioCrawler` class.
