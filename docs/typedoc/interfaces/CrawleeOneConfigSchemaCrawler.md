[crawlee-one](../README.md) / [Exports](../modules.md) / CrawleeOneConfigSchemaCrawler

# Interface: CrawleeOneConfigSchemaCrawler

Part of the schema that defines a single crawler.

## Table of contents

### Properties

- [routes](CrawleeOneConfigSchemaCrawler.md#routes)
- [type](CrawleeOneConfigSchemaCrawler.md#type)

## Properties

### routes

• **routes**: `string`[]

#### Defined in

src/types/config.ts:37

___

### type

• **type**: ``"basic"`` \| ``"http"`` \| ``"cheerio"`` \| ``"jsdom"`` \| ``"playwright"`` \| ``"puppeteer"``

Crawler type - Each type is linked to a different Crawlee crawler class.
Different classes may use different technologies / stack for scraping.

E.g. type `cheerio` will use `CheerioCrawler` class.

#### Defined in

src/types/config.ts:36
