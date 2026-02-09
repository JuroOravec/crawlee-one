[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / requestQueueSizeMonitor

# Function: requestQueueSizeMonitor()

> **requestQueueSizeMonitor**(`maxSize`, `options?`): `object`

Defined in: [packages/crawlee-one/src/lib/io/requestQueue.ts:24](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/io/requestQueue.ts#L24)

Semi-automatic monitoring of RequestQueue size. This is used for limiting the total of
entries scraped per run / RequestQueue:
- When RequestQueue reaches `maxSize`, then all remaining Requests are removed.
- Pass an array of items to `shortenToSize` to shorten the array to the size
  that still fits the RequestQueue.

By default uses Apify RequestQueue.

## Parameters

### maxSize

`number`

### options?

[`RequestQueueSizeMonitorOptions`](../interfaces/RequestQueueSizeMonitorOptions.md)

## Returns

`object`

### isFull()

> **isFull**: () => `Promise`\<`boolean`\>

#### Returns

`Promise`\<`boolean`\>

### isStale()

> **isStale**: () => `boolean`

#### Returns

`boolean`

### onValue()

> **onValue**: (`callback`) => () => `void` = `registerCallback`

#### Parameters

##### callback

`ValueCallback`\<`number`\>

#### Returns

> (): `void`

##### Returns

`void`

### refresh()

> **refresh**: () => `Promise`\<`number`\> = `refreshValue`

#### Returns

`Promise`\<`number`\>

### shortenToSize()

> **shortenToSize**: \<`T`\>(`arr`) => `Promise`\<`T`[]\>

#### Type Parameters

##### T

`T`

#### Parameters

##### arr

`T`[]

#### Returns

`Promise`\<`T`[]\>

### value()

> **value**: () => `number` \| `Promise`\<`number`\> \| `null` = `getValue`

#### Returns

`number` \| `Promise`\<`number`\> \| `null`
