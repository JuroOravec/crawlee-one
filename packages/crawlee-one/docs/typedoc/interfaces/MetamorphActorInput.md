[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / MetamorphActorInput

# Interface: MetamorphActorInput

Defined in: [packages/crawlee-one/src/lib/input.ts:399](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/input.ts#L399)

Common input fields related to actor metamorphing

## Properties

### metamorphActorBuild?

> `optional` **metamorphActorBuild**: `string`

Defined in: [packages/crawlee-one/src/lib/input.ts:413](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/input.ts#L413)

Tag or number of the target actor build to metamorph into (e.g. `beta` or `1.2.345`).

See https://docs.apify.com/sdk/python/docs/concepts/interacting-with-other-actors#actormetamorph

***

### metamorphActorId?

> `optional` **metamorphActorId**: `string`

Defined in: [packages/crawlee-one/src/lib/input.ts:407](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/input.ts#L407)

If you want to run another actor with the same dataset after
this actor has finished (AKA metamorph into another actor),
then set the ID of the target actor.

See https://docs.apify.com/sdk/python/docs/concepts/interacting-with-other-actors#actormetamorph

***

### metamorphActorInput?

> `optional` **metamorphActorInput**: `object`

Defined in: [packages/crawlee-one/src/lib/input.ts:419](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/input.ts#L419)

Input passed to the follow-up (metamorph) actor.

See https://docs.apify.com/sdk/python/docs/concepts/interacting-with-other-actors#actormetamorph
