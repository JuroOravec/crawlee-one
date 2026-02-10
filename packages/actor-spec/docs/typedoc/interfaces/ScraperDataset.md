[**actor-spec**](../README.md)

***

[actor-spec](../globals.md) / ScraperDataset

# Interface: ScraperDataset

Defined in: [actorSpec.ts:87](https://github.com/JuroOravec/crawlee-one/blob/main/packages/actor-spec/src/types/actorSpec.ts#L87)

## Properties

### faultTolerance

> **faultTolerance**: [`DatasetFaultTolerance`](DatasetFaultTolerance.md)

Defined in: [actorSpec.ts:115](https://github.com/JuroOravec/crawlee-one/blob/main/packages/actor-spec/src/types/actorSpec.ts#L115)

Describes how well the scraper handles failures when scraping the given dataset.

***

### features

> **features**: [`DatasetFeatures`](DatasetFeatures.md)

Defined in: [actorSpec.ts:113](https://github.com/JuroOravec/crawlee-one/blob/main/packages/actor-spec/src/types/actorSpec.ts#L113)

Describes what features the dataset has.

***

### filterCompleteness

> **filterCompleteness**: [`DatasetFilterCompleteness`](../type-aliases/DatasetFilterCompleteness.md)

Defined in: [actorSpec.ts:109](https://github.com/JuroOravec/crawlee-one/blob/main/packages/actor-spec/src/types/actorSpec.ts#L109)

***

### filters

> **filters**: `string`[]

Defined in: [actorSpec.ts:108](https://github.com/JuroOravec/crawlee-one/blob/main/packages/actor-spec/src/types/actorSpec.ts#L108)

List of filter names that can be set when using the actor to scrape this dataset.

The names are indicative only, and do not need to match up with the actual filters
or their IDs in the code.

E.g.
```ts
['geographic region (kraj)', 'starting letter']
```

***

### isDefault

> **isDefault**: `boolean`

Defined in: [actorSpec.ts:96](https://github.com/JuroOravec/crawlee-one/blob/main/packages/actor-spec/src/types/actorSpec.ts#L96)

Whether the dataset is extracted when the actor is run with default settings

***

### modes

> **modes**: [`DatasetModes`](DatasetModes.md)[]

Defined in: [actorSpec.ts:111](https://github.com/JuroOravec/crawlee-one/blob/main/packages/actor-spec/src/types/actorSpec.ts#L111)

Scraper modes that impact the pricing, performance, or what kind of data is returned.

***

### name

> **name**: `string`

Defined in: [actorSpec.ts:89](https://github.com/JuroOravec/crawlee-one/blob/main/packages/actor-spec/src/types/actorSpec.ts#L89)

Dataset name, e.g. `'organisations'`

***

### output

> **output**: [`DatasetOutput`](DatasetOutput.md)

Defined in: [actorSpec.ts:150](https://github.com/JuroOravec/crawlee-one/blob/main/packages/actor-spec/src/types/actorSpec.ts#L150)

***

### perfStats

> **perfStats**: [`DatasetPerfStat`](DatasetPerfStat.md)[]

Defined in: [actorSpec.ts:129](https://github.com/JuroOravec/crawlee-one/blob/main/packages/actor-spec/src/types/actorSpec.ts#L129)

List of performance / cost datapoints that's rendered as a table.

E.g.
```
[
{ rowId: 'fast', colId: '100items', count: 100, costUsd: 0.014, timeSec: 120 },
{ rowId: 'fast', colId: 'fullRun', count: 'all', costUsd: 0.289, timeSec: 2520 },
{ rowId: 'detailed', colId: '100items', count: 100, costUsd: 0.08, timeSec: 697 },
{ rowId: 'detailed', colId: 'fullRun', count: 'all', costUsd: 2.008, timeSec: 17520 },
],
```

***

### privacy

> **privacy**: `object`

Defined in: [actorSpec.ts:130](https://github.com/JuroOravec/crawlee-one/blob/main/packages/actor-spec/src/types/actorSpec.ts#L130)

#### isPersonalDataRedacted

> **isPersonalDataRedacted**: `boolean`

Whether the actor redacts the values of the fields that contain
personal data (as set by `personalDataFields`)
so as not to breach data / privacy regulations.

#### personalDataFields

> **personalDataFields**: `string`[]

Properties on entry object that are considered personal data

E.g. `['email', 'phone']`

#### personalDataSubjects

> **personalDataSubjects**: `string`[]

List of groups of people whose personal data is in the dataset.

E.g. `['employees', 'researchers']`

***

### shortDesc

> **shortDesc**: `string`

Defined in: [actorSpec.ts:90](https://github.com/JuroOravec/crawlee-one/blob/main/packages/actor-spec/src/types/actorSpec.ts#L90)

***

### size

> **size**: `number`

Defined in: [actorSpec.ts:94](https://github.com/JuroOravec/crawlee-one/blob/main/packages/actor-spec/src/types/actorSpec.ts#L94)

Total size of the dataset

***

### url

> **url**: `string`

Defined in: [actorSpec.ts:92](https://github.com/JuroOravec/crawlee-one/blob/main/packages/actor-spec/src/types/actorSpec.ts#L92)

URL to the dataset
