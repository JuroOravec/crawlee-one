import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { createEntry } from '../validation.js';

const simpleSchema = z.object({
  name: z.string().min(1),
  count: z.number(),
});

describe('createEntry', () => {
  it('parses valid data', () => {
    const entry = createEntry(simpleSchema, { name: 'foo', count: 1 });
    expect(entry).toEqual({ name: 'foo', count: 1 });
  });

  it('normalizes NBSP in string values by default', () => {
    const entry = createEntry(simpleSchema, {
      name: '2000\u00A0Metric Ton/Year',
      count: 1,
    });
    expect(entry.name).toBe('2000 Metric Ton/Year');
    expect(entry.count).toBe(1);
  });

  it('skips normalization when normalizeWhitespace is false', () => {
    // Schema accepts the raw string; we just verify the value is passed through
    const schema = z.object({ name: z.string() });
    const entry = createEntry(schema, { name: 'x\u00A0y' }, { normalizeWhitespace: false });
    expect(entry.name).toBe('x\u00A0y');
  });

  it('throws ZodError for invalid data', () => {
    expect(() => createEntry(simpleSchema, { name: '', count: 1 })).toThrow(z.ZodError);
    expect(() => createEntry(simpleSchema, { name: 'foo', count: 'bad' })).toThrow(z.ZodError);
  });
});
