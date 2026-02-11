[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / datasetSizeMonitor

# Function: datasetSizeMonitor()

> **datasetSizeMonitor**(`maxSize`, `options?`): `object`

Defined in: [packages/crawlee-one/src/lib/io/dataset.ts:70](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/io/dataset.ts#L70)

Semi-automatic monitoring of Dataset size. This is used in limiting the total of entries
scraped per run / Dataset:
- When Dataset reaches `maxSize`, then all remaining Requests
  in the RequestQueue are removed.
- Pass an array of items to `shortenToSize` to shorten the array to the size
  that still fits the Dataset.

By default uses Apify Dataset.

## Parameters

### maxSize

`number`

### options?

[`DatasetSizeMonitorOptions`](../interfaces/DatasetSizeMonitorOptions.md)

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
