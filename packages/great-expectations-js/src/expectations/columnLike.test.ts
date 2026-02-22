import { describe, it, expect } from 'vitest';
import {
  likeToRegex,
  expectColumnValuesToMatchLikePattern,
  expectColumnValuesToNotMatchLikePattern,
  expectColumnValuesToMatchLikePatternList,
  expectColumnValuesToNotMatchLikePatternList,
} from './columnLike.js';

describe('likeToRegex', () => {
  it('converts % to match any chars', () => {
    expect(likeToRegex('%').test('anything')).toBe(true);
    expect(likeToRegex('a%').test('abc')).toBe(true);
    expect(likeToRegex('a%').test('bbc')).toBe(false);
  });

  it('converts _ to match a single char', () => {
    expect(likeToRegex('a_c').test('abc')).toBe(true);
    expect(likeToRegex('a_c').test('ac')).toBe(false);
  });

  it('escapes special regex chars', () => {
    expect(likeToRegex('a.b').test('a.b')).toBe(true);
    expect(likeToRegex('a.b').test('axb')).toBe(false);
  });

  it('handles escaped LIKE characters', () => {
    expect(likeToRegex('100\\%').test('100%')).toBe(true);
    expect(likeToRegex('100\\%').test('100abc')).toBe(false);
  });
});

const data = [{ name: 'alice' }, { name: 'alex' }, { name: 'bob' }, { name: 'anna' }];

describe('expectColumnValuesToMatchLikePattern', () => {
  it('passes when all match', () => {
    const d = [{ v: 'abc' }, { v: 'axc' }];
    expect(expectColumnValuesToMatchLikePattern(d, 'v', 'a_c').success).toBe(true);
  });

  it('fails when some do not match', () => {
    const r = expectColumnValuesToMatchLikePattern(data, 'name', 'al%');
    expect(r.success).toBe(false);
    expect(r.unexpected_count).toBe(2);
  });

  it('supports mostly', () => {
    const r = expectColumnValuesToMatchLikePattern(data, 'name', 'a%', { mostly: 0.5 });
    expect(r.success).toBe(true);
  });
});

describe('expectColumnValuesToNotMatchLikePattern', () => {
  it('passes when none match', () => {
    const r = expectColumnValuesToNotMatchLikePattern(data, 'name', 'z%');
    expect(r.success).toBe(true);
  });

  it('fails when some match', () => {
    const r = expectColumnValuesToNotMatchLikePattern(data, 'name', 'a%');
    expect(r.success).toBe(false);
  });
});

describe('expectColumnValuesToMatchLikePatternList', () => {
  it('passes with match_on=any (default)', () => {
    const r = expectColumnValuesToMatchLikePatternList(data, 'name', ['al%', 'bo%', 'an%']);
    expect(r.success).toBe(true);
  });

  it('fails when no pattern matches a value', () => {
    const r = expectColumnValuesToMatchLikePatternList(data, 'name', ['z%', 'x%']);
    expect(r.success).toBe(false);
    expect(r.unexpected_count).toBe(4);
  });
});

describe('expectColumnValuesToNotMatchLikePatternList', () => {
  it('passes when no value matches any pattern', () => {
    const r = expectColumnValuesToNotMatchLikePatternList(data, 'name', ['z%', 'x%']);
    expect(r.success).toBe(true);
  });

  it('fails when a value matches a pattern', () => {
    const r = expectColumnValuesToNotMatchLikePatternList(data, 'name', ['al%', 'z%']);
    expect(r.success).toBe(false);
    expect(r.unexpected_count).toBe(2);
  });
});
