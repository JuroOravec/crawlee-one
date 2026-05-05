import type { Dataset, ExpectationResult, MostlyOptions } from '../types.js';
import { buildColumnResult, getColumnValues } from '../utils.js';

function columnValidation(
  dataset: Dataset,
  column: string,
  predicate: (value: unknown) => boolean,
  options?: MostlyOptions
): ExpectationResult {
  return buildColumnResult(getColumnValues(dataset, column), predicate, options);
}

// ── Prime number ────────────────────────────────────────────────────

function isPrime(n: number): boolean {
  if (!Number.isInteger(n) || n < 2) return false;
  if (n < 4) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
}

export function expectColumnValuesToBePrimeNumber(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions
): ExpectationResult {
  return columnValidation(
    dataset,
    column,
    (v) => {
      if (v == null) return false;
      const n = Number(v);
      return !Number.isNaN(n) && isPrime(n);
    },
    options
  );
}

// ── Fibonacci number ────────────────────────────────────────────────

function isPerfectSquare(n: number): boolean {
  if (n < 0) return false;
  const s = Math.round(Math.sqrt(n));
  return s * s === n;
}

function isFibonacci(n: number): boolean {
  if (!Number.isInteger(n) || n < 0) return false;
  return isPerfectSquare(5 * n * n + 4) || isPerfectSquare(5 * n * n - 4);
}

export function expectColumnValuesToBeFibonacciNumber(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions
): ExpectationResult {
  return columnValidation(
    dataset,
    column,
    (v) => {
      if (v == null) return false;
      const n = Number(v);
      return !Number.isNaN(n) && isFibonacci(n);
    },
    options
  );
}

// ── Leap year ───────────────────────────────────────────────────────

function isLeapYear(year: number): boolean {
  if (!Number.isInteger(year)) return false;
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function expectColumnValuesToBeValidLeapYear(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions
): ExpectationResult {
  return columnValidation(
    dataset,
    column,
    (v) => {
      if (v == null) return false;
      const n = parseInt(String(v), 10);
      return !Number.isNaN(n) && isLeapYear(n);
    },
    options
  );
}

// ── Pronic number (oblong) ───────────────────────────────────────────

function isPronic(n: number): boolean {
  if (!Number.isInteger(n) || n < 0) return false;
  if (n === 0) return true;
  const k = Math.floor(Math.sqrt(n));
  return k * (k + 1) === n;
}

export function expectColumnValuesToBeValidPronicNumber(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions
): ExpectationResult {
  return columnValidation(
    dataset,
    column,
    (v) => {
      if (v == null) return false;
      const n = Number(v);
      return !Number.isNaN(n) && isPronic(n);
    },
    options
  );
}

// ── Powerful number ──────────────────────────────────────────────────

function isPowerful(n: number): boolean {
  if (!Number.isInteger(n) || n < 1) return false;
  if (n === 1) return true;
  let rem = n;
  for (let p = 2; p * p <= rem; p++) {
    if (rem % p === 0) {
      rem /= p;
      if (rem % p !== 0) return false;
      while (rem % p === 0) rem /= p;
    }
  }
  return rem === 1;
}

export function expectColumnValuesToBeValidPowerfulNumber(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions
): ExpectationResult {
  return columnValidation(
    dataset,
    column,
    (v) => {
      if (v == null) return false;
      const n = Number(v);
      return !Number.isNaN(n) && isPowerful(n);
    },
    options
  );
}

// ── Semiprime ────────────────────────────────────────────────────────

function isSemiprime(n: number): boolean {
  if (!Number.isInteger(n) || n < 4) return false;
  let factors = 0;
  let rem = n;
  for (let p = 2; p * p <= rem; p++) {
    while (rem % p === 0) {
      factors++;
      rem /= p;
      if (factors > 2) return false;
    }
  }
  if (rem > 1) factors++;
  return factors === 2;
}

export function expectColumnValuesToBeValidSemiprime(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions
): ExpectationResult {
  return columnValidation(
    dataset,
    column,
    (v) => {
      if (v == null) return false;
      const n = Number(v);
      return !Number.isNaN(n) && isSemiprime(n);
    },
    options
  );
}

// ── Sphenic number ───────────────────────────────────────────────────

function isSphenic(n: number): boolean {
  if (!Number.isInteger(n) || n < 30) return false;
  const primeFactors: number[] = [];
  let rem = n;
  for (let p = 2; p * p <= rem && primeFactors.length < 3; p++) {
    if (rem % p === 0) {
      primeFactors.push(p);
      rem /= p;
      if (rem % p === 0) return false;
    }
  }
  if (rem > 1) primeFactors.push(rem);
  return primeFactors.length === 3;
}

export function expectColumnValuesToBeValidSphenicNumber(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions
): ExpectationResult {
  return columnValidation(
    dataset,
    column,
    (v) => {
      if (v == null) return false;
      const n = Number(v);
      return !Number.isNaN(n) && isSphenic(n);
    },
    options
  );
}

// ── Square-free number ───────────────────────────────────────────────

function isSquareFree(n: number): boolean {
  if (!Number.isInteger(n) || n < 1) return false;
  let rem = n;
  for (let p = 2; p * p <= rem; p++) {
    if (rem % p === 0) {
      rem /= p;
      if (rem % p === 0) return false;
    }
  }
  return true;
}

export function expectColumnValuesToBeValidSquareFreeNumber(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions
): ExpectationResult {
  return columnValidation(
    dataset,
    column,
    (v) => {
      if (v == null) return false;
      const n = Number(v);
      return !Number.isNaN(n) && isSquareFree(n);
    },
    options
  );
}
