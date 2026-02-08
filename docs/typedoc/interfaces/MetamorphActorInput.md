[**crawlee-one**](../README.md) • **Docs**

***

[crawlee-one](../globals.md) / MetamorphActorInput

# Interface: MetamorphActorInput

Common input fields related to actor metamorphing

## Properties

### metamorphActorBuild?

> `optional` **metamorphActorBuild**: `string`

Tag or number of the target actor build to metamorph into (e.g. `beta` or `1.2.345`).

See https://docs.apify.com/sdk/python/docs/concepts/interacting-with-other-actors#actormetamorph

#### Source

[src/lib/input.ts:349](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/input.ts#L349)

***

### metamorphActorId?

> `optional` **metamorphActorId**: `string`

If you want to run another actor with the same dataset after
this actor has finished (AKA metamorph into another actor),
then set the ID of the target actor.

See https://docs.apify.com/sdk/python/docs/concepts/interacting-with-other-actors#actormetamorph

#### Source

[src/lib/input.ts:343](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/input.ts#L343)

***

### metamorphActorInput?

> `optional` **metamorphActorInput**: `object`

Input passed to the follow-up (metamorph) actor.

See https://docs.apify.com/sdk/python/docs/concepts/interacting-with-other-actors#actormetamorph

#### Source

[src/lib/input.ts:355](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/input.ts#L355)
