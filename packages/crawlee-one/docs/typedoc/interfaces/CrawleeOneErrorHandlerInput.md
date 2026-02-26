[**crawlee-one**](../README.md)

---

[crawlee-one](../README.md) / CrawleeOneErrorHandlerInput

# Interface: CrawleeOneErrorHandlerInput

Defined in: [packages/crawlee-one/src/lib/integrations/types.ts:317](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/integrations/types.ts#L317)

Input passed to the error handler

## Properties

### error

> **error**: `Error`

Defined in: [packages/crawlee-one/src/lib/integrations/types.ts:318](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/integrations/types.ts#L318)

---

### log

> **log**: `Log` \| `null`

Defined in: [packages/crawlee-one/src/lib/integrations/types.ts:323](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/integrations/types.ts#L323)

---

### page

> **page**: `Page` \| `null`

Defined in: [packages/crawlee-one/src/lib/integrations/types.ts:320](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/integrations/types.ts#L320)

Page instance if we used PlaywrightCrawler

---

### url

> **url**: `string` \| `null`

Defined in: [packages/crawlee-one/src/lib/integrations/types.ts:322](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/integrations/types.ts#L322)

URL where the error happened. If not given URL is taken from the Page object
