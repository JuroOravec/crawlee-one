[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / SampleUrlItem

# Type Alias: SampleUrlItem

> **SampleUrlItem** = [`CrawlerUrl`](CrawlerUrl.md) \| \{ `request`: [`CrawlerUrl`](CrawlerUrl.md); `response`: [`HttpResponse`](../interfaces/HttpResponse.md); \}

Defined in: [packages/crawlee-one/src/types.ts:120](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/types.ts#L120)

Single entry in `route.sampleUrls` array.

Can be URL string, RequestOptions-like object, or pre-loaded `{ request, response }` pair.

## Example

```ts
const route: CrawleeOneRoute = {
  sampleUrls: [
    'https://example.com',
    { url: 'https://example.com/page/2' },
    { request: { url: 'https://example.com/page/3' }, response: { statusCode: 200, body: '...' } }
  ],
};
```
