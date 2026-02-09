[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / CrawleeOneErrorHandlerInput

# Interface: CrawleeOneErrorHandlerInput

Defined in: packages/crawlee-one/src/lib/integrations/types.ts:305

Input passed to the error handler

## Properties

### error

> **error**: `Error`

Defined in: packages/crawlee-one/src/lib/integrations/types.ts:306

***

### log

> **log**: `Log` \| `null`

Defined in: packages/crawlee-one/src/lib/integrations/types.ts:311

***

### page

> **page**: `Page` \| `null`

Defined in: packages/crawlee-one/src/lib/integrations/types.ts:308

Page instance if we used PlaywrightCrawler

***

### url

> **url**: `string` \| `null`

Defined in: packages/crawlee-one/src/lib/integrations/types.ts:310

URL where the error happened. If not given URL is taken from the Page object
