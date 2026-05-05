import { describe, expect, it } from 'vitest';

import { createFilterFn, validateFilterScript } from './filter.js';

describe('createFilterFn', () => {
  it('returns truthy filter for empty script', () => {
    const fn = createFilterFn('');
    expect(fn({ id: '1', data: {} })).toBe(true);
  });

  it('evaluates expression against entry data', () => {
    const fn = createFilterFn("obj.name === 'Alice'");
    expect(fn({ id: '1', data: { name: 'Alice' } })).toBe(true);
    expect(fn({ id: '2', data: { name: 'Bob' } })).toBe(false);
  });

  it('supports nested paths', () => {
    const fn = createFilterFn('obj.metadata.count > 5');
    expect(fn({ id: '1', data: { metadata: { count: 10 } } })).toBe(true);
    expect(fn({ id: '2', data: { metadata: { count: 2 } } })).toBe(false);
  });

  it('excludes entry on runtime error', () => {
    const fn = createFilterFn('obj.foo.bar === 1');
    expect(fn({ id: '1', data: {} })).toBe(false);
  });
});

describe('validateFilterScript', () => {
  it('returns null for valid script', () => {
    expect(validateFilterScript('obj.x === 1')).toBeNull();
    expect(validateFilterScript('')).toBeNull();
  });

  it('returns error message for invalid syntax', () => {
    const err = validateFilterScript('obj.x ===');
    expect(err).toBeTruthy();
    expect(typeof err).toBe('string');
  });
});
