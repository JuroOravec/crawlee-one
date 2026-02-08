[**crawlee-one**](../README.md) • **Docs**

***

[crawlee-one](../globals.md) / CrawleeOneErrorHandlerInput

# Interface: CrawleeOneErrorHandlerInput

Input passed to the error handler

## Properties

### error

> **error**: `Error`

#### Source

[src/lib/integrations/types.ts:306](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/integrations/types.ts#L306)

***

### log

> **log**: `null` \| `Log`

#### Source

[src/lib/integrations/types.ts:311](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/integrations/types.ts#L311)

***

### page

> **page**: `null` \| `Page`

Page instance if we used PlaywrightCrawler

#### Source

[src/lib/integrations/types.ts:308](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/integrations/types.ts#L308)

***

### url

> **url**: `null` \| `string`

URL where the error happened. If not given URL is taken from the Page object

#### Source

[src/lib/integrations/types.ts:310](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/integrations/types.ts#L310)
