import { describe, expect, it } from 'vitest';

import { flattenForCsv } from './flattenForCsv.js';

describe('flattenForCsv', () => {
  it('flattens nested object with dot notation', () => {
    const obj = { data: { name: 'John' } };
    expect(flattenForCsv(obj)).toEqual({ 'data.name': 'John' });
  });

  it('serializes array fields as JSON', () => {
    const obj = { tags: ['a', 'b', 'c'] };
    expect(flattenForCsv(obj)).toEqual({ tags: '["a","b","c"]' });
  });

  it('handles mixed structure', () => {
    const obj = {
      id: 1,
      data: { name: 'John', meta: { score: 42 } },
      tags: [1, 2, 3],
    };
    expect(flattenForCsv(obj)).toEqual({
      id: 1,
      'data.name': 'John',
      'data.meta.score': 42,
      tags: '[1,2,3]',
    });
  });

  it('handles null and undefined', () => {
    const obj = { a: null, b: undefined };
    expect(flattenForCsv(obj)).toEqual({ a: null, b: null });
  });
});
