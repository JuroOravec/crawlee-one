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

// ── Private IPv4 ────────────────────────────────────────────────────

function parseIpv4Octets(s: string): number[] | null {
  const parts = s.split('.');
  if (parts.length !== 4) return null;
  const octets: number[] = [];
  for (const p of parts) {
    const n = Number(p);
    if (!Number.isInteger(n) || n < 0 || n > 255 || p !== String(n)) return null;
    octets.push(n);
  }
  return octets;
}

type Ipv4Class = 'A' | 'B' | 'C' | null;

function privateIpv4Class(octets: number[]): Ipv4Class {
  if (octets[0] === 10) return 'A';
  if (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) return 'B';
  if (octets[0] === 192 && octets[1] === 168) return 'C';
  return null;
}

export function expectColumnValuesToBePrivateIpV4(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions
): ExpectationResult {
  return columnValidation(
    dataset,
    column,
    (v) => {
      if (v == null) return false;
      const octets = parseIpv4Octets(String(v));
      return octets !== null && privateIpv4Class(octets) !== null;
    },
    options
  );
}

export function expectColumnValuesToBePrivateIpv4Class(
  dataset: Dataset,
  column: string,
  ipClass: 'A' | 'B' | 'C',
  options?: MostlyOptions
): ExpectationResult {
  return columnValidation(
    dataset,
    column,
    (v) => {
      if (v == null) return false;
      const octets = parseIpv4Octets(String(v));
      return octets !== null && privateIpv4Class(octets) === ipClass;
    },
    options
  );
}

// ── Private IPv6 ────────────────────────────────────────────────────

function isPrivateIpv6(value: string): boolean {
  const s = value.trim().toLowerCase();
  if (s === '::1') return true;
  if (s.startsWith('fc') || s.startsWith('fd')) return true;
  if (s.startsWith('fe80')) return true;
  return false;
}

export function expectColumnValuesToBePrivateIpV6(
  dataset: Dataset,
  column: string,
  options?: MostlyOptions
): ExpectationResult {
  return columnValidation(dataset, column, (v) => v != null && isPrivateIpv6(String(v)), options);
}

// ── IP Address in Network (CIDR) ────────────────────────────────────

function ipv4ToInt(octets: number[]): number {
  return ((octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3]) >>> 0;
}

function parseCidr(cidr: string): { network: number; mask: number } | null {
  const [ipPart, prefixStr] = cidr.split('/');
  if (!ipPart || !prefixStr) return null;
  const octets = parseIpv4Octets(ipPart);
  if (!octets) return null;
  const prefix = parseInt(prefixStr, 10);
  if (Number.isNaN(prefix) || prefix < 0 || prefix > 32) return null;
  const mask = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0;
  return { network: ipv4ToInt(octets) & mask, mask };
}

export function expectColumnValuesIpAddressInNetwork(
  dataset: Dataset,
  column: string,
  network: string,
  options?: MostlyOptions
): ExpectationResult {
  const cidr = parseCidr(network);
  return columnValidation(
    dataset,
    column,
    (v) => {
      if (v == null || !cidr) return false;
      const octets = parseIpv4Octets(String(v));
      if (!octets) return false;
      return (ipv4ToInt(octets) & cidr.mask) === cidr.network;
    },
    options
  );
}
