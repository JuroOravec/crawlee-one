import { describe, expect, it } from 'vitest';

import {
  expectColumnValuesToBeDateutilParseable,
  expectColumnValuesToBeJsonParseable,
  expectColumnValuesToMatchRegex,
  expectColumnValuesToMatchRegexList,
  expectColumnValuesToMatchStrftimeFormat,
  expectColumnValuesToNotMatchRegex,
  expectColumnValuesToNotMatchRegexList,
} from './columnRegex.js';

describe('expectColumnValuesToMatchRegex', () => {
  it('passes when all match', () => {
    const d = [{ v: 'abc' }, { v: 'abd' }];
    expect(expectColumnValuesToMatchRegex(d, 'v', '^ab').success).toBe(true);
  });
  it('fails when some do not match', () => {
    const d = [{ v: 'abc' }, { v: 'xyz' }];
    const r = expectColumnValuesToMatchRegex(d, 'v', '^ab');
    expect(r.success).toBe(false);
    expect(r.unexpected_values).toEqual(['xyz']);
  });
  it('accepts RegExp objects', () => {
    const d = [{ v: 'ABC' }];
    expect(expectColumnValuesToMatchRegex(d, 'v', /abc/i).success).toBe(true);
  });
  it('treats null as non-matching', () => {
    const d = [{ v: null }];
    expect(expectColumnValuesToMatchRegex(d, 'v', '.*').success).toBe(false);
  });
});

describe('expectColumnValuesToNotMatchRegex', () => {
  it('passes when none match', () => {
    const d = [{ v: 'abc' }, { v: 'abd' }];
    expect(expectColumnValuesToNotMatchRegex(d, 'v', '^xy').success).toBe(true);
  });
  it('fails when some match', () => {
    const d = [{ v: 'abc' }, { v: 'xyz' }];
    expect(expectColumnValuesToNotMatchRegex(d, 'v', '^ab').success).toBe(false);
  });
  it('null values pass', () => {
    const d = [{ v: null }];
    expect(expectColumnValuesToNotMatchRegex(d, 'v', '.*').success).toBe(true);
  });
});

describe('expectColumnValuesToMatchRegexList', () => {
  it('passes with match_on=any', () => {
    const d = [{ v: 'abc' }, { v: 'xyz' }];
    expect(expectColumnValuesToMatchRegexList(d, 'v', ['^ab', '^xy']).success).toBe(true);
  });
  it('fails when no regex matches', () => {
    const d = [{ v: 'hello' }];
    expect(expectColumnValuesToMatchRegexList(d, 'v', ['^ab', '^xy']).success).toBe(false);
  });
  it('match_on=all requires all to match', () => {
    const d = [{ v: 'abc123' }];
    expect(
      expectColumnValuesToMatchRegexList(d, 'v', ['abc', '\\d+'], { match_on: 'all' }).success
    ).toBe(true);
    expect(
      expectColumnValuesToMatchRegexList(d, 'v', ['abc', '^\\d+$'], { match_on: 'all' }).success
    ).toBe(false);
  });
});

describe('expectColumnValuesToNotMatchRegexList', () => {
  it('passes when none match any regex', () => {
    const d = [{ v: 'hello' }];
    expect(expectColumnValuesToNotMatchRegexList(d, 'v', ['^ab', '^xy']).success).toBe(true);
  });
  it('fails when any regex matches', () => {
    const d = [{ v: 'abc' }];
    expect(expectColumnValuesToNotMatchRegexList(d, 'v', ['^ab', '^xy']).success).toBe(false);
  });
});

describe('expectColumnValuesToBeJsonParseable', () => {
  it('passes for valid JSON', () => {
    const d = [{ v: '{"a":1}' }, { v: '[1,2]' }, { v: '"hello"' }, { v: '42' }];
    expect(expectColumnValuesToBeJsonParseable(d, 'v').success).toBe(true);
  });
  it('fails for invalid JSON', () => {
    const d = [{ v: '{bad}' }, { v: '{"a":1}' }];
    const r = expectColumnValuesToBeJsonParseable(d, 'v');
    expect(r.success).toBe(false);
    expect(r.unexpected_count).toBe(1);
  });
  it('null is not JSON-parseable', () => {
    const d = [{ v: null }];
    expect(expectColumnValuesToBeJsonParseable(d, 'v').success).toBe(false);
  });
});

describe('expectColumnValuesToBeDateutilParseable', () => {
  it('passes for parseable dates', () => {
    const d = [{ v: '2024-01-15' }, { v: 'January 15, 2024' }];
    expect(expectColumnValuesToBeDateutilParseable(d, 'v').success).toBe(true);
  });
  it('fails for unparseable dates', () => {
    const d = [{ v: 'not-a-date' }];
    expect(expectColumnValuesToBeDateutilParseable(d, 'v').success).toBe(false);
  });
});

describe('expectColumnValuesToMatchStrftimeFormat', () => {
  it('passes for matching format', () => {
    const d = [{ v: '2024-01-15' }, { v: '2023-12-31' }];
    expect(expectColumnValuesToMatchStrftimeFormat(d, 'v', '%Y-%m-%d').success).toBe(true);
  });
  it('fails for non-matching format', () => {
    const d = [{ v: '15/01/2024' }];
    expect(expectColumnValuesToMatchStrftimeFormat(d, 'v', '%Y-%m-%d').success).toBe(false);
  });
  it('handles time formats', () => {
    const d = [{ v: '14:30:00' }];
    expect(expectColumnValuesToMatchStrftimeFormat(d, 'v', '%H:%M:%S').success).toBe(true);
  });
});
