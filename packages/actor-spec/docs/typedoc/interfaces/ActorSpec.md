[**actor-spec**](../README.md)

***

[actor-spec](../globals.md) / ActorSpec

# Interface: ActorSpec

Defined in: [actorSpec.ts:17](https://github.com/JuroOravec/crawlee-one/blob/main/packages/actor-spec/src/types/actorSpec.ts#L17)

ActorSpec refers an actor in the sense of a bot / serverless cloud program
as defined by Apify (https://docs.apify.com/platform/actors).

However, this description of an actor is for my (Juro's) own needs of managing
possibly many actors across possibly many platforms written in possibly many repos.

Hence, some differences are:
- ActorSpec description is platform agnostic (e.g. Apify is a platform) - there might be
other actors on other platforms.
- ActorSpec is not an actor itself, but rather a reference to an actor living
in some platform.
- Aim of this reference is to keep track of things like featureset, performance / price,
which websites it works with, what it does (eg what data it extracts if it's a scraper),
who are the authors, privacy compliance, etc.

## Extended by

- [`ScraperActorSpec`](ScraperActorSpec.md)

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

***

### actorspecVersion

> **actorspecVersion**: `number`

Defined in: [actorSpec.ts:19](https://github.com/JuroOravec/crawlee-one/blob/main/packages/actor-spec/src/types/actorSpec.ts#L19)

Currently only version 1 exists

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

***

### websites

> **websites**: `object`[]

Defined in: [actorSpec.ts:57](https://github.com/JuroOravec/crawlee-one/blob/main/packages/actor-spec/src/types/actorSpec.ts#L57)

The websites the actor works with

#### name

> **name**: `string`

#### url

> **url**: `string`
