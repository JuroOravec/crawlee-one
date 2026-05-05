# Export datasets

The `crawlee-one export` command exports a Crawlee/Apify dataset to JSON or CSV. It works with both local storage (`APIFY_LOCAL_STORAGE_DIR`) and cloud storage (when `APIFY_TOKEN` is set).

## Usage

```sh
crawlee-one export <dataset>
```

**Dataset ID** — The name of the dataset to export (e.g. `dev-profesia-partners`, or the default dataset ID used by your crawler).

## Options

| Option                  | Description                                                 | Default                              |
| ----------------------- | ----------------------------------------------------------- | ------------------------------------ |
| `-f, --format <format>` | Output format: `json` or `csv`                              | `json`                               |
| `-o, --output <path>`   | Output file path                                            | `storage/exports/{dataset}.{format}` |
| `--fields <list>`       | Comma-separated fields to include (dot notation for nested) | all                                  |
| `--fields-omit <list>`  | Comma-separated fields to exclude                           | none                                 |
| `--max-size <size>`     | Max size per file (e.g. `30MB`, `4GB`)                      | none                                 |
| `--max-entries <n>`     | Max entries per file                                        | none                                 |

## Examples

```sh
# Export to JSON (default)
npx crawlee-one export dev-profesia-partners

# Export to CSV
npx crawlee-one export dev-profesia-partners -f csv

# Include only specific fields (dot notation for nested)
npx crawlee-one export dev-profesia-partners --fields name,id,data.salary

# Exclude fields
npx crawlee-one export dev-profesia-partners --fields-omit attempts,metadata

# Split into multiple files (max 1000 entries per file)
npx crawlee-one export dev-profesia-partners --max-entries 1000

# Split by size (e.g. 30MB per file)
npx crawlee-one export dev-profesia-partners --max-size 30MB

# Custom output path
npx crawlee-one export dev-profesia-partners -o ./out/export.json
```

## Programmatic usage

You can trigger export from code by calling `runExport` with `RunExportOptions`:

```ts
import { runExport } from 'crawlee-one';

const result = await runExport({
  datasetId: 'dev-profesia-partners',
  format: 'csv',
  output: './out/export.csv',
  fields: ['name', 'id', 'data.salary'],
  fieldsOmit: ['attempts', 'metadata'],
  maxSizeBytes: 30 * 1024 * 1024, // 30MB
  maxEntries: 1000,
});

console.log(`Exported ${result.totalEntries} entries to ${result.filesWritten.length} file(s)`);
```

| Option         | Description                                    | Default                                |
| -------------- | ---------------------------------------------- | -------------------------------------- |
| `datasetId`    | Dataset ID to export                           | required                               |
| `format`       | `'json'` or `'csv'`                            | required                               |
| `output`       | Output file path                               | `storage/exports/{datasetId}.{format}` |
| `fields`       | Fields to include (string array, dot notation) | all                                    |
| `fieldsOmit`   | Fields to exclude (string array)               | none                                   |
| `maxSizeBytes` | Max size per file in bytes                     | none                                   |
| `maxEntries`   | Max entries per file                           | none                                   |
| `io`           | Custom IO for opening the dataset              | Crawlee local/cloud storage            |

## Output

- **Single file:** `base.json` or `base.csv` (no part suffix)
- **Multiple parts:** `base-0.json`, `base-1.json`, etc.

Default output directory: `storage/exports/` (or `{APIFY_LOCAL_STORAGE_DIR}/exports/` when set).

## CSV format

- **Nested objects:** Flattened with dot notation — `{ data: { name: "John" } }` → `{ "data.name": "John" }`
- **Arrays:** Serialized as JSON — `{ tags: ['a', 'b'] }` → `{ "tags": "[\"a\",\"b\"]" }` (no `data[0].name`-style columns)

## Empty dataset

When the dataset has no items, export skips without writing files and logs:

```
Dataset "dev-profesia-partners" is empty. Nothing to export.
```
