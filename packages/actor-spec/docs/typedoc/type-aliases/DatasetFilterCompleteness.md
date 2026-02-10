[**actor-spec**](../README.md)

***

[actor-spec](../globals.md) / DatasetFilterCompleteness

# Type Alias: DatasetFilterCompleteness

> **DatasetFilterCompleteness** = `"none"` \| `"some"` \| `"full"` \| `"extra"`

Defined in: [actorSpec.ts:325](https://github.com/JuroOravec/crawlee-one/blob/main/packages/actor-spec/src/types/actorSpec.ts#L325)

The state of dataset filters:
- `none` - no filters available
- `some` - some filters available
- `full` - all filters that are available in the original web / UI / API are supported
- `extra` - same as `full`, plus extra filters
