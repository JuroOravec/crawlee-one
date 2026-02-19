[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / ExportOptions

# Interface: ExportOptions

Defined in: [packages/crawlee-one/src/lib/export/runExport.ts:15](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/export/runExport.ts#L15)

Options for the programmatic export API.
All types are "clean" — no string parsing; pass parsed/typed values.

## Extends

- `Omit`\<`_ExportOptions`, `"outputPath"`\>

## Properties

### datasetId

> **datasetId**: `string`

Defined in: [packages/crawlee-one/src/lib/export/exportDataset.ts:18](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/export/exportDataset.ts#L18)

Dataset ID to export.

#### Inherited from

`Omit.datasetId`

***

### fields?

> `optional` **fields**: `string`[]

Defined in: [packages/crawlee-one/src/lib/export/exportDataset.ts:24](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/export/exportDataset.ts#L24)

Fields to include (dot notation, e.g. nested.prop).

#### Inherited from

`Omit.fields`

***

### fieldsOmit?

> `optional` **fieldsOmit**: `string`[]

Defined in: [packages/crawlee-one/src/lib/export/exportDataset.ts:26](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/export/exportDataset.ts#L26)

Fields to exclude.

#### Inherited from

`Omit.fieldsOmit`

***

### format

> **format**: `"json"` \| `"csv"`

Defined in: [packages/crawlee-one/src/lib/export/exportDataset.ts:20](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/export/exportDataset.ts#L20)

Output format.

#### Inherited from

`Omit.format`

***

### io?

> `optional` **io**: [`CrawleeOneIO`](CrawleeOneIO.md)\<`object`, `object`, `object`\>

Defined in: [packages/crawlee-one/src/lib/export/exportDataset.ts:32](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/export/exportDataset.ts#L32)

IO for opening the dataset. Defaults to Crawlee local/cloud storage.

#### Inherited from

`Omit.io`

***

### maxEntries?

> `optional` **maxEntries**: `number`

Defined in: [packages/crawlee-one/src/lib/export/exportDataset.ts:30](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/export/exportDataset.ts#L30)

Max entries per file (splits into multiple files when exceeded).

#### Inherited from

`Omit.maxEntries`

***

### maxSizeBytes?

> `optional` **maxSizeBytes**: `number`

Defined in: [packages/crawlee-one/src/lib/export/exportDataset.ts:28](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/export/exportDataset.ts#L28)

Max size per file in bytes (splits into multiple files when exceeded).

#### Inherited from

`Omit.maxSizeBytes`

***

### output?

> `optional` **output**: `string`

Defined in: [packages/crawlee-one/src/lib/export/runExport.ts:17](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/export/runExport.ts#L17)

Output file path. Defaults to storage/exports/{datasetId}.{format} when omitted.
