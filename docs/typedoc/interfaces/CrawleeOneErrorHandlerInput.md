[crawlee-one](../README.md) / [Exports](../modules.md) / CrawleeOneErrorHandlerInput

# Interface: CrawleeOneErrorHandlerInput

Input passed to the error handler

## Table of contents

### Properties

- [error](CrawleeOneErrorHandlerInput.md#error)
- [log](CrawleeOneErrorHandlerInput.md#log)
- [page](CrawleeOneErrorHandlerInput.md#page)
- [url](CrawleeOneErrorHandlerInput.md#url)

## Properties

### error

• **error**: `Error`

#### Defined in

[src/lib/integrations/types.ts:306](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/integrations/types.ts#L306)

___

### log

• **log**: ``null`` \| `Log`

#### Defined in

[src/lib/integrations/types.ts:311](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/integrations/types.ts#L311)

___

### page

• **page**: ``null`` \| `Page`

Page instance if we used PlaywrightCrawler

#### Defined in

[src/lib/integrations/types.ts:308](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/integrations/types.ts#L308)

___

### url

• **url**: ``null`` \| `string`

URL where the error happened. If not given URL is taken from the Page object

#### Defined in

[src/lib/integrations/types.ts:310](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/integrations/types.ts#L310)
