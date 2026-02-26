import { describe, expect, it } from 'vitest';

import {
  expectColumnValuesIpAddressInNetwork,
  expectColumnValuesToBePrivateIpV4,
  expectColumnValuesToBePrivateIpv4Class,
  expectColumnValuesToBePrivateIpV6,
} from './semanticNetwork.js';

describe('expectColumnValuesToBePrivateIpV4', () => {
  it('passes for class A private IPs', () => {
    const d = [{ v: '10.0.0.1' }, { v: '10.255.255.255' }];
    expect(expectColumnValuesToBePrivateIpV4(d, 'v').success).toBe(true);
  });

  it('passes for class B private IPs', () => {
    const d = [{ v: '172.16.0.1' }, { v: '172.31.255.255' }];
    expect(expectColumnValuesToBePrivateIpV4(d, 'v').success).toBe(true);
  });

  it('passes for class C private IPs', () => {
    const d = [{ v: '192.168.0.1' }, { v: '192.168.255.255' }];
    expect(expectColumnValuesToBePrivateIpV4(d, 'v').success).toBe(true);
  });

  it('fails for public IPs', () => {
    const d = [{ v: '8.8.8.8' }, { v: '1.1.1.1' }, { v: '172.32.0.1' }];
    expect(expectColumnValuesToBePrivateIpV4(d, 'v').success).toBe(false);
  });

  it('fails for invalid IPs', () => {
    const d = [{ v: 'not-an-ip' }, { v: '256.0.0.1' }];
    expect(expectColumnValuesToBePrivateIpV4(d, 'v').success).toBe(false);
  });
});

describe('expectColumnValuesToBePrivateIpv4Class', () => {
  it('passes for matching class A', () => {
    const d = [{ v: '10.0.0.1' }, { v: '10.100.200.3' }];
    expect(expectColumnValuesToBePrivateIpv4Class(d, 'v', 'A').success).toBe(true);
  });

  it('fails when class does not match', () => {
    const d = [{ v: '192.168.1.1' }];
    expect(expectColumnValuesToBePrivateIpv4Class(d, 'v', 'A').success).toBe(false);
  });

  it('passes for matching class B', () => {
    const d = [{ v: '172.16.0.1' }];
    expect(expectColumnValuesToBePrivateIpv4Class(d, 'v', 'B').success).toBe(true);
  });

  it('passes for matching class C', () => {
    const d = [{ v: '192.168.1.1' }];
    expect(expectColumnValuesToBePrivateIpv4Class(d, 'v', 'C').success).toBe(true);
  });
});

describe('expectColumnValuesToBePrivateIpV6', () => {
  it('passes for loopback', () => {
    const d = [{ v: '::1' }];
    expect(expectColumnValuesToBePrivateIpV6(d, 'v').success).toBe(true);
  });

  it('passes for ULA (fc/fd prefix)', () => {
    const d = [{ v: 'fc00::1' }, { v: 'fd12:3456:789a::1' }];
    expect(expectColumnValuesToBePrivateIpV6(d, 'v').success).toBe(true);
  });

  it('passes for link-local (fe80)', () => {
    const d = [{ v: 'fe80::1' }];
    expect(expectColumnValuesToBePrivateIpV6(d, 'v').success).toBe(true);
  });

  it('fails for public IPv6', () => {
    const d = [{ v: '2001:db8::1' }, { v: '2607:f8b0:4004:800::200e' }];
    expect(expectColumnValuesToBePrivateIpV6(d, 'v').success).toBe(false);
  });
});

describe('expectColumnValuesIpAddressInNetwork', () => {
  it('passes for IPs in a /24 network', () => {
    const d = [{ v: '192.168.1.1' }, { v: '192.168.1.254' }];
    expect(expectColumnValuesIpAddressInNetwork(d, 'v', '192.168.1.0/24').success).toBe(true);
  });

  it('fails for IPs outside the network', () => {
    const d = [{ v: '192.168.2.1' }, { v: '10.0.0.1' }];
    expect(expectColumnValuesIpAddressInNetwork(d, 'v', '192.168.1.0/24').success).toBe(false);
  });

  it('handles /8 networks', () => {
    const d = [{ v: '10.0.0.1' }, { v: '10.255.255.255' }];
    expect(expectColumnValuesIpAddressInNetwork(d, 'v', '10.0.0.0/8').success).toBe(true);
  });

  it('handles /32 single host', () => {
    const d = [{ v: '1.2.3.4' }];
    expect(expectColumnValuesIpAddressInNetwork(d, 'v', '1.2.3.4/32').success).toBe(true);
  });

  it('fails for non-IPs', () => {
    const d = [{ v: 'not-an-ip' }];
    expect(expectColumnValuesIpAddressInNetwork(d, 'v', '10.0.0.0/8').success).toBe(false);
  });
});
