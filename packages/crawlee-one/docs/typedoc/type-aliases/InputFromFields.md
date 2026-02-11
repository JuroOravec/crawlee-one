[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / InputFromFields

# Type Alias: InputFromFields\<F\>

> **InputFromFields**\<`F`\> = `{ [K in keyof F]: NonNullable<F[K]["schema"]> extends z.ZodType ? z.infer<NonNullable<F[K]["schema"]>> : unknown }`

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:382](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L382)

Extract the input type from a record of Field objects with embedded Zod schemas.

## Type Parameters

### F

`F` *extends* `Record`\<`string`, `Field`\>

## Example

```ts
const fields = {
  createStringField({
    title: 'Target URL',
    type: 'string',
    description: 'URL to scrape',
    editor: 'textfield',
    schema: z.string().url(),
  }),
};
type ActorInput = InputFromFields<typeof fields>;
```
