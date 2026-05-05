import { electronicFormatIBAN, isValidIBAN } from 'ibantools';
import { checkVAT, countries } from 'jsvat';

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

// ── IBAN ─────────────────────────────────────────────────────────────
// Uses ibantools for validation (ISO 13616 / ECB specs).

export function expectColumnValuesToBeValidIban(
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
      const electronic = electronicFormatIBAN(s);
      return electronic != null && isValidIBAN(electronic);
    },
    options
  );
}

// ── BIC / SWIFT ─────────────────────────────────────────────────────

const BIC_RE = /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/;

export function expectColumnValuesToBeValidBic(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions
): ExpectationResult {
  return columnValidation(
    dataset,
    column,
    (v) => v != null && BIC_RE.test(String(v).toUpperCase()),
    options
  );
}

// ── VAT Number (EU formatted) ───────────────────────────────────────
// Uses jsvat for format validation (EC VIES specs).

export function expectColumnValuesToBeValidFormattedVat(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions
): ExpectationResult {
  return columnValidation(
    dataset,
    column,
    (v) => {
      if (v == null) return false;
      const s = String(v)
        .replace(/[\s.-]/g, '')
        .toUpperCase();
      if (s.length < 4) return false;
      const result = checkVAT(s, countries);
      return result.isValidFormat;
    },
    options
  );
}
