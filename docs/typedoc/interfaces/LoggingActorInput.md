[**crawlee-one**](../README.md)

***

[crawlee-one](../globals.md) / LoggingActorInput

# Interface: LoggingActorInput

Defined in: [src/lib/input.ts:122](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/input.ts#L122)

Common input fields related to logging setup

## Properties

### errorReportingDatasetId?

> `optional` **errorReportingDatasetId**: `string`

Defined in: [src/lib/input.ts:136](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/input.ts#L136)

Dataset ID to which errors should be captured.

Default: `'REPORTING'`.

***

### errorTelemetry?

> `optional` **errorTelemetry**: `boolean`

Defined in: [src/lib/input.ts:130](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/input.ts#L130)

Whether to report actor errors to telemetry such as <a href="https://sentry.io/">Sentry</a>.

This info is used by the author of this actor to identify broken integrations,
and track down and fix issues.

***

### logLevel?

> `optional` **logLevel**: `"error"` \| `"debug"` \| `"info"` \| `"warn"` \| `"off"`

Defined in: [src/lib/input.ts:123](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/input.ts#L123)
