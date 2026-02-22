import { describe, it, expect } from 'vitest';

import { expectColumnValuesToMatchJsonSchema } from './columnSchema.js';

describe('expectColumnValuesToMatchJsonSchema', () => {
  it('passes for values matching a string schema', () => {
    const d = [{ v: 'hello' }, { v: 'world' }];
    expect(expectColumnValuesToMatchJsonSchema(d, 'v', { type: 'string' }).success).toBe(true);
  });

  it('fails for values not matching type', () => {
    const d = [{ v: 'hello' }, { v: 42 }];
    const r = expectColumnValuesToMatchJsonSchema(d, 'v', { type: 'string' });
    expect(r.success).toBe(false);
    expect(r.unexpected_count).toBe(1);
  });

  it('validates with pattern', () => {
    const d = [{ v: 'abc123' }, { v: 'def456' }];
    expect(
      expectColumnValuesToMatchJsonSchema(d, 'v', {
        type: 'string',
        pattern: '^[a-z]+\\d+$',
      }).success
    ).toBe(true);
  });

  it('validates with enum', () => {
    const d = [{ v: 'a' }, { v: 'b' }, { v: 'c' }];
    const r = expectColumnValuesToMatchJsonSchema(d, 'v', { enum: ['a', 'b'] });
    expect(r.success).toBe(false);
    expect(r.unexpected_count).toBe(1);
  });

  it('validates number ranges', () => {
    const d = [{ v: 5 }, { v: 10 }, { v: 15 }];
    expect(
      expectColumnValuesToMatchJsonSchema(d, 'v', {
        type: 'number',
        minimum: 0,
        maximum: 20,
      }).success
    ).toBe(true);
  });

  it('supports mostly', () => {
    const d = [{ v: 'ok' }, { v: 'ok' }, { v: 42 }];
    expect(
      expectColumnValuesToMatchJsonSchema(d, 'v', { type: 'string' }, { mostly: 0.5 }).success
    ).toBe(true);
  });
});
