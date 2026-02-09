[**crawlee-one**](../README.md)

***

[crawlee-one](../globals.md) / pushRequests

# Function: pushRequests()

> **pushRequests**\<`T`\>(`oneOrManyItems`, `options?`): `Promise`\<`unknown`[]\>

Defined in: [src/lib/io/pushRequests.ts:78](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/io/pushRequests.ts#L78)

Similar to `Actor.openRequestQueue().addRequests`, but with extra features:

- Data can be sent elsewhere, not just to Apify. This is set by the `io` options. By default data is sent using Apify (cloud/local).
- Limit the max size of the RequestQueue. No requests are added when RequestQueue is at or above the limit.
- Transform and filter requests. Requests that did not pass the filter are not added to the RequestQueue.

## Type Parameters

### T

`T` *extends* `Source`

## Parameters

### oneOrManyItems

`T` | `T`[]

### options?

[`PushRequestsOptions`](../interfaces/PushRequestsOptions.md)\<`T`\>

## Returns

`Promise`\<`unknown`[]\>
