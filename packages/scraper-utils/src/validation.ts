import { z } from 'zod';

import type { ApifyEntryMetadata } from 'crawlee-one';

// ---------------------------------------------------------------------------
// Generic zod primitives (used by metadataValidation and reusable across scrapers)
// ---------------------------------------------------------------------------

export const zStrNotEmpty = z.string().min(1);
export const zStrNotEmptyNullable = z.string().min(1).nullable();
export const zUrlNotEmpty = z.string().min(1).url();
export const zUrlNotEmptyNullable = z.string().min(1).url().nullable();
export const zNumIntNonNeg = z.number().int().min(0);
export const zNumIntNonNegNullable = z.number().int().min(0).nullable();

// ---------------------------------------------------------------------------
// Apify entry metadata validation
// ---------------------------------------------------------------------------

/**
 * Zod schema for validating Apify dataset entry metadata.
 * Reusable across all scrapers that use crawlee-one's pushData with includeMetadata.
 */
export const metadataValidation = z
  .object({
    actorId: zStrNotEmptyNullable,
    actorRunId: zStrNotEmptyNullable,
    actorRunUrl: zUrlNotEmptyNullable,
    contextId: zStrNotEmpty,
    requestId: zStrNotEmptyNullable,
    originalUrl: zUrlNotEmptyNullable,
    loadedUrl: zUrlNotEmptyNullable,
    dateHandled: z.string().datetime({ offset: true }),
    numberOfRetries: zNumIntNonNeg,
  })
  .strict() satisfies z.ZodType<ApifyEntryMetadata>;

// ---------------------------------------------------------------------------
// Entry creation helper
// ---------------------------------------------------------------------------

/**
 * Create a validated entry by parsing data against a Zod schema.
 * Unlike calling `schema.parse(data)` directly, this helper enforces that the
 * `data` argument matches the schema's input type at compile time, so TypeScript
 * catches shape mismatches before runtime.
 *
 * @example
 * ```ts
 * const entry = createEntry(partnerEntrySchema, { name, url, description, logoUrl, category });
 * // TS error if e.g. count: '' is passed where count should be number
 * ```
 */
export function createEntry<T extends z.ZodTypeAny>(schema: T, data: z.input<T>): z.infer<T> {
  try {
    return schema.parse(data) as z.infer<T>;
  } catch (err) {
    if (err instanceof z.ZodError) {
      const json = JSON.stringify(data, null, 2);
      console.error(
        '[createEntry] Validation failed. Data that failed validation:\n',
        json.length > 10000 ? json.slice(0, 10000) + '\n...(truncated)' : json
      );
    }
    throw err;
  }
}
