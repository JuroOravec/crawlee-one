[**crawlee-one**](../README.md)

---

[crawlee-one](../README.md) / HttpResponse

# Interface: HttpResponse

Defined in: [packages/crawlee-one/src/types.ts:100](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/types.ts#L100)

When defining sample URLs in `route.sampleUrls` each item may include a response object.

In that case, no server request is made, and the response is returned directly.

## Example

```ts
const route: CrawleeOneRoute = {
  sampleUrls: [
    {
      request: { url: 'https://example.com' },
      response: { statusCode: 200, body: '...' },
    },
  ],
};
```

## Properties

### body

> **body**: `string` \| `Buffer`\<`ArrayBufferLike`\>

Defined in: [packages/crawlee-one/src/types.ts:103](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/types.ts#L103)

---

### headers?

> `optional` **headers**: `Record`\<`string`, `string`\>

Defined in: [packages/crawlee-one/src/types.ts:102](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/types.ts#L102)

---

### statusCode

> **statusCode**: `number`

Defined in: [packages/crawlee-one/src/types.ts:101](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/types.ts#L101)
