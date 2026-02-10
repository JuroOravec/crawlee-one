[**actor-spec**](../README.md)

***

[actor-spec](../globals.md) / ScraperActorSpec

# Interface: ScraperActorSpec

Defined in: [actorSpec.ts:83](https://github.com/JuroOravec/crawlee-one/blob/main/packages/actor-spec/src/types/actorSpec.ts#L83)

ActorSpec that describes an actor / bot that's a scraper,
AKA this actor is expected to extract data.

Hence, this actor spec includes additional info about the datasets
that can be extracted.

## Extends

- [`ActorSpec`](ActorSpec.md)

## Properties

### actor

> **actor**: `object`

Defined in: [actorSpec.ts:21](https://github.com/JuroOravec/crawlee-one/blob/main/packages/actor-spec/src/types/actorSpec.ts#L21)

Info about the actor itself

#### datasetOverviewImgUrl

> **datasetOverviewImgUrl**: `string` \| `null`

Image that shows overview of the extracted data

#### publicUrl

> **publicUrl**: `string` \| `null`

#### shortDesc

> **shortDesc**: `string`

#### title

> **title**: `string`

#### Inherited from

[`ActorSpec`](ActorSpec.md).[`actor`](ActorSpec.md#actor)

***

### actorspecVersion

> **actorspecVersion**: `number`

Defined in: [actorSpec.ts:19](https://github.com/JuroOravec/crawlee-one/blob/main/packages/actor-spec/src/types/actorSpec.ts#L19)

Currently only version 1 exists

#### Inherited from

[`ActorSpec`](ActorSpec.md).[`actorspecVersion`](ActorSpec.md#actorspecversion)

***

### authors

> **authors**: `object`[]

Defined in: [actorSpec.ts:51](https://github.com/JuroOravec/crawlee-one/blob/main/packages/actor-spec/src/types/actorSpec.ts#L51)

Authors that wrote this actor

#### authorUrl

> **authorUrl**: `string` \| `null`

#### email

> **email**: `string`

#### name

> **name**: `string`

#### Inherited from

[`ActorSpec`](ActorSpec.md).[`authors`](ActorSpec.md#authors)

***

### datasets

> **datasets**: [`ScraperDataset`](ScraperDataset.md)[]

Defined in: [actorSpec.ts:84](https://github.com/JuroOravec/crawlee-one/blob/main/packages/actor-spec/src/types/actorSpec.ts#L84)

***

### platform

> **platform**: `object`

Defined in: [actorSpec.ts:28](https://github.com/JuroOravec/crawlee-one/blob/main/packages/actor-spec/src/types/actorSpec.ts#L28)

#### actorId

> **actorId**: `string`

ID the actor has on the platform - We assume the platform is
a marketplace like Apify, where authorId is meaningful.

#### authorId

> **authorId**: `string`

ID the author has on the platform - We assume the platform is
a marketplace like Apify, where authorId is meaningful.

#### authorProfileUrl

> **authorProfileUrl**: `string` \| `null`

If the platform supports profile pages for authors of actors, it is here.

#### name

> **name**: `string`

E.g. 'apify'

#### socials?

> `optional` **socials**: `object`

Various social links

##### socials.discord?

> `optional` **discord**: `string`

#### url

> **url**: `string`

URL to the platform's homepage

#### Inherited from

[`ActorSpec`](ActorSpec.md).[`platform`](ActorSpec.md#platform)

***

### pricing

> **pricing**: `object`

Defined in: [actorSpec.ts:62](https://github.com/JuroOravec/crawlee-one/blob/main/packages/actor-spec/src/types/actorSpec.ts#L62)

Pricing of the actor. Based on Apify.

#### currency

> **currency**: `string`

E.g. the `"usd"` in `"$8 per month"`

#### period

> **period**: `number`

E.g. the `1000` in `"$0.50 per 1000 entries"`

#### periodUnit

> **periodUnit**: `string`

E.g. the `"entries"` in `"$0.50 per 1000 entries"`

#### pricingType

> **pricingType**: `string`

E.g. none (free), monthly fee, one-off fee, or per X results

#### value

> **value**: `number`

E.g. the `8` in `"$8 per month"`

#### Inherited from

[`ActorSpec`](ActorSpec.md).[`pricing`](ActorSpec.md#pricing)

***

### websites

> **websites**: `object`[]

Defined in: [actorSpec.ts:57](https://github.com/JuroOravec/crawlee-one/blob/main/packages/actor-spec/src/types/actorSpec.ts#L57)

The websites the actor works with

#### name

> **name**: `string`

#### url

> **url**: `string`

#### Inherited from

[`ActorSpec`](ActorSpec.md).[`websites`](ActorSpec.md#websites)
