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

// ── Format validators ──────────────────────────────────────────────

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function expectColumnValuesToBeValidUuid(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions
): ExpectationResult {
  return columnValidation(dataset, column, (v) => v != null && UUID_RE.test(String(v)), options);
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function expectColumnValuesToContainValidEmail(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions
): ExpectationResult {
  return columnValidation(dataset, column, (v) => v != null && EMAIL_RE.test(String(v)), options);
}

export function expectColumnValuesToBeAscii(
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
      for (let i = 0; i < s.length; i++) {
        if (s.charCodeAt(i) > 127) return false;
      }
      return true;
    },
    options
  );
}

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function expectColumnValuesToBeSlug(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions
): ExpectationResult {
  return columnValidation(dataset, column, (v) => v != null && SLUG_RE.test(String(v)), options);
}

const HEX_COLOR_RE = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

export function expectColumnValuesToBeValidHexColor(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions
): ExpectationResult {
  return columnValidation(
    dataset,
    column,
    (v) => v != null && HEX_COLOR_RE.test(String(v)),
    options
  );
}

const MD5_RE = /^[0-9a-fA-F]{32}$/;

export function expectColumnValuesToBeValidMd5(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions
): ExpectationResult {
  return columnValidation(dataset, column, (v) => v != null && MD5_RE.test(String(v)), options);
}

const SHA1_RE = /^[0-9a-fA-F]{40}$/;

export function expectColumnValuesToBeValidSha1(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions
): ExpectationResult {
  return columnValidation(dataset, column, (v) => v != null && SHA1_RE.test(String(v)), options);
}

const BASE64_RE = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;

export function expectColumnValuesToBeValidBase64(
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
      return s.length > 0 && BASE64_RE.test(s);
    },
    options
  );
}

const HASHTAG_RE = /^#\w+$/u;

export function expectColumnValuesToBeValidHashtag(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions
): ExpectationResult {
  return columnValidation(dataset, column, (v) => v != null && HASHTAG_RE.test(String(v)), options);
}

// ── Network validators ─────────────────────────────────────────────

export function expectColumnValuesToBeValidUrls(
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
        new URL(String(v));
        return true;
      } catch {
        return false;
      }
    },
    options
  );
}

const IPV4_RE = /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/;

export function expectColumnValuesToBeValidIpv4(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions
): ExpectationResult {
  return columnValidation(dataset, column, (v) => v != null && IPV4_RE.test(String(v)), options);
}

const IPV6_RE =
  /^(?:(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|(?:[0-9a-fA-F]{1,4}:){1,7}:|(?:[0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|(?:[0-9a-fA-F]{1,4}:){1,5}(?::[0-9a-fA-F]{1,4}){1,2}|(?:[0-9a-fA-F]{1,4}:){1,4}(?::[0-9a-fA-F]{1,4}){1,3}|(?:[0-9a-fA-F]{1,4}:){1,3}(?::[0-9a-fA-F]{1,4}){1,4}|(?:[0-9a-fA-F]{1,4}:){1,2}(?::[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:(?::[0-9a-fA-F]{1,4}){1,6}|:(?::[0-9a-fA-F]{1,4}){1,7}|::)$/;

export function expectColumnValuesToBeValidIpv6(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions
): ExpectationResult {
  return columnValidation(dataset, column, (v) => v != null && IPV6_RE.test(String(v)), options);
}

const MAC_RE = /^(?:[0-9a-fA-F]{2}[:-]){5}[0-9a-fA-F]{2}$/;

export function expectColumnValuesToBeValidMac(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions
): ExpectationResult {
  return columnValidation(dataset, column, (v) => v != null && MAC_RE.test(String(v)), options);
}

// Full IANA HTTP Method Registry: https://www.iana.org/assignments/http-methods/http-methods.xhtml
// (Python GE upstream uses only the 8 RFC 9110 core methods — no PATCH — we include all registered.)

const HTTP_METHODS = new Set([
  'ACL',
  'BASELINE-CONTROL',
  'BIND',
  'CHECKIN',
  'CHECKOUT',
  'CONNECT',
  'COPY',
  'DELETE',
  'GET',
  'HEAD',
  'LABEL',
  'LINK',
  'LOCK',
  'MERGE',
  'MKACTIVITY',
  'MKCALENDAR',
  'MKCOL',
  'MKREDIRECTREF',
  'MKWORKSPACE',
  'MOVE',
  'OPTIONS',
  'ORDERPATCH',
  'PATCH',
  'POST',
  'PRI',
  'PROPFIND',
  'PROPPATCH',
  'PUT',
  'QUERY',
  'REBIND',
  'REPORT',
  'SEARCH',
  'TRACE',
  'UNBIND',
  'UNCHECKOUT',
  'UNLINK',
  'UNLOCK',
  'UPDATE',
  'UPDATEREDIRECTREF',
  'VERSION-CONTROL',
]);

export function expectColumnValuesToBeValidHttpMethod(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions
): ExpectationResult {
  return columnValidation(
    dataset,
    column,
    (v) => v != null && HTTP_METHODS.has(String(v).toUpperCase()),
    options
  );
}

/** Alias — plural form used by some upstream references. */
export const expectColumnValuesToBeValidHttpMethods = expectColumnValuesToBeValidHttpMethod;

export function expectColumnValuesToBeValidHttpStatusCode(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions
): ExpectationResult {
  return columnValidation(
    dataset,
    column,
    (v) => {
      if (v == null) return false;
      const code = Number(v);
      return Number.isInteger(code) && code >= 100 && code <= 599;
    },
    options
  );
}

export function expectColumnValuesToBeValidTcpPort(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions
): ExpectationResult {
  return columnValidation(
    dataset,
    column,
    (v) => {
      if (v == null) return false;
      const port = Number(v);
      return Number.isInteger(port) && port >= 0 && port <= 65535;
    },
    options
  );
}

export function expectColumnValuesToBeValidUdpPort(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions
): ExpectationResult {
  return expectColumnValuesToBeValidTcpPort(dataset, column, options);
}

// ── Datetime validators ────────────────────────────────────────────

export function expectColumnValuesToBeValidDate(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions
): ExpectationResult {
  return columnValidation(
    dataset,
    column,
    (v) => {
      if (v == null) return false;
      return !Number.isNaN(new Date(String(v)).getTime());
    },
    options
  );
}

export function expectColumnValuesToBeWeekday(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions
): ExpectationResult {
  return columnValidation(
    dataset,
    column,
    (v) => {
      if (v == null) return false;
      const d = new Date(String(v));
      if (Number.isNaN(d.getTime())) return false;
      const day = d.getUTCDay();
      return day !== 0 && day !== 6;
    },
    options
  );
}
