[**crawlee-one**](../README.md)

***

[crawlee-one](../globals.md) / CrawleeOneConfigSchemaCrawler

# Interface: CrawleeOneConfigSchemaCrawler

Defined in: [src/types/config.ts:29](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/types/config.ts#L29)

Part of the schema that defines a single crawler.

## Properties

### routes

> **routes**: `string`[]

Defined in: [src/types/config.ts:37](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/types/config.ts#L37)

***

### type

> **type**: `"basic"` \| `"http"` \| `"jsdom"` \| `"cheerio"` \| `"playwright"` \| `"adaptive-playwright"` \| `"puppeteer"`

Defined in: [src/types/config.ts:36](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/types/config.ts#L36)

Crawler type - Each type is linked to a different Crawlee crawler class.
Different classes may use different technologies / stack for scraping.

E.g. type `cheerio` will use `CheerioCrawler` class.
