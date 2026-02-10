[**actor-spec**](../README.md)

***

[actor-spec](../globals.md) / DatasetModes

# Interface: DatasetModes

Defined in: [actorSpec.ts:247](https://github.com/JuroOravec/crawlee-one/blob/main/packages/actor-spec/src/types/actorSpec.ts#L247)

Is a scraper has multiple configurations / working modes that impact
the pricing, performance, or what kind of data is returned, we call
these the actor "modes".

E.g.
```
[
{ name: 'Fast', isDefault: true, shortDesc: 'only data on the entries themselves' },
{ name: 'Detailed', isDefault: false, shortDesc: 'includes all relationships' },
];
```

## Properties

### isDefault

> **isDefault**: `boolean`

Defined in: [actorSpec.ts:251](https://github.com/JuroOravec/crawlee-one/blob/main/packages/actor-spec/src/types/actorSpec.ts#L251)

Whether this mode is the default when the actor is extracting this dataset with default settings

***

### name

> **name**: `string`

Defined in: [actorSpec.ts:249](https://github.com/JuroOravec/crawlee-one/blob/main/packages/actor-spec/src/types/actorSpec.ts#L249)

Name of the mode

***

### shortDesc

> **shortDesc**: `string`

Defined in: [actorSpec.ts:252](https://github.com/JuroOravec/crawlee-one/blob/main/packages/actor-spec/src/types/actorSpec.ts#L252)
