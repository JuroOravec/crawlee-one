import { describe, it, expect } from 'vitest';
import {
  expectColumnValuesToBePrimeNumber,
  expectColumnValuesToBeFibonacciNumber,
  expectColumnValuesToBeValidLeapYear,
  expectColumnValuesToBeValidPronicNumber,
  expectColumnValuesToBeValidPowerfulNumber,
  expectColumnValuesToBeValidSemiprime,
  expectColumnValuesToBeValidSphenicNumber,
  expectColumnValuesToBeValidSquareFreeNumber,
} from './semanticMath.js';

describe('expectColumnValuesToBePrimeNumber', () => {
  it('passes for primes', () => {
    const d = [{ v: 2 }, { v: 3 }, { v: 5 }, { v: 7 }, { v: 11 }];
    expect(expectColumnValuesToBePrimeNumber(d, 'v').success).toBe(true);
  });

  it('fails for non-primes', () => {
    const d = [{ v: 0 }, { v: 1 }, { v: 4 }, { v: 9 }];
    const r = expectColumnValuesToBePrimeNumber(d, 'v');
    expect(r.success).toBe(false);
    expect(r.unexpected_count).toBe(4);
  });

  it('rejects negatives', () => {
    const d = [{ v: -7 }];
    expect(expectColumnValuesToBePrimeNumber(d, 'v').success).toBe(false);
  });

  it('supports mostly', () => {
    const d = [{ v: 2 }, { v: 3 }, { v: 4 }];
    expect(expectColumnValuesToBePrimeNumber(d, 'v', { mostly: 0.5 }).success).toBe(true);
  });

  it('handles string values', () => {
    const d = [{ v: '13' }, { v: '17' }];
    expect(expectColumnValuesToBePrimeNumber(d, 'v').success).toBe(true);
  });
});

describe('expectColumnValuesToBeFibonacciNumber', () => {
  it('passes for Fibonacci numbers', () => {
    const d = [
      { v: 0 },
      { v: 1 },
      { v: 1 },
      { v: 2 },
      { v: 3 },
      { v: 5 },
      { v: 8 },
      { v: 13 },
      { v: 21 },
      { v: 34 },
    ];
    expect(expectColumnValuesToBeFibonacciNumber(d, 'v').success).toBe(true);
  });

  it('fails for non-Fibonacci numbers', () => {
    const d = [{ v: 4 }, { v: 6 }, { v: 7 }];
    const r = expectColumnValuesToBeFibonacciNumber(d, 'v');
    expect(r.success).toBe(false);
    expect(r.unexpected_count).toBe(3);
  });

  it('rejects negatives', () => {
    const d = [{ v: -1 }];
    expect(expectColumnValuesToBeFibonacciNumber(d, 'v').success).toBe(false);
  });
});

describe('expectColumnValuesToBeValidLeapYear', () => {
  it('passes for leap years', () => {
    const d = [{ v: '4' }, { v: '400' }, { v: '1996' }, { v: '2000' }];
    expect(expectColumnValuesToBeValidLeapYear(d, 'v').success).toBe(true);
  });

  it('fails for non-leap years', () => {
    const d = [{ v: '1994' }, { v: '1997' }, { v: '1900' }];
    const r = expectColumnValuesToBeValidLeapYear(d, 'v');
    expect(r.success).toBe(false);
    expect(r.unexpected_count).toBe(3);
  });

  it('rejects non-numeric strings', () => {
    const d = [{ v: 'not a year' }];
    expect(expectColumnValuesToBeValidLeapYear(d, 'v').success).toBe(false);
  });

  it('handles numeric values', () => {
    const d = [{ v: 2024 }];
    expect(expectColumnValuesToBeValidLeapYear(d, 'v').success).toBe(true);
  });
});

describe('expectColumnValuesToBeValidPronicNumber', () => {
  it('passes for pronic numbers', () => {
    // 0=0*1, 2=1*2, 6=2*3, 12=3*4, 20=4*5, 30=5*6, 42=6*7
    const d = [{ v: 0 }, { v: 2 }, { v: 6 }, { v: 12 }, { v: 20 }, { v: 30 }, { v: 42 }];
    expect(expectColumnValuesToBeValidPronicNumber(d, 'v').success).toBe(true);
  });

  it('fails for non-pronic numbers', () => {
    const d = [{ v: 1 }, { v: 3 }, { v: 5 }, { v: 7 }];
    expect(expectColumnValuesToBeValidPronicNumber(d, 'v').success).toBe(false);
  });
});

describe('expectColumnValuesToBeValidPowerfulNumber', () => {
  it('passes for powerful numbers', () => {
    // 1, 4=2^2, 8=2^3, 9=3^2, 25=5^2, 27=3^3, 32=2^5, 36=2^2*3^2
    const d = [{ v: 1 }, { v: 4 }, { v: 8 }, { v: 9 }, { v: 25 }, { v: 36 }];
    expect(expectColumnValuesToBeValidPowerfulNumber(d, 'v').success).toBe(true);
  });

  it('fails for non-powerful numbers', () => {
    // 6=2*3 (3 divides but 9 doesn't), 12=2^2*3 (3 but not 9)
    const d = [{ v: 6 }, { v: 12 }, { v: 10 }];
    expect(expectColumnValuesToBeValidPowerfulNumber(d, 'v').success).toBe(false);
  });
});

describe('expectColumnValuesToBeValidSemiprime', () => {
  it('passes for semiprimes', () => {
    // 4=2*2, 6=2*3, 9=3*3, 10=2*5, 14=2*7, 15=3*5
    const d = [{ v: 4 }, { v: 6 }, { v: 9 }, { v: 10 }, { v: 14 }, { v: 15 }];
    expect(expectColumnValuesToBeValidSemiprime(d, 'v').success).toBe(true);
  });

  it('fails for non-semiprimes', () => {
    // 1 (0 factors), 2 (1 factor), 8=2^3 (3 factors), 30=2*3*5 (3 factors)
    const d = [{ v: 1 }, { v: 2 }, { v: 8 }, { v: 30 }];
    expect(expectColumnValuesToBeValidSemiprime(d, 'v').success).toBe(false);
  });
});

describe('expectColumnValuesToBeValidSphenicNumber', () => {
  it('passes for sphenic numbers', () => {
    // 30=2*3*5, 42=2*3*7, 66=2*3*11, 70=2*5*7
    const d = [{ v: 30 }, { v: 42 }, { v: 66 }, { v: 70 }];
    expect(expectColumnValuesToBeValidSphenicNumber(d, 'v').success).toBe(true);
  });

  it('fails for non-sphenic numbers', () => {
    // 4=2^2 (not 3 distinct), 12=2^2*3 (not squarefree), 2 (prime)
    const d = [{ v: 4 }, { v: 12 }, { v: 2 }, { v: 29 }];
    expect(expectColumnValuesToBeValidSphenicNumber(d, 'v').success).toBe(false);
  });
});

describe('expectColumnValuesToBeValidSquareFreeNumber', () => {
  it('passes for square-free numbers', () => {
    // 1, 2, 3, 5, 6=2*3, 7, 10=2*5, 15=3*5, 30=2*3*5
    const d = [{ v: 1 }, { v: 2 }, { v: 3 }, { v: 6 }, { v: 10 }, { v: 30 }];
    expect(expectColumnValuesToBeValidSquareFreeNumber(d, 'v').success).toBe(true);
  });

  it('fails for non-square-free numbers', () => {
    // 4=2^2, 8=2^3, 9=3^2, 12=2^2*3, 18=2*3^2
    const d = [{ v: 4 }, { v: 8 }, { v: 9 }, { v: 12 }, { v: 18 }];
    expect(expectColumnValuesToBeValidSquareFreeNumber(d, 'v').success).toBe(false);
  });
});
