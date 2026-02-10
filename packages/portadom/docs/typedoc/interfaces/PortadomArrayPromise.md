[**portadom**](../README.md)

***

[portadom](../globals.md) / PortadomArrayPromise

# Interface: PortadomArrayPromise\<El\>

Defined in: [dom/types.ts:358](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/types.ts#L358)

Wrapper for a Promise that resolves to an Array of [Portadom](Portadom.md) instances. This allows us to chain
Portadom methods before the Promise is resolved.

## Type Parameters

### El

`El`

## Properties

### at()

> **at**: (...`args`) => [`PortadomPromise`](PortadomPromise.md)\<`El`\>

Defined in: [dom/types.ts:367](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/types.ts#L367)

Wrapper for Array.at that returns the resulting item as [PortadomPromise](PortadomPromise.md).

#### Parameters

##### args

...\[`number`\]

#### Returns

[`PortadomPromise`](PortadomPromise.md)\<`El`\>

***

### concat()

> **concat**: (...`args`) => `PortadomArrayPromise`\<`El`\>

Defined in: [dom/types.ts:373](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/types.ts#L373)

Wrapper for Array.concat that returns the resulting array wrapped in PortadomArrayPromise.

NOTE: The concat values are expected to be [Portadom](Portadom.md) instances

#### Parameters

##### args

...([`Portadom`](Portadom.md)\<`El`, `El`\> \| `ConcatArray`\<[`Portadom`](Portadom.md)\<`El`, `El`\>\>)[]

#### Returns

`PortadomArrayPromise`\<`El`\>

***

### copyWithin()

> **copyWithin**: (...`args`) => `PortadomArrayPromise`\<`El`\>

Defined in: [dom/types.ts:377](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/types.ts#L377)

Wrapper for Array.copyWithin that returns the resulting array wrapped in PortadomArrayPromise.

#### Parameters

##### args

...\[`number`, `number`, `number`\]

#### Returns

`PortadomArrayPromise`\<`El`\>

***

### entries()

> **entries**: (...`args`) => `Promise`\<`IterableIterator`\<\[`number`, [`Portadom`](Portadom.md)\<`El`, `El`\>\], `any`, `any`\>\>

Defined in: [dom/types.ts:383](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/types.ts#L383)

Wrapper for Array.entries.

NOTE: Does NOT return an instance of PortadomArrayPromise

#### Parameters

##### args

...\[\]

#### Returns

`Promise`\<`IterableIterator`\<\[`number`, [`Portadom`](Portadom.md)\<`El`, `El`\>\], `any`, `any`\>\>

***

### every()

> **every**: (...`args`) => `Promise`\<`boolean`\>

Defined in: [dom/types.ts:387](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/types.ts#L387)

Wrapper for Array.every.

#### Parameters

##### args

...\[(`value`, `index`, `array`) => `unknown`, `any`\]

#### Returns

`Promise`\<`boolean`\>

***

### fill()

> **fill**: \<`U`\>(...`args`) => `Promise`\<`U`[]\>

Defined in: [dom/types.ts:395](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/types.ts#L395)

Wrapper for Array.fill.

NOTE: Fill values can be anything, so result is NOT wrapped in an instance of PortadomArrayPromise.

NOTE2: Unlike Array.fill, this option doesn't allow to specify `start` and `end`.

#### Type Parameters

##### U

`U`

#### Parameters

##### args

...\[`U`\]

#### Returns

`Promise`\<`U`[]\>

***

### filter()

> **filter**: (...`args`) => `PortadomArrayPromise`\<`El`\>

Defined in: [dom/types.ts:399](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/types.ts#L399)

Wrapper for Array.filter that returns the resulting array wrapped in PortadomArrayPromise.

#### Parameters

##### args

...\[(`value`, `index`, `array`) => `unknown`, `any`\]

#### Returns

`PortadomArrayPromise`\<`El`\>

***

### filterAsyncParallel()

> **filterAsyncParallel**: (...`args`) => `PortadomArrayPromise`\<`El`\>

Defined in: [dom/types.ts:543](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/types.ts#L543)

Similar to Array.filter, but awaits for Promises. Items are handled all in parallel.

Returns the resulting array wrapped in PortadomArrayPromise.

#### Parameters

##### args

...\[(`value`, `index`) => `any`\]

#### Returns

`PortadomArrayPromise`\<`El`\>

***

### filterAsyncSerial()

> **filterAsyncSerial**: (...`args`) => `PortadomArrayPromise`\<`El`\>

Defined in: [dom/types.ts:534](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/types.ts#L534)

Similar to Array.filter, but awaits for Promises. Items are handled one-by-one.

Returns the resulting array wrapped in PortadomArrayPromise.

#### Parameters

##### args

...\[(`value`, `index`) => `any`\]

#### Returns

`PortadomArrayPromise`\<`El`\>

***

### find()

> **find**: (...`args`) => [`PortadomPromise`](PortadomPromise.md)\<`El`\>

Defined in: [dom/types.ts:401](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/types.ts#L401)

Wrapper for Array.find that returns the resulting item as [PortadomPromise](PortadomPromise.md).

#### Parameters

##### args

...\[(`value`, `index`, `obj`) => `unknown`, `any`\]

#### Returns

[`PortadomPromise`](PortadomPromise.md)\<`El`\>

***

### findAsyncSerial()

> **findAsyncSerial**: (...`args`) => [`PortadomPromise`](PortadomPromise.md)\<`El`\>

Defined in: [dom/types.ts:552](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/types.ts#L552)

Similar to Array.find, but awaits for Promises. Items are handled one-by-one.

Returns the resulting item as [PortadomPromise](PortadomPromise.md).

#### Parameters

##### args

...\[(`value`, `index`) => `any`\]

#### Returns

[`PortadomPromise`](PortadomPromise.md)\<`El`\>

***

### findIndex()

> **findIndex**: (...`args`) => `Promise`\<`number`\>

Defined in: [dom/types.ts:403](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/types.ts#L403)

Wrapper for Array.findIndex.

#### Parameters

##### args

...\[(`value`, `index`, `obj`) => `unknown`, `any`\]

#### Returns

`Promise`\<`number`\>

***

### flat()

> **flat**: (...`args`) => `PortadomArrayPromise`\<`El`\>

Defined in: [dom/types.ts:405](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/types.ts#L405)

Wrapper for Array.flat that returns the resulting array wrapped in PortadomArrayPromise.

#### Parameters

##### args

...\[`number`\]

#### Returns

`PortadomArrayPromise`\<`El`\>

***

### flatMap()

> **flatMap**: \<`U`, `This`\>(...`args`) => `Promise`\<`U`[]\>

Defined in: [dom/types.ts:411](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/types.ts#L411)

Wrapper for Array.flatMap.

NOTE: Mapped values can be anything, so result is NOT wrapped in an instance of PortadomArrayPromise

#### Type Parameters

##### U

`U`

##### This

`This` = `undefined`

#### Parameters

##### args

...\[(`this`, `value`, `index`, `array`) => `U` \| readonly `U`[], `This`\]

#### Returns

`Promise`\<`U`[]\>

***

### forEach()

> **forEach**: (...`args`) => `Promise`\<`void`\>

Defined in: [dom/types.ts:416](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/types.ts#L416)

Wrapper for Array.forEach.

#### Parameters

##### args

...\[(`value`, `index`, `array`) => `void`, `any`\]

#### Returns

`Promise`\<`void`\>

***

### forEachAsyncParallel()

> **forEachAsyncParallel**: (...`args`) => `Promise`\<`void`\>

Defined in: [dom/types.ts:507](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/types.ts#L507)

Similar to Array.forEach, but awaits for Promises. Items are handled all in parallel.

#### Parameters

##### args

...\[(`value`, `index`) => `MaybePromise`\<`void`\>\]

#### Returns

`Promise`\<`void`\>

***

### forEachAsyncSerial()

> **forEachAsyncSerial**: (...`args`) => `Promise`\<`void`\>

Defined in: [dom/types.ts:500](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/types.ts#L500)

Similar to Array.forEach, but awaits for Promises. Items are handled one-by-one.

#### Parameters

##### args

...\[(`value`, `index`) => `MaybePromise`\<`void`\>\]

#### Returns

`Promise`\<`void`\>

***

### includes()

> **includes**: (...`args`) => `Promise`\<`boolean`\>

Defined in: [dom/types.ts:418](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/types.ts#L418)

Wrapper for Array.includes.

#### Parameters

##### args

...\[[`Portadom`](Portadom.md)\<`El`, `El`\>, `number`\]

#### Returns

`Promise`\<`boolean`\>

***

### indexOf()

> **indexOf**: (...`args`) => `Promise`\<`number`\>

Defined in: [dom/types.ts:420](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/types.ts#L420)

Wrapper for Array.indexOf.

#### Parameters

##### args

...\[[`Portadom`](Portadom.md)\<`El`, `El`\>, `number`\]

#### Returns

`Promise`\<`number`\>

***

### join()

> **join**: (...`args`) => `Promise`\<`string`\>

Defined in: [dom/types.ts:422](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/types.ts#L422)

Wrapper for Array.join.

#### Parameters

##### args

...\[`string`\]

#### Returns

`Promise`\<`string`\>

***

### keys()

> **keys**: (...`args`) => `Promise`\<`IterableIterator`\<`number`, `any`, `any`\>\>

Defined in: [dom/types.ts:424](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/types.ts#L424)

Wrapper for Array.keys.

#### Parameters

##### args

...\[\]

#### Returns

`Promise`\<`IterableIterator`\<`number`, `any`, `any`\>\>

***

### lastIndexOf()

> **lastIndexOf**: (...`args`) => `Promise`\<`number`\>

Defined in: [dom/types.ts:426](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/types.ts#L426)

Wrapper for Array.lastIndexOf.

#### Parameters

##### args

...\[[`Portadom`](Portadom.md)\<`El`, `El`\>, `number`\]

#### Returns

`Promise`\<`number`\>

***

### length

> **length**: `Promise`\<`number`\>

Defined in: [dom/types.ts:428](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/types.ts#L428)

Wrapper for Array.length.

***

### map()

> **map**: \<`U`\>(...`args`) => `Promise`\<`U`[]\>

Defined in: [dom/types.ts:434](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/types.ts#L434)

Wrapper for Array.map.

NOTE: Mapped values can be anything, so result is NOT wrapped in an instance of PortadomArrayPromise

#### Type Parameters

##### U

`U`

#### Parameters

##### args

...\[(`value`, `index`, `array`) => `U`, `any`\]

#### Returns

`Promise`\<`U`[]\>

***

### mapAsyncParallel()

> **mapAsyncParallel**: \<`TVal`\>(...`args`) => `Promise`\<`Awaited`\<`TVal`\>[]\>

Defined in: [dom/types.ts:525](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/types.ts#L525)

Similar to Array.map, but awaits for Promises. Items are handled all in parallel.

NOTE: Mapped values can be anything, so result is NOT wrapped in an instance of PortadomArrayPromise

#### Type Parameters

##### TVal

`TVal`

#### Parameters

##### args

...\[(`value`, `index`) => `MaybePromise`\<`TVal`\>\]

#### Returns

`Promise`\<`Awaited`\<`TVal`\>[]\>

***

### mapAsyncSerial()

> **mapAsyncSerial**: \<`TVal`\>(...`args`) => `Promise`\<`Awaited`\<`TVal`\>[]\>

Defined in: [dom/types.ts:516](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/types.ts#L516)

Similar to Array.map, but awaits for Promises. Items are handled one-by-one.

NOTE: Mapped values can be anything, so result is NOT wrapped in an instance of PortadomArrayPromise

#### Type Parameters

##### TVal

`TVal`

#### Parameters

##### args

...\[(`value`, `index`) => `MaybePromise`\<`TVal`\>\]

#### Returns

`Promise`\<`Awaited`\<`TVal`\>[]\>

***

### pop()

> **pop**: (...`args`) => [`PortadomPromise`](PortadomPromise.md)\<`El`\>

Defined in: [dom/types.ts:439](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/types.ts#L439)

Wrapper for Array.pop that returns the resulting item as [PortadomPromise](PortadomPromise.md).

#### Parameters

##### args

...\[\]

#### Returns

[`PortadomPromise`](PortadomPromise.md)\<`El`\>

***

### promise

> **promise**: `Promise`\<[`Portadom`](Portadom.md)\<`El`, `El`\>[]\>

Defined in: [dom/types.ts:360](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/types.ts#L360)

Wrapped Promise of an array of [Portadom](Portadom.md) instances

***

### push()

> **push**: (...`args`) => `Promise`\<`number`\>

Defined in: [dom/types.ts:445](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/types.ts#L445)

Wrapper for Array.push.

NOTE: The pushed values are expected to be [Portadom](Portadom.md) instances.

#### Parameters

##### args

...[`Portadom`](Portadom.md)\<`El`, `El`\>[]

#### Returns

`Promise`\<`number`\>

***

### reverse()

> **reverse**: (...`args`) => `PortadomArrayPromise`\<`El`\>

Defined in: [dom/types.ts:465](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/types.ts#L465)

Wrapper for Array.reverse that returns the resulting array wrapped in PortadomArrayPromise.

#### Parameters

##### args

...\[\]

#### Returns

`PortadomArrayPromise`\<`El`\>

***

### shift()

> **shift**: (...`args`) => [`PortadomPromise`](PortadomPromise.md)\<`El`\>

Defined in: [dom/types.ts:467](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/types.ts#L467)

Wrapper for Array.shift that returns the resulting item as [PortadomPromise](PortadomPromise.md).

#### Parameters

##### args

...\[\]

#### Returns

[`PortadomPromise`](PortadomPromise.md)\<`El`\>

***

### slice()

> **slice**: (...`args`) => `PortadomArrayPromise`\<`El`\>

Defined in: [dom/types.ts:471](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/types.ts#L471)

Wrapper for Array.slice that returns the resulting array wrapped in PortadomArrayPromise.

#### Parameters

##### args

...\[`number`, `number`\]

#### Returns

`PortadomArrayPromise`\<`El`\>

***

### some()

> **some**: (...`args`) => `Promise`\<`boolean`\>

Defined in: [dom/types.ts:473](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/types.ts#L473)

Wrapper for Array.some.

#### Parameters

##### args

...\[(`value`, `index`, `array`) => `unknown`, `any`\]

#### Returns

`Promise`\<`boolean`\>

***

### sort()

> **sort**: (...`args`) => `PortadomArrayPromise`\<`El`\>

Defined in: [dom/types.ts:477](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/types.ts#L477)

Wrapper for Array.sort that returns the resulting array wrapped in PortadomArrayPromise.

#### Parameters

##### args

...\[(`a`, `b`) => `number`\]

#### Returns

`PortadomArrayPromise`\<`El`\>

***

### splice()

> **splice**: (...`args`) => `PortadomArrayPromise`\<`El`\>

Defined in: [dom/types.ts:481](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/types.ts#L481)

Wrapper for Array.splice that returns the resulting array wrapped in PortadomArrayPromise.

#### Parameters

##### args

...\[`number`, `number`, `...items: Portadom<El, El>[]`\]

#### Returns

`PortadomArrayPromise`\<`El`\>

***

### unshift()

> **unshift**: (...`args`) => `Promise`\<`number`\>

Defined in: [dom/types.ts:487](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/types.ts#L487)

Wrapper for Array.unshift.

NOTE: The added values are expected to be [Portadom](Portadom.md) instances.

#### Parameters

##### args

...[`Portadom`](Portadom.md)\<`El`, `El`\>[]

#### Returns

`Promise`\<`number`\>

***

### values()

> **values**: (...`args`) => `Promise`\<`IterableIterator`\<[`Portadom`](Portadom.md)\<`El`, `El`\>, `any`, `any`\>\>

Defined in: [dom/types.ts:489](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/types.ts#L489)

NOTE: Does NOT return an instance of PortadomArrayPromise

#### Parameters

##### args

...\[\]

#### Returns

`Promise`\<`IterableIterator`\<[`Portadom`](Portadom.md)\<`El`, `El`\>, `any`, `any`\>\>

## Methods

### reduce()

#### Call Signature

> **reduce**(`callbackfn`): `Promise`\<[`Portadom`](Portadom.md)\<`El`, `El`\>\>

Defined in: [dom/types.ts:451](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/types.ts#L451)

Wrapper for Array.reduce.

NOTE: The reduce value can be anything, so result is NOT wrapped in an instance of PortadomArrayPromise

##### Parameters

###### callbackfn

(`previousValue`, `currentValue`, `currentIndex`, `array`) => [`Portadom`](Portadom.md)\<`El`\>

##### Returns

`Promise`\<[`Portadom`](Portadom.md)\<`El`, `El`\>\>

#### Call Signature

> **reduce**(`callbackfn`, `initialValue`): `Promise`\<[`Portadom`](Portadom.md)\<`El`, `El`\>\>

Defined in: [dom/types.ts:452](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/types.ts#L452)

##### Parameters

###### callbackfn

(`previousValue`, `currentValue`, `currentIndex`, `array`) => [`Portadom`](Portadom.md)\<`El`\>

###### initialValue

[`Portadom`](Portadom.md)\<`El`\>

##### Returns

`Promise`\<[`Portadom`](Portadom.md)\<`El`, `El`\>\>

#### Call Signature

> **reduce**\<`U`\>(`callbackfn`, `initialValue`): `Promise`\<`U`\>

Defined in: [dom/types.ts:453](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/types.ts#L453)

##### Type Parameters

###### U

`U`

##### Parameters

###### callbackfn

(`previousValue`, `currentValue`, `currentIndex`, `array`) => `U`

###### initialValue

`U`

##### Returns

`Promise`\<`U`\>

***

### reduceRight()

#### Call Signature

> **reduceRight**(`callbackfn`): `Promise`\<[`Portadom`](Portadom.md)\<`El`, `El`\>\>

Defined in: [dom/types.ts:459](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/types.ts#L459)

Wrapper for Array.reduceRight.

NOTE: The reduce value can be anything, so result is NOT wrapped in an instance of PortadomArrayPromise

##### Parameters

###### callbackfn

(`previousValue`, `currentValue`, `currentIndex`, `array`) => [`Portadom`](Portadom.md)\<`El`\>

##### Returns

`Promise`\<[`Portadom`](Portadom.md)\<`El`, `El`\>\>

#### Call Signature

> **reduceRight**(`callbackfn`, `initialValue`): `Promise`\<[`Portadom`](Portadom.md)\<`El`, `El`\>\>

Defined in: [dom/types.ts:460](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/types.ts#L460)

##### Parameters

###### callbackfn

(`previousValue`, `currentValue`, `currentIndex`, `array`) => [`Portadom`](Portadom.md)\<`El`\>

###### initialValue

[`Portadom`](Portadom.md)\<`El`\>

##### Returns

`Promise`\<[`Portadom`](Portadom.md)\<`El`, `El`\>\>

#### Call Signature

> **reduceRight**\<`U`\>(`callbackfn`, `initialValue`): `Promise`\<`U`\>

Defined in: [dom/types.ts:461](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/types.ts#L461)

##### Type Parameters

###### U

`U`

##### Parameters

###### callbackfn

(`previousValue`, `currentValue`, `currentIndex`, `array`) => `U`

###### initialValue

`U`

##### Returns

`Promise`\<`U`\>
