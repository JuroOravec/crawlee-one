import { describe, it, expect, vi } from 'vitest';

import { logAndRethrow } from './error';

describe('logAndRethrow', () => {
  it('rethrows the error', () => {
    const error = new Error('test error');
    expect(() => logAndRethrow(error)).toThrow('test error');
  });

  it('calls the custom logger before rethrowing', () => {
    const logger = vi.fn();
    const error = new Error('logged');
    expect(() => logAndRethrow(error, logger)).toThrow('logged');
    expect(logger).toHaveBeenCalledWith(error);
  });

  it('defaults to console.error when no logger is provided', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const error = new Error('console');
    expect(() => logAndRethrow(error)).toThrow('console');
    expect(spy).toHaveBeenCalledWith(error);
    spy.mockRestore();
  });

  it('works with non-Error values', () => {
    const logger = vi.fn();
    expect(() => logAndRethrow('string error', logger)).toThrow('string error');
    expect(logger).toHaveBeenCalledWith('string error');
  });
});
