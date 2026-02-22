import { isValidPhoneNumber } from 'libphonenumber-js';
import mccMncList from 'mcc-mnc-list';

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

// ── IMSI (International Mobile Subscriber Identity) ─────────────────

const IMSI_RE = /^\d{15}$/;

export function expectColumnValuesToBeValidImsi(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions
): ExpectationResult {
  return columnValidation(dataset, column, (v) => v != null && IMSI_RE.test(String(v)), options);
}

// ── IMSI belong to country code (MCC lookup) ────────────────────────
// Uses mcc-mnc-list (ITU-T E.212, https://en.wikipedia.org/wiki/Mobile_country_code).
// One MCC can map to multiple countries (e.g. 310 → US, PR, GU, VI, …).

const MCC_TO_COUNTRIES: Record<string, Set<string>> = (() => {
  const map: Record<string, Set<string>> = {};
  for (const r of mccMncList.all()) {
    if (r.mcc && r.countryCode) {
      if (!map[r.mcc]) map[r.mcc] = new Set();
      map[r.mcc].add(r.countryCode);
    }
  }
  return map;
})();

export function expectColumnValuesToBeValidImsiCountryCode(
  dataset: Dataset,
  column: string,
  countryCode: string,
  options?: MostlyOptions
): ExpectationResult {
  const cc = countryCode.toUpperCase();
  return columnValidation(
    dataset,
    column,
    (v) => {
      if (v == null) return false;
      const s = String(v);
      if (!IMSI_RE.test(s)) return false;
      const mcc = s.slice(0, 3);
      return MCC_TO_COUNTRIES[mcc]?.has(cc) ?? false;
    },
    options
  );
}

// ── Phone number ────────────────────────────────────────────────────

export function expectColumnValuesToBeValidPhonenumber(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions
): ExpectationResult {
  return columnValidation(
    dataset,
    column,
    (v) => {
      if (v == null) return false;
      try {
        return isValidPhoneNumber(String(v));
      } catch {
        return false;
      }
    },
    options
  );
}
