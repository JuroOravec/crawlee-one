import { describe, expect, it } from 'vitest';

import { applyFieldFilter, omitFields, parseFieldList, pickFields } from './fieldFilter.js';

describe('pickFields', () => {
  it('picks top-level fields', () => {
    const obj = { a: 1, b: 2, c: 3 };
    expect(pickFields(obj, ['a', 'c'])).toEqual({ a: 1, c: 3 });
  });

  it('picks nested fields with dot notation', () => {
    const obj = { data: { name: 'John', age: 30 } };
    expect(pickFields(obj, ['data.name'])).toEqual({ data: { name: 'John' } });
  });

  it('returns empty object when no paths match', () => {
    const obj = { a: 1 };
    expect(pickFields(obj, ['b', 'c'])).toEqual({});
  });
});

describe('omitFields', () => {
  it('omits top-level fields', () => {
    const obj = { a: 1, b: 2, c: 3 };
    expect(omitFields(obj, ['b'])).toEqual({ a: 1, c: 3 });
  });

  it('omits nested fields with dot notation', () => {
    const obj = { data: { name: 'John', age: 30 } };
    expect(omitFields(obj, ['data.age'])).toEqual({ data: { name: 'John' } });
  });
});

describe('applyFieldFilter', () => {
  it('applies pick then omit', () => {
    const obj = { name: 'a', description: 'b', id: 1, nested: { prop: 'x', attempts: 2 } };
    const result = applyFieldFilter({
      obj,
      pickPaths: ['name', 'description', 'id', 'nested.prop'],
      omitPaths: ['attempts', 'nested.prop'],
    });
    expect(result).toEqual({ name: 'a', description: 'b', id: 1, nested: {} });
  });

  it('pick only', () => {
    const obj = { a: 1, b: 2, c: 3 };
    expect(applyFieldFilter({ obj, pickPaths: ['a', 'c'] })).toEqual({ a: 1, c: 3 });
  });

  it('omit only', () => {
    const obj = { a: 1, b: 2, c: 3 };
    expect(applyFieldFilter({ obj, omitPaths: ['b'] })).toEqual({ a: 1, c: 3 });
  });
});

describe('parseFieldList', () => {
  it('parses comma-separated list', () => {
    expect(parseFieldList('a,b,c')).toEqual(['a', 'b', 'c']);
  });

  it('trims whitespace', () => {
    expect(parseFieldList(' a , b , c ')).toEqual(['a', 'b', 'c']);
  });

  it('returns empty array for empty/undefined', () => {
    expect(parseFieldList('')).toEqual([]);
    expect(parseFieldList(undefined)).toEqual([]);
  });
});
