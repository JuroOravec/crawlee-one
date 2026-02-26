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

// ── SSN ─────────────────────────────────────────────────────────────

const SSN_RE = /^(?!000|666)[0-8]\d{2}-(?!00)\d{2}-(?!0000)\d{4}$/;

export function expectColumnValuesToBeValidSsn(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions
): ExpectationResult {
  return columnValidation(dataset, column, (v) => v != null && SSN_RE.test(String(v)), options);
}

// ── IMDb ID ─────────────────────────────────────────────────────────

const IMDB_ID_RE =
  /^ev\d{7}\/(19|20)\d{2}(\/[12])?$|^tt\d{7,8}\/characters\/nm\d{7,8}$|^(tt|ni|nm)\d{8}$|^(ch|co|ev|tt|nm)\d{7}$/;

export function expectColumnValuesToBeValidImdbId(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions
): ExpectationResult {
  return columnValidation(dataset, column, (v) => v != null && IMDB_ID_RE.test(String(v)), options);
}

// ── DOI ─────────────────────────────────────────────────────────────

const DOI_RE = /^10\.\d{4,9}\/[-._;()/:A-Z0-9]+$/i;

export function expectColumnValuesToBeValidDoi(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions
): ExpectationResult {
  return columnValidation(dataset, column, (v) => v != null && DOI_RE.test(String(v)), options);
}

// ── ORCID ───────────────────────────────────────────────────────────

const ORCID_RE = /^0000-000(1-[5-9]|2-[0-9]|3-[0-4])\d{3}-\d{3}[\dX]$/;

export function expectColumnValuesToBeValidOrcid(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions
): ExpectationResult {
  return columnValidation(dataset, column, (v) => v != null && ORCID_RE.test(String(v)), options);
}

// ── arXiv ID (offline regex — upstream uses API calls) ──────────────

const ARXIV_NEW_RE = /^\d{4}\.\d{4,5}(v\d+)?$/;
const ARXIV_OLD_RE = /^[a-z-]+\/\d{7}(v\d+)?$/;

export function expectColumnValuesToBeValidArxivId(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions
): ExpectationResult {
  return columnValidation(
    dataset,
    column,
    (v) => {
      if (v == null) return false;
      const s = String(v);
      return ARXIV_NEW_RE.test(s) || ARXIV_OLD_RE.test(s);
    },
    options
  );
}

// ── PubMed ID ───────────────────────────────────────────────────────

const PUBMED_ID_RE = /^([1-3]\d{7}|[1-9]\d{0,6})$/;

export function expectColumnValuesToBeValidPubmedId(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions
): ExpectationResult {
  return columnValidation(
    dataset,
    column,
    (v) => v != null && PUBMED_ID_RE.test(String(v)),
    options
  );
}

// ── Roman numeral ───────────────────────────────────────────────────

const ROMAN_RE = /^(?=[MDCLXVI])M*(C[MD]|D?C{0,3})(X[CL]|L?X{0,3})(I[XV]|V?I{0,3})$/;

export function expectColumnValuesToBeValidRomanNumeral(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions
): ExpectationResult {
  return columnValidation(dataset, column, (v) => v != null && ROMAN_RE.test(String(v)), options);
}

// ── Base32 (inline decode — upstream uses base64.b32decode) ─────────

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

function isValidBase32(value: string): boolean {
  const s = value.replace(/\s/g, '');
  if (s.length === 0) return false;
  if (s.length % 8 !== 0) return false;
  const padIdx = s.indexOf('=');
  const data = padIdx === -1 ? s : s.slice(0, padIdx);
  const pad = padIdx === -1 ? '' : s.slice(padIdx);
  if (!/^[A-Z2-7]*$/.test(data)) return false;
  if (!/^=*$/.test(pad)) return false;
  for (const ch of data) {
    if (!BASE32_ALPHABET.includes(ch)) return false;
  }
  const validPadLengths = [0, 1, 3, 4, 6];
  return validPadLengths.includes(pad.length);
}

export function expectColumnValuesToBeValidBase32(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions
): ExpectationResult {
  return columnValidation(dataset, column, (v) => v != null && isValidBase32(String(v)), options);
}

// ── XML parseable ───────────────────────────────────────────────────

function isXmlParseable(value: string): boolean {
  const s = value.trim();
  if (!s.startsWith('<')) return false;
  const tagStack: string[] = [];
  const tagRe = /<\/?([a-zA-Z][\w.-]*)[^>]*\/?>/g;
  let match: RegExpExecArray | null;
  while ((match = tagRe.exec(s)) !== null) {
    const full = match[0];
    const name = match[1];
    if (full.startsWith('</')) {
      if (tagStack.length === 0 || tagStack[tagStack.length - 1] !== name) return false;
      tagStack.pop();
    } else if (!full.endsWith('/>')) {
      tagStack.push(name);
    }
  }
  return tagStack.length === 0;
}

export function expectColumnValuesToBeXmlParseable(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions
): ExpectationResult {
  return columnValidation(dataset, column, (v) => v != null && isXmlParseable(String(v)), options);
}

// ── Temperature ─────────────────────────────────────────────────────

const TEMP_RE = /^-?\d+(\.\d+)?\s*°?\s*[CFK]$/i;

export function expectColumnValuesToBeValidTemperature(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions
): ExpectationResult {
  return columnValidation(dataset, column, (v) => v != null && TEMP_RE.test(String(v)), options);
}

// ── Price ───────────────────────────────────────────────────────────

const PRICE_RE = /^[$€£¥₹]?\s*-?\d{1,3}(,?\d{3})*(\.\d{1,2})?\s*[A-Z]{0,3}$/;

export function expectColumnValuesToBeValidPrice(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions
): ExpectationResult {
  return columnValidation(
    dataset,
    column,
    (v) => v != null && PRICE_RE.test(String(v).trim()),
    options
  );
}

// ── Open Library ID ─────────────────────────────────────────────────

const OL_ID_RE = /^OL\d+[AMW]$/;

export function expectColumnValuesToBeValidOpenLibraryId(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions
): ExpectationResult {
  return columnValidation(dataset, column, (v) => v != null && OL_ID_RE.test(String(v)), options);
}

// ── Secure password ─────────────────────────────────────────────────

export interface PasswordOptions extends MostlyOptions {
  min_length?: number;
  require_uppercase?: boolean;
  require_lowercase?: boolean;
  require_digit?: boolean;
  require_special?: boolean;
}

function isSecurePassword(value: string, opts: PasswordOptions): boolean {
  const minLen = opts.min_length ?? 8;
  if (value.length < minLen) return false;
  if ((opts.require_uppercase ?? true) && !/[A-Z]/.test(value)) return false;
  if ((opts.require_lowercase ?? true) && !/[a-z]/.test(value)) return false;
  if ((opts.require_digit ?? true) && !/\d/.test(value)) return false;
  if ((opts.require_special ?? true) && !/[^A-Za-z0-9]/.test(value)) return false;
  return true;
}

export function expectColumnValuesToBeSecurePasswords(
  dataset: Dataset,
  column: string,
  options?: PasswordOptions
): ExpectationResult {
  const opts = options ?? {};
  return columnValidation(
    dataset,
    column,
    (v) => v != null && isSecurePassword(String(v), opts),
    opts
  );
}

// ── Vectors (array of numbers) ──────────────────────────────────────

function isVector(value: unknown): boolean {
  if (!Array.isArray(value)) return false;
  return value.length > 0 && value.every((el) => typeof el === 'number' && !Number.isNaN(el));
}

export function expectColumnValuesToBeVectors(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions
): ExpectationResult {
  return columnValidation(dataset, column, (v) => v != null && isVector(v), options);
}
