[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / runExport

# Function: runExport()

> **runExport**(`options`): `Promise`\<[`ExportResult`](../interfaces/ExportResult.md)\>

Defined in: packages/crawlee-one/src/lib/export/runExport.ts:29

Export a dataset to JSON or CSV files.

Programmatic API with typed options. For CLI usage, the command parses
string inputs (e.g. `parseSize`, `parseFieldList`) and calls this function.

**Formats:** JSON (compact) or CSV (RFC 4180, flattened).
**Splitting:** Use `maxSizeBytes` or `maxEntries` to split into multiple files.

## Parameters

### options

[`ExportOptions`](../interfaces/ExportOptions.md)

## Returns

`Promise`\<[`ExportResult`](../interfaces/ExportResult.md)\>
