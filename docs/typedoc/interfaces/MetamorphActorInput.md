[crawlee-one](../README.md) / [Exports](../modules.md) / MetamorphActorInput

# Interface: MetamorphActorInput

Common input fields related to actor metamorphing

## Table of contents

### Properties

- [metamorphActorBuild](MetamorphActorInput.md#metamorphactorbuild)
- [metamorphActorId](MetamorphActorInput.md#metamorphactorid)
- [metamorphActorInput](MetamorphActorInput.md#metamorphactorinput)

## Properties

### metamorphActorBuild

• `Optional` **metamorphActorBuild**: `string`

Tag or number of the target actor build to metamorph into (e.g. `beta` or `1.2.345`).

See https://docs.apify.com/sdk/python/docs/concepts/interacting-with-other-actors#actormetamorph

#### Defined in

[src/lib/input.ts:348](https://github.com/JuroOravec/crawlee-one/blob/490b500/src/lib/input.ts#L348)

___

### metamorphActorId

• `Optional` **metamorphActorId**: `string`

If you want to run another actor with the same dataset after
this actor has finished (AKA metamorph into another actor),
then set the ID of the target actor.

See https://docs.apify.com/sdk/python/docs/concepts/interacting-with-other-actors#actormetamorph

#### Defined in

[src/lib/input.ts:342](https://github.com/JuroOravec/crawlee-one/blob/490b500/src/lib/input.ts#L342)

___

### metamorphActorInput

• `Optional` **metamorphActorInput**: `object`

Input passed to the follow-up (metamorph) actor.

See https://docs.apify.com/sdk/python/docs/concepts/interacting-with-other-actors#actormetamorph

#### Defined in

[src/lib/input.ts:354](https://github.com/JuroOravec/crawlee-one/blob/490b500/src/lib/input.ts#L354)
