[**crawlee-one**](../README.md)

***

[crawlee-one](../globals.md) / MetamorphActorInput

# Interface: MetamorphActorInput

Defined in: [src/lib/input.ts:335](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/input.ts#L335)

Common input fields related to actor metamorphing

## Properties

### metamorphActorBuild?

> `optional` **metamorphActorBuild**: `string`

Defined in: [src/lib/input.ts:349](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/input.ts#L349)

Tag or number of the target actor build to metamorph into (e.g. `beta` or `1.2.345`).

See https://docs.apify.com/sdk/python/docs/concepts/interacting-with-other-actors#actormetamorph

***

### metamorphActorId?

> `optional` **metamorphActorId**: `string`

Defined in: [src/lib/input.ts:343](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/input.ts#L343)

If you want to run another actor with the same dataset after
this actor has finished (AKA metamorph into another actor),
then set the ID of the target actor.

See https://docs.apify.com/sdk/python/docs/concepts/interacting-with-other-actors#actormetamorph

***

### metamorphActorInput?

> `optional` **metamorphActorInput**: `object`

Defined in: [src/lib/input.ts:355](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/input.ts#L355)

Input passed to the follow-up (metamorph) actor.

See https://docs.apify.com/sdk/python/docs/concepts/interacting-with-other-actors#actormetamorph
