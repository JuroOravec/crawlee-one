[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / pushRequests

# Function: pushRequests()

> **pushRequests**\<`T`\>(`oneOrManyItems`, `options?`): `Promise`\<`unknown`[]\>

Defined in: [packages/crawlee-one/src/lib/io/pushRequests.ts:78](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/io/pushRequests.ts#L78)

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
