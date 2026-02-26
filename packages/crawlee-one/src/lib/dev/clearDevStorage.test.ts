import fs from 'node:fs';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { beforeEach, describe, expect, it } from 'vitest';

import { clearDevStorage } from './clearDevStorage.js';

describe('clearDevStorage', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = mkdtempSync(path.join(tmpdir(), 'crawlee-one-clear-'));
  });

  function ensureDir(p: string): void {
    fs.mkdirSync(p, { recursive: true });
  }

  function touch(p: string): void {
    fs.writeFileSync(p, '{}');
  }

  it('removes dev-{crawler}-* datasets and dev-{crawler} request queue only', () => {
    const datasetsDir = path.join(tmpDir, 'datasets');
    const requestQueuesDir = path.join(tmpDir, 'request_queues');

    ensureDir(datasetsDir);
    ensureDir(requestQueuesDir);

    // Create dev-guidechem-* datasets (should be removed)
    ensureDir(path.join(datasetsDir, 'dev-guidechem-casListing'));
    touch(path.join(datasetsDir, 'dev-guidechem-casListing', '000000001.json'));
    ensureDir(path.join(datasetsDir, 'dev-guidechem-sellerDetail'));

    // Create dev-guidechem request queue (should be removed)
    ensureDir(path.join(requestQueuesDir, 'dev-guidechem'));
    touch(path.join(requestQueuesDir, 'dev-guidechem', 'request.json'));

    // Create other datasets that must NOT be removed
    ensureDir(path.join(datasetsDir, 'dev-profesia-jobList'));
    touch(path.join(datasetsDir, 'dev-profesia-jobList', '000000001.json'));
    ensureDir(path.join(datasetsDir, 'prod-dataset'));
    touch(path.join(datasetsDir, 'prod-dataset', '000000001.json'));

    // Create other request queue that must NOT be removed
    ensureDir(path.join(requestQueuesDir, 'dev-profesia'));
    touch(path.join(requestQueuesDir, 'dev-profesia', 'request.json'));

    clearDevStorage(tmpDir, ['guidechem']);

    // guidechem dev storage removed
    expect(fs.existsSync(path.join(datasetsDir, 'dev-guidechem-casListing'))).toBe(false);
    expect(fs.existsSync(path.join(datasetsDir, 'dev-guidechem-sellerDetail'))).toBe(false);
    expect(fs.existsSync(path.join(requestQueuesDir, 'dev-guidechem'))).toBe(false);

    // Other crawlers and prod unchanged
    expect(fs.existsSync(path.join(datasetsDir, 'dev-profesia-jobList'))).toBe(true);
    expect(fs.existsSync(path.join(datasetsDir, 'prod-dataset'))).toBe(true);
    expect(fs.existsSync(path.join(requestQueuesDir, 'dev-profesia'))).toBe(true);
  });

  it('clears multiple crawlers when given multiple names', () => {
    const datasetsDir = path.join(tmpDir, 'datasets');
    const requestQueuesDir = path.join(tmpDir, 'request_queues');

    ensureDir(datasetsDir);
    ensureDir(requestQueuesDir);

    ensureDir(path.join(datasetsDir, 'dev-guidechem-casListing'));
    ensureDir(path.join(datasetsDir, 'dev-profesia-jobList'));
    ensureDir(path.join(requestQueuesDir, 'dev-guidechem'));
    ensureDir(path.join(requestQueuesDir, 'dev-profesia'));

    clearDevStorage(tmpDir, ['guidechem', 'profesia']);

    expect(fs.existsSync(path.join(datasetsDir, 'dev-guidechem-casListing'))).toBe(false);
    expect(fs.existsSync(path.join(datasetsDir, 'dev-profesia-jobList'))).toBe(false);
    expect(fs.existsSync(path.join(requestQueuesDir, 'dev-guidechem'))).toBe(false);
    expect(fs.existsSync(path.join(requestQueuesDir, 'dev-profesia'))).toBe(false);
  });

  it('does not remove datasets not matching dev-{crawler}- prefix', () => {
    const datasetsDir = path.join(tmpDir, 'datasets');
    ensureDir(datasetsDir);

    // dev-guidechem without hyphen-suffix (edge case - would need dev-guidechem- prefix)
    ensureDir(path.join(datasetsDir, 'dev-guidechem'));
    touch(path.join(datasetsDir, 'dev-guidechem', '000000001.json'));

    // dev-guidechem-extra matches prefix
    ensureDir(path.join(datasetsDir, 'dev-guidechem-extra'));

    clearDevStorage(tmpDir, ['guidechem']);

    // dev-guidechem (no route suffix) is NOT removed - we use startsWith('dev-guidechem-')
    expect(fs.existsSync(path.join(datasetsDir, 'dev-guidechem'))).toBe(true);
    // dev-guidechem-extra IS removed
    expect(fs.existsSync(path.join(datasetsDir, 'dev-guidechem-extra'))).toBe(false);
  });

  it('does nothing when datasets or request_queues dirs do not exist', () => {
    // tmpDir is empty - no datasets/ or request_queues/
    expect(() => clearDevStorage(tmpDir, ['guidechem'])).not.toThrow();
  });
});
