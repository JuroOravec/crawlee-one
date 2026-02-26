import type { Dataset, ExpectationResult, MostlyOptions } from '../types.js';
import { buildColumnResult, getColumnValues } from '../utils.js';

function strip(s: string): string {
  return s.replace(/[-\s]/g, '');
}

function luhn(digits: number[]): boolean {
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = digits[i];
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

function isValidIsbn10(value: string): boolean {
  const s = strip(value);
  if (s.length !== 10) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    const ch = s.charCodeAt(i) - 48;
    if (ch < 0 || ch > 9) return false;
    sum += ch * (10 - i);
  }
  const last = s[9].toUpperCase();
  sum += last === 'X' ? 10 : Number(last);
  if (last !== 'X' && (Number(last) < 0 || Number(last) > 9 || Number.isNaN(Number(last))))
    return false;
  return sum % 11 === 0;
}

function isValidIsbn13(value: string): boolean {
  const s = strip(value);
  if (s.length !== 13) return false;
  let sum = 0;
  for (let i = 0; i < 13; i++) {
    const d = s.charCodeAt(i) - 48;
    if (d < 0 || d > 9) return false;
    sum += i % 2 === 0 ? d : d * 3;
  }
  return sum % 10 === 0;
}

function isValidEan(value: string): boolean {
  const s = strip(value);
  if (s.length !== 8 && s.length !== 13) return false;
  let sum = 0;
  for (let i = 0; i < s.length; i++) {
    const d = s.charCodeAt(i) - 48;
    if (d < 0 || d > 9) return false;
    // EAN-13: weights 1,3,1,3... EAN-8: weights 3,1,3,1...
    const weight = s.length === 13 ? (i % 2 === 0 ? 1 : 3) : i % 2 === 0 ? 3 : 1;
    sum += d * weight;
  }
  return sum % 10 === 0;
}

function isValidImei(value: string): boolean {
  const s = strip(value);
  if (s.length !== 15) return false;
  const digits: number[] = [];
  for (const ch of s) {
    const d = ch.charCodeAt(0) - 48;
    if (d < 0 || d > 9) return false;
    digits.push(d);
  }
  return luhn(digits);
}

function isValidIsin(value: string): boolean {
  const s = strip(value).toUpperCase();
  if (s.length !== 12) return false;
  if (!/^[A-Z]{2}/.test(s)) return false;
  let expanded = '';
  for (const ch of s) {
    const code = ch.charCodeAt(0);
    if (code >= 65 && code <= 90) {
      expanded += String(code - 55);
    } else if (code >= 48 && code <= 57) {
      expanded += ch;
    } else {
      return false;
    }
  }
  const digits = [...expanded].map((c) => c.charCodeAt(0) - 48);
  return luhn(digits);
}

function columnValidation(
  dataset: Dataset,
  column: string,
  predicate: (value: unknown) => boolean,
  options?: MostlyOptions
): ExpectationResult {
  return buildColumnResult(getColumnValues(dataset, column), predicate, options);
}

export function expectColumnValuesToBeValidIsbn10(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions
): ExpectationResult {
  return columnValidation(dataset, column, (v) => v != null && isValidIsbn10(String(v)), options);
}

export function expectColumnValuesToBeValidIsbn13(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions
): ExpectationResult {
  return columnValidation(dataset, column, (v) => v != null && isValidIsbn13(String(v)), options);
}

export function expectColumnValuesToBeValidEan(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions
): ExpectationResult {
  return columnValidation(dataset, column, (v) => v != null && isValidEan(String(v)), options);
}

export function expectColumnValuesToBeValidImei(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions
): ExpectationResult {
  return columnValidation(dataset, column, (v) => v != null && isValidImei(String(v)), options);
}

export function expectColumnValuesToBeValidIsin(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions
): ExpectationResult {
  return columnValidation(dataset, column, (v) => v != null && isValidIsin(String(v)), options);
}

// ── MEID (14 hex digits) ────────────────────────────────────────────

function isValidMeid(value: string): boolean {
  const s = strip(value).toUpperCase();
  if (s.length !== 14) return false;
  return /^[0-9A-F]{14}$/.test(s);
}

export function expectColumnValuesToBeValidMeid(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions
): ExpectationResult {
  return columnValidation(dataset, column, (v) => v != null && isValidMeid(String(v)), options);
}

// ── ISMN (International Standard Music Number, 13 digits) ───────────

function isValidIsmn(value: string): boolean {
  const s = strip(value);
  if (s.length !== 13) return false;
  if (!s.startsWith('9790')) return false;
  let sum = 0;
  for (let i = 0; i < 13; i++) {
    const d = s.charCodeAt(i) - 48;
    if (d < 0 || d > 9) return false;
    sum += i % 2 === 0 ? d : d * 3;
  }
  return sum % 10 === 0;
}

export function expectColumnValuesToBeValidIsmn(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions
): ExpectationResult {
  return columnValidation(dataset, column, (v) => v != null && isValidIsmn(String(v)), options);
}

// ── ISAN (International Standard Audiovisual Number) ────────────────

function isValidIsan(value: string): boolean {
  const clean = value
    .toUpperCase()
    .replace(/ISAN[:\s]*/i, '')
    .replace(/[-\s]/g, '');
  const hex = clean.replace(/[^0-9A-F]/g, '');
  if (hex.length < 16 || hex.length > 26) return false;
  return /^[0-9A-F]+$/.test(hex) && hex.length >= 16;
}

export function expectColumnValuesToBeValidIsan(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions
): ExpectationResult {
  return columnValidation(dataset, column, (v) => v != null && isValidIsan(String(v)), options);
}

// ── Barcode (general: EAN-8, EAN-13, UPC-A/12, GTIN-14) ────────────

function isValidBarcode(value: string): boolean {
  const s = strip(value);
  if (![8, 12, 13, 14].includes(s.length)) return false;
  for (const ch of s) {
    const d = ch.charCodeAt(0) - 48;
    if (d < 0 || d > 9) return false;
  }
  let sum = 0;
  for (let i = 0; i < s.length; i++) {
    const d = s.charCodeAt(i) - 48;
    const fromRight = s.length - 1 - i;
    sum += fromRight % 2 === 0 ? d : d * 3;
  }
  return sum % 10 === 0;
}

export function expectColumnValuesToBeValidBarcode(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions
): ExpectationResult {
  return columnValidation(dataset, column, (v) => v != null && isValidBarcode(String(v)), options);
}

// ── GTIN Base Unit (GTIN-8, GTIN-12, GTIN-13, GTIN-14) ────────────

function isValidGtin(value: string): boolean {
  const s = strip(value);
  if (![8, 12, 13, 14].includes(s.length)) return false;
  for (const ch of s) {
    if (ch < '0' || ch > '9') return false;
  }
  let sum = 0;
  for (let i = 0; i < s.length; i++) {
    const d = s.charCodeAt(i) - 48;
    const fromRight = s.length - 1 - i;
    sum += fromRight % 2 === 0 ? d : d * 3;
  }
  return sum % 10 === 0;
}

export function expectColumnValuesToBeGtinBaseUnit(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions
): ExpectationResult {
  return columnValidation(dataset, column, (v) => v != null && isValidGtin(String(v)), options);
}

// ── GTIN Variable Measure Trade Item ────────────────────────────────
// A variable measure GTIN starts with indicator digit 9 when in GTIN-14 form,
// or prefix 02 or 20-29 in GTIN-13 form.

function isGtinVariableMeasure(value: string): boolean {
  const s = strip(value);
  if (!isValidGtin(s)) return false;
  if (s.length === 14) return s[0] === '9';
  if (s.length === 13) {
    const prefix = parseInt(s.slice(0, 2), 10);
    return prefix === 2 || (prefix >= 20 && prefix <= 29);
  }
  return false;
}

export function expectColumnValuesToBeGtinVariableMeasureTradeItem(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions
): ExpectationResult {
  return columnValidation(
    dataset,
    column,
    (v) => v != null && isGtinVariableMeasure(String(v)),
    options
  );
}
