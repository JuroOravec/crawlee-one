import { describe, expect, it } from 'vitest';

import {
  expectColumnValuesToBeValidUuid,
  expectColumnValuesToNotBeNull,
  expectTableRowCountToEqual,
} from './index.js';

describe('great-expectations-js', () => {
  it('smoke test: table expectation works', () => {
    const data = [{ a: 1 }, { a: 2 }];
    const result = expectTableRowCountToEqual(data, 2);
    expect(result.success).toBe(true);
    expect(result.unexpected_count).toBe(0);
  });

  it('smoke test: column expectation works', () => {
    const data = [{ email: 'a@b.com' }, { email: null }];
    const result = expectColumnValuesToNotBeNull(data, 'email');
    expect(result.success).toBe(false);
    expect(result.unexpected_count).toBe(1);
  });

  it('smoke test: semantic expectation works', () => {
    const data = [{ id: '550e8400-e29b-41d4-a716-446655440000' }];
    const result = expectColumnValuesToBeValidUuid(data, 'id');
    expect(result.success).toBe(true);
  });
});
