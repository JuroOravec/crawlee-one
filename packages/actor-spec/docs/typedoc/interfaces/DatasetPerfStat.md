[**actor-spec**](../README.md)

***

[actor-spec](../globals.md) / DatasetPerfStat

# Interface: DatasetPerfStat

Defined in: [actorSpec.ts:271](https://github.com/JuroOravec/crawlee-one/blob/main/packages/actor-spec/src/types/actorSpec.ts#L271)

Single performance / cost datapoint of a scraper actor.

This data helps us to compare this scraper against others,
or to know how much a run will cost / take time.

E.g.
```
perfStats = [
{ rowId: 'fast', colId: '100items', count: 100, costUsd: 0.014, timeSec: 120 },
{ rowId: 'fast', colId: 'fullRun', count: 'all', costUsd: 0.289, timeSec: 2520 },
{ rowId: 'detailed', colId: '100items', count: 100, costUsd: 0.08, timeSec: 697 },
{ rowId: 'detailed', colId: 'fullRun', count: 'all', costUsd: 2.008, timeSec: 17520 },
];
```

## Properties

### colId

> **colId**: `string`

Defined in: [actorSpec.ts:273](https://github.com/JuroOravec/crawlee-one/blob/main/packages/actor-spec/src/types/actorSpec.ts#L273)

***

### costUsd

> **costUsd**: `number`

Defined in: [actorSpec.ts:274](https://github.com/JuroOravec/crawlee-one/blob/main/packages/actor-spec/src/types/actorSpec.ts#L274)

***

### count

> **count**: `number` \| `"all"`

Defined in: [actorSpec.ts:277](https://github.com/JuroOravec/crawlee-one/blob/main/packages/actor-spec/src/types/actorSpec.ts#L277)

***

### mode

> **mode**: `string` \| `null`

Defined in: [actorSpec.ts:276](https://github.com/JuroOravec/crawlee-one/blob/main/packages/actor-spec/src/types/actorSpec.ts#L276)

***

### rowId

> **rowId**: `string`

Defined in: [actorSpec.ts:272](https://github.com/JuroOravec/crawlee-one/blob/main/packages/actor-spec/src/types/actorSpec.ts#L272)

***

### timeSec

> **timeSec**: `number`

Defined in: [actorSpec.ts:275](https://github.com/JuroOravec/crawlee-one/blob/main/packages/actor-spec/src/types/actorSpec.ts#L275)
