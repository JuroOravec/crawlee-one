[crawlee-one](../README.md) / [Exports](../modules.md) / LoggingActorInput

# Interface: LoggingActorInput

Common input fields related to logging setup

## Table of contents

### Properties

- [errorReportingDatasetId](LoggingActorInput.md#errorreportingdatasetid)
- [errorTelemetry](LoggingActorInput.md#errortelemetry)
- [logLevel](LoggingActorInput.md#loglevel)

## Properties

### errorReportingDatasetId

• `Optional` **errorReportingDatasetId**: `string`

Dataset ID to which errors should be captured.

Default: `'REPORTING'`.

#### Defined in

[src/lib/input.ts:135](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/input.ts#L135)

___

### errorTelemetry

• `Optional` **errorTelemetry**: `boolean`

Whether to report actor errors to telemetry such as <a href="https://sentry.io/">Sentry</a>.

This info is used by the author of this actor to identify broken integrations,
and track down and fix issues.

#### Defined in

[src/lib/input.ts:129](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/input.ts#L129)

___

### logLevel

• `Optional` **logLevel**: ``"error"`` \| ``"off"`` \| ``"info"`` \| ``"debug"`` \| ``"warn"``

#### Defined in

[src/lib/input.ts:122](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/input.ts#L122)
