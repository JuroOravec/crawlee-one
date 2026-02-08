[**crawlee-one**](../README.md) • **Docs**

***

[crawlee-one](../globals.md) / pushRequests

# Function: pushRequests()

> **pushRequests**\<`T`\>(`oneOrManyItems`, `options`?): `Promise`\<`unknown`[]\>

Similar to `Actor.openRequestQueue().addRequests`, but with extra features:

- Data can be sent elsewhere, not just to Apify. This is set by the `io` options. By default data is sent using Apify (cloud/local).
- Limit the max size of the RequestQueue. No requests are added when RequestQueue is at or above the limit.
- Transform and filter requests. Requests that did not pass the filter are not added to the RequestQueue.

## Type parameters

• **T** *extends* `Source`

## Parameters

• **oneOrManyItems**: `T` \| `T`[]

• **options?**: [`PushRequestsOptions`](../interfaces/PushRequestsOptions.md)\<`T`\>

## Returns

`Promise`\<`unknown`[]\>

## Source

[src/lib/io/pushRequests.ts:78](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/io/pushRequests.ts#L78)
