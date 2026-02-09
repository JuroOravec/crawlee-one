[**crawlee-one**](../README.md)

***

[crawlee-one](../globals.md) / datasetSizeMonitor

# Function: datasetSizeMonitor()

> **datasetSizeMonitor**(`maxSize`, `options?`): `object`

Defined in: [src/lib/io/dataset.ts:94](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/io/dataset.ts#L94)

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
