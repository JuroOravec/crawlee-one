[**crawlee-one**](../README.md)

***

[crawlee-one](../globals.md) / CrawleeOneErrorHandlerInput

# Interface: CrawleeOneErrorHandlerInput

Defined in: [src/lib/integrations/types.ts:305](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/integrations/types.ts#L305)

Input passed to the error handler

## Properties

### error

> **error**: `Error`

Defined in: [src/lib/integrations/types.ts:306](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/integrations/types.ts#L306)

***

### log

> **log**: `Log` \| `null`

Defined in: [src/lib/integrations/types.ts:311](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/integrations/types.ts#L311)

***

### page

> **page**: `Page` \| `null`

Defined in: [src/lib/integrations/types.ts:308](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/integrations/types.ts#L308)

Page instance if we used PlaywrightCrawler

***

### url

> **url**: `string` \| `null`

Defined in: [src/lib/integrations/types.ts:310](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/integrations/types.ts#L310)

URL where the error happened. If not given URL is taken from the Page object
