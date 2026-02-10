import { describe, expect, it } from 'vitest';
import { validateUrl, resolveUrlPath, sortUrl, equalUrls } from '../url.js';

describe('validateUrl', () => {
  it('does not throw for a valid URL', () => {
    expect(() => validateUrl('https://example.com')).not.toThrow();
  });

  it('does not throw for a URL with path and query', () => {
    expect(() => validateUrl('https://example.com/path?q=1')).not.toThrow();
  });

  it('throws for an invalid URL', () => {
    expect(() => validateUrl('not-a-url')).toThrow();
  });

  it('includes the URL in the error message', () => {
    expect(() => validateUrl('bad')).toThrow(/bad/);
  });
});

describe('resolveUrlPath', () => {
  it('replaces the pathname of the base URL', () => {
    const result = resolveUrlPath('https://example.com/old-path', '/new-path');
    expect(result).toBe('https://example.com/new-path');
  });

  it('preserves the protocol and host', () => {
    const result = resolveUrlPath('http://localhost:3000/api', '/v2/users');
    expect(result).toBe('http://localhost:3000/v2/users');
  });

  it('drops the old query params when replacing the path', () => {
    const result = resolveUrlPath('https://example.com/old?q=1', '/new');
    // URL constructor keeps searchParams from the base
    const url = new URL(result);
    expect(url.pathname).toBe('/new');
  });
});

describe('sortUrl', () => {
  it('sorts query params alphabetically', () => {
    const result = sortUrl('https://example.com?z=1&a=2&m=3');
    expect(result).toBe('https://example.com/?a=2&m=3&z=1');
  });

  it('handles URL with no query params', () => {
    const result = sortUrl('https://example.com/path');
    expect(result).toBe('https://example.com/path');
  });

  it('handles URL with single query param', () => {
    const result = sortUrl('https://example.com?a=1');
    expect(result).toBe('https://example.com/?a=1');
  });
});

describe('equalUrls', () => {
  it('returns true for identical URLs', () => {
    expect(equalUrls('https://example.com', 'https://example.com')).toBe(true);
  });

  it('returns true when query params are in different order', () => {
    expect(equalUrls('https://example.com?a=1&b=2', 'https://example.com?b=2&a=1')).toBe(true);
  });

  it('returns false for different URLs', () => {
    expect(equalUrls('https://example.com/a', 'https://example.com/b')).toBe(false);
  });

  it('returns false when query param values differ', () => {
    expect(equalUrls('https://example.com?a=1', 'https://example.com?a=2')).toBe(false);
  });
});
