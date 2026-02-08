[**crawlee-one**](../README.md) • **Docs**

***

[crawlee-one](../globals.md) / LoggingActorInput

# Interface: LoggingActorInput

Common input fields related to logging setup

## Properties

### errorReportingDatasetId?

> `optional` **errorReportingDatasetId**: `string`

Dataset ID to which errors should be captured.

Default: `'REPORTING'`.

#### Source

[src/lib/input.ts:136](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/input.ts#L136)

***

### errorTelemetry?

> `optional` **errorTelemetry**: `boolean`

Whether to report actor errors to telemetry such as <a href="https://sentry.io/">Sentry</a>.

This info is used by the author of this actor to identify broken integrations,
and track down and fix issues.

#### Source

[src/lib/input.ts:130](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/input.ts#L130)

***

### logLevel?

> `optional` **logLevel**: `"error"` \| `"debug"` \| `"info"` \| `"warn"` \| `"off"`

#### Source

[src/lib/input.ts:123](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/input.ts#L123)
