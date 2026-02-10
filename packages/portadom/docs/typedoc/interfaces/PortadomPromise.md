[**portadom**](../README.md)

***

[portadom](../globals.md) / PortadomPromise

# Interface: PortadomPromise\<El\>

Defined in: [dom/types.ts:123](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/types.ts#L123)

Wrapper for a Promise that resolves to a [Portadom](Portadom.md) instance. This allows us to chain
Portadom methods before the Promise is resolved.

Example:

```js
const dom = Promise.resolve(browserPortadom({}));
```

Instead of:
```js
const resA = await (await dom).findOne('..');
const resB = await (await dom).text();
```

You can call:
```js
const domP = createPortadomPromise(dom);
const resA = await domP.findOne('..');
const resB = await domP.text();
```

## Type Parameters

### El

`El`

## Properties

### attr()

> **attr**: (...`args`) => `Promise`\<`string` \| `null`\>

Defined in: [dom/types.ts:148](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/types.ts#L148)

Get element's attribute

#### Parameters

##### args

...\[`string`, `object`\]

#### Returns

`Promise`\<`string` \| `null`\>

***

### attrs()

> **attrs**: \<`Attrs`\>(...`args`) => `Promise`\<`Record`\<`string`, `string` \| `null`\> \| `null`\>

Defined in: [dom/types.ts:152](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/types.ts#L152)

Get element's attributes

#### Type Parameters

##### Attrs

`Attrs` *extends* `string`

#### Parameters

##### args

...\[`Attrs`[], `object`\]

#### Returns

`Promise`\<`Record`\<`string`, `string` \| `null`\> \| `null`\>

***

### children()

> **children**: \<`TFindEl`\>(...`args`) => [`PortadomArrayPromise`](PortadomArrayPromise.md)\<`TFindEl`\>

Defined in: [dom/types.ts:193](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/types.ts#L193)

Get element's children

#### Type Parameters

##### TFindEl

`TFindEl` = `El`

#### Parameters

##### args

...\[\]

#### Returns

[`PortadomArrayPromise`](PortadomArrayPromise.md)\<`TFindEl`\>

***

### closest()

> **closest**: \<`TFindEl`\>(...`args`) => `PortadomPromise`\<`TFindEl`\>

Defined in: [dom/types.ts:189](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/types.ts#L189)

Get a single ancestor (or itself) matching the selector

#### Type Parameters

##### TFindEl

`TFindEl` = `El`

#### Parameters

##### args

...\[`string`\]

#### Returns

`PortadomPromise`\<`TFindEl`\>

***

### findMany()

> **findMany**: \<`TFindEl`\>(...`args`) => [`PortadomArrayPromise`](PortadomArrayPromise.md)\<`TFindEl`\>

Defined in: [dom/types.ts:185](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/types.ts#L185)

Get all descendants matching the selector

#### Type Parameters

##### TFindEl

`TFindEl` = `El`

#### Parameters

##### args

...\[`string`\]

#### Returns

[`PortadomArrayPromise`](PortadomArrayPromise.md)\<`TFindEl`\>

***

### findOne()

> **findOne**: \<`TFindEl`\>(...`args`) => `PortadomPromise`\<`TFindEl`\>

Defined in: [dom/types.ts:183](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/types.ts#L183)

Get a single descendant matching the selector

#### Type Parameters

##### TFindEl

`TFindEl` = `El`

#### Parameters

##### args

...\[`string`\]

#### Returns

`PortadomPromise`\<`TFindEl`\>

***

### getCommonAncestor()

> **getCommonAncestor**: \<`TFindEl`\>(...`args`) => `PortadomPromise`\<`TFindEl`\>

Defined in: [dom/types.ts:205](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/types.ts#L205)

Given two elements, return closest ancestor element that encompases them both,
or `null` if none such found.

#### Type Parameters

##### TFindEl

`TFindEl` = `El`

#### Parameters

##### args

...\[`El`\]

#### Returns

`PortadomPromise`\<`TFindEl`\>

***

### getCommonAncestorFromSelector()

> **getCommonAncestorFromSelector**: \<`TFindEl`\>(...`args`) => `PortadomPromise`\<`TFindEl`\>

Defined in: [dom/types.ts:211](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/types.ts#L211)

Given a selector, find all DOM elements that match the selector,
and return closest ancestor element that encompases them all,
or `null` if none such found.

#### Type Parameters

##### TFindEl

`TFindEl` = `El`

#### Parameters

##### args

...\[`string`\]

#### Returns

`PortadomPromise`\<`TFindEl`\>

***

### href()

> **href**: (...`args`) => `Promise`\<`string` \| `null`\>

Defined in: [dom/types.ts:160](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/types.ts#L160)

Get element's href

#### Parameters

##### args

...\[`object` & `FormatUrlOptions`\]

#### Returns

`Promise`\<`string` \| `null`\>

***

### map()

> **map**: \<`TVal`\>(...`args`) => `Promise`\<`TVal` \| `null`\>

Defined in: [dom/types.ts:176](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/types.ts#L176)

Freely modify the underlying DOM node

#### Type Parameters

##### TVal

`TVal`

#### Parameters

##### args

...\[(`node`) => `TVal`\]

#### Returns

`Promise`\<`TVal` \| `null`\>

***

### node

> **node**: `Promise`\<`El` \| `null`\>

Defined in: [dom/types.ts:125](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/types.ts#L125)

***

### nodeName()

> **nodeName**: (...`args`) => `Promise`\<`string` \| `null`\>

Defined in: [dom/types.ts:168](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/types.ts#L168)

Get element's nodeName

#### Parameters

##### args

...\[\]

#### Returns

`Promise`\<`string` \| `null`\>

***

### parent()

> **parent**: \<`TFindEl`\>(...`args`) => `PortadomPromise`\<`TFindEl`\>

Defined in: [dom/types.ts:191](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/types.ts#L191)

Get element's parent

#### Type Parameters

##### TFindEl

`TFindEl` = `El`

#### Parameters

##### args

...\[\]

#### Returns

`PortadomPromise`\<`TFindEl`\>

***

### promise

> **promise**: `Promise`\<[`Portadom`](Portadom.md)\<`El`, `El`\> \| `null`\>

Defined in: [dom/types.ts:124](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/types.ts#L124)

***

### prop()

> **prop**: (...`args`) => `Promise`\<`any`\>

Defined in: [dom/types.ts:156](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/types.ts#L156)

Get element's property

#### Parameters

##### args

...\[`MaybeArray`\<`string`\>, `object`\]

#### Returns

`Promise`\<`any`\>

***

### props()

> **props**: (...`args`) => `Promise`\<`any`\>

Defined in: [dom/types.ts:158](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/types.ts#L158)

Get element's properties

#### Parameters

##### args

...\[`MaybeArray`\<`string`\>[], `object`\]

#### Returns

`Promise`\<`any`\>

***

### remove()

> **remove**: (...`args`) => `MaybePromise`\<`void`\>

Defined in: [dom/types.ts:197](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/types.ts#L197)

Remove the element

#### Parameters

##### args

...\[\]

#### Returns

`MaybePromise`\<`void`\>

***

### root()

> **root**: \<`TFindEl`\>(...`args`) => `PortadomPromise`\<`TFindEl`\>

Defined in: [dom/types.ts:199](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/types.ts#L199)

Get root element

#### Type Parameters

##### TFindEl

`TFindEl` = `El`

#### Parameters

##### args

...\[\]

#### Returns

`PortadomPromise`\<`TFindEl`\>

***

### src()

> **src**: (...`args`) => `Promise`\<`string` \| `null`\>

Defined in: [dom/types.ts:164](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/types.ts#L164)

Get element's src

#### Parameters

##### args

...\[`object` & `FormatUrlOptions`\]

#### Returns

`Promise`\<`string` \| `null`\>

***

### text()

> **text**: (...`args`) => `Promise`\<`string` \| `null`\>

Defined in: [dom/types.ts:132](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/types.ts#L132)

Get element's text (trimmed)

#### Parameters

##### args

...\[`object`\]

#### Returns

`Promise`\<`string` \| `null`\>

***

### textAsLower()

> **textAsLower**: (...`args`) => `Promise`\<`string` \| `null`\>

Defined in: [dom/types.ts:140](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/types.ts#L140)

Get element's text as lowercase (trimmed)

#### Parameters

##### args

...\[`object`\]

#### Returns

`Promise`\<`string` \| `null`\>

***

### textAsNumber()

> **textAsNumber**: (...`args`) => `Promise`\<`number` \| `null`\>

Defined in: [dom/types.ts:144](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/types.ts#L144)

Get element's text and convert it to number

#### Parameters

##### args

...\[`StrAsNumOptions`\]

#### Returns

`Promise`\<`number` \| `null`\>

***

### textAsUpper()

> **textAsUpper**: (...`args`) => `Promise`\<`string` \| `null`\>

Defined in: [dom/types.ts:136](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/types.ts#L136)

Get element's text as uppercase (trimmed)

#### Parameters

##### args

...\[`object`\]

#### Returns

`Promise`\<`string` \| `null`\>

***

### url()

> **url**: (...`args`) => `Promise`\<`string` \| `null`\>

Defined in: [dom/types.ts:172](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/types.ts#L172)

Get URL of website associated with the DOM

#### Parameters

##### args

...\[\]

#### Returns

`Promise`\<`string` \| `null`\>
