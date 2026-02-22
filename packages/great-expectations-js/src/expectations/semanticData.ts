import countries from 'i18n-iso-countries';
import currencyCodes from 'currency-codes';
import ISO6391 from 'iso-639-1';
import { states as statesUs } from 'states-us';
import statuses from 'statuses';
import tlds from 'tlds';

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

// ── ISO Country (ISO 3166) ──────────────────────────────────────────
// Data from i18n-iso-countries; standard: https://www.iso.org/iso-3166-country-codes.html

const COUNTRY_ALPHA2 = new Set(Object.keys(countries.getAlpha2Codes()));
const COUNTRY_ALPHA3 = new Set(Object.keys(countries.getAlpha3Codes()));
const COUNTRY_NUMERIC = new Set(Object.keys(countries.getNumericCodes()));
const officialNames = Object.values(countries.getNames('en', { select: 'official' })).map((n) =>
  n.toLowerCase()
);
const aliasNames = Object.values(countries.getNames('en', { select: 'alias' }))
  .filter(Boolean)
  .map((n) => String(n).toLowerCase());
const COUNTRY_NAMES = new Set([...officialNames, ...aliasNames]);

function isValidIsoCountry(value: string): boolean {
  const upper = value.toUpperCase();
  if (COUNTRY_ALPHA2.has(upper)) return true;
  if (COUNTRY_ALPHA3.has(upper)) return true;
  if (COUNTRY_NUMERIC.has(value)) return true;
  if (COUNTRY_NAMES.has(value.toLowerCase())) return true;
  return false;
}

export function expectColumnValuesToBeValidIsoCountry(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions
): ExpectationResult {
  return columnValidation(
    dataset,
    column,
    (v) => v != null && isValidIsoCountry(String(v)),
    options
  );
}

// ── Currency Code (ISO 4217) ────────────────────────────────────────
// Data from currency-codes; standard: https://www.iso.org/iso-4217-currency-codes.html

const CURRENCY_SET = new Set(currencyCodes.codes());

export function expectColumnValuesToBeValidCurrencyCode(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions
): ExpectationResult {
  return columnValidation(
    dataset,
    column,
    (v) => v != null && CURRENCY_SET.has(String(v).toUpperCase()),
    options
  );
}

// ── IANA Timezone ───────────────────────────────────────────────────
// From Intl.supportedValuesOf + UTC/GMT; full list: https://www.iana.org/time-zones

let TIMEZONE_SET: Set<string> | null = null;

function getTimezoneSet(): Set<string> {
  if (TIMEZONE_SET) return TIMEZONE_SET;
  try {
    TIMEZONE_SET = new Set(Intl.supportedValuesOf('timeZone'));
  } catch {
    TIMEZONE_SET = new Set();
  }
  TIMEZONE_SET.add('UTC');
  TIMEZONE_SET.add('GMT');
  return TIMEZONE_SET;
}

export function expectColumnValuesToBeValidIanaTimezone(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions
): ExpectationResult {
  const tzSet = getTimezoneSet();
  return columnValidation(dataset, column, (v) => v != null && tzSet.has(String(v)), options);
}

// ── ISO Language (ISO 639-1 two-letter codes) ───────────────────────
// Data from iso-639-1; standard: https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes

export function expectColumnValuesToBeIsoLanguages(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions
): ExpectationResult {
  return columnValidation(
    dataset,
    column,
    (v) => v != null && ISO6391.validate(String(v).toLowerCase()),
    options
  );
}

// ── HTTP Status Name ────────────────────────────────────────────────
// Data from statuses (IANA + Node/NGINX/Apache): https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml

function isValidHttpStatusName(value: string): boolean {
  try {
    statuses(value);
    return true;
  } catch {
    return false;
  }
}

export function expectColumnValuesToBeValidHttpStatusName(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions
): ExpectationResult {
  return columnValidation(
    dataset,
    column,
    (v) => v != null && isValidHttpStatusName(String(v)),
    options
  );
}

// ── MIME Type ────────────────────────────────────────────────────────

const MIME_RE = /^(application|audio|font|image|message|model|multipart|text|video)\/[\w.+*-]+$/i;

export function expectColumnValuesToBeValidMime(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions
): ExpectationResult {
  return columnValidation(dataset, column, (v) => v != null && MIME_RE.test(String(v)), options);
}

// ── MBTI ────────────────────────────────────────────────────────────
// 16 Myers–Briggs types: https://www.myersbriggs.org/my-mbti-personality-type/mbti-basics/the-16-mbti-types.htm

const MBTI_SET = new Set([
  'ISTJ',
  'ISFJ',
  'INFJ',
  'INTJ',
  'ISTP',
  'ISFP',
  'INFP',
  'INTP',
  'ESTP',
  'ESFP',
  'ENFP',
  'ENTP',
  'ESTJ',
  'ESFJ',
  'ENFJ',
  'ENTJ',
]);

export function expectColumnValuesToBeValidMbti(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions
): ExpectationResult {
  return columnValidation(
    dataset,
    column,
    (v) => v != null && MBTI_SET.has(String(v).toUpperCase()),
    options
  );
}

// ── TLD ─────────────────────────────────────────────────────────────
// IANA/ICANN list via tlds package: https://data.iana.org/TLD/tlds-alpha-by-domain.txt

const TLD_SET = new Set(tlds);

export function expectColumnValuesToBeValidTld(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions
): ExpectationResult {
  return columnValidation(
    dataset,
    column,
    (v) => {
      if (v == null) return false;
      const s = String(v).toLowerCase();
      const tld = s.startsWith('.') ? s.slice(1) : s;
      return TLD_SET.has(tld);
    },
    options
  );
}

// ── US State ────────────────────────────────────────────────────────
// Data from states-us: https://github.com/justinlettau/states-us

const STATES_ONLY = statesUs.filter((s) => !s.territory);
const US_STATE_ABBR_SET = new Set(STATES_ONLY.map((s) => s.abbreviation));
const US_STATE_NAME_SET = new Set(STATES_ONLY.map((s) => s.name.toLowerCase()));

const US_STATE_OR_TERRITORY_ABBR = new Set(statesUs.map((s) => s.abbreviation));
const US_STATE_OR_TERRITORY_NAME = new Set(statesUs.map((s) => s.name.toLowerCase()));

export function expectColumnValuesToBeValidUsState(
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
      return US_STATE_ABBR_SET.has(s.toUpperCase()) || US_STATE_NAME_SET.has(s.toLowerCase());
    },
    options
  );
}

export function expectColumnValuesToBeValidUsStateAbbreviation(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions
): ExpectationResult {
  return columnValidation(
    dataset,
    column,
    (v) => v != null && US_STATE_ABBR_SET.has(String(v).toUpperCase()),
    options
  );
}

export function expectColumnValuesToBeValidUsStateOrTerritory(
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
      return (
        US_STATE_OR_TERRITORY_ABBR.has(s.toUpperCase()) ||
        US_STATE_OR_TERRITORY_NAME.has(s.toLowerCase())
      );
    },
    options
  );
}

export function expectColumnValuesToBeValidUsStateOrTerritoryAbbreviation(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions
): ExpectationResult {
  return columnValidation(
    dataset,
    column,
    (v) => v != null && US_STATE_OR_TERRITORY_ABBR.has(String(v).toUpperCase()),
    options
  );
}

// ── Country (relaxed — official + alias names from i18n-iso-countries) ─
// https://www.iso.org/iso-3166-country-codes.html

export function expectColumnValuesToBeValidCountry(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions
): ExpectationResult {
  return columnValidation(
    dataset,
    column,
    (v) => v != null && isValidIsoCountry(String(v)),
    options
  );
}
