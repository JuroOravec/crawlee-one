import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

import { generate } from '../cli/commands.js';

describe('CLI generate command', () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fsp.mkdtemp(path.join(os.tmpdir(), 'actor-spec-test-'));
  });

  afterEach(async () => {
    await fsp.rm(tmpDir, { recursive: true, force: true });
  });

  it('generates actorspec.json from a config file', async () => {
    const configContent = `
      export default {
        actorspecVersion: 1,
        actor: {
          title: 'Test Actor',
          publicUrl: null,
          shortDesc: 'A test actor',
          datasetOverviewImgUrl: null,
        },
        platform: {
          name: 'apify',
          url: 'https://apify.com',
          authorId: 'test',
          authorProfileUrl: null,
          actorId: 'test-actor',
        },
        authors: [],
        websites: [],
        pricing: {
          pricingType: 'none',
          value: 0,
          currency: 'usd',
          period: 0,
          periodUnit: '',
        },
      };
    `;
    const configPath = path.join(tmpDir, 'config.mjs');
    await fsp.writeFile(configPath, configContent, 'utf-8');

    const outDir = path.join(tmpDir, 'output');

    await generate({ config: configPath, outDir, silent: true });

    const outputPath = path.join(outDir, 'actorspec.json');
    expect(fs.existsSync(outputPath)).toBe(true);

    const outputContent = JSON.parse(await fsp.readFile(outputPath, 'utf-8'));
    expect(outputContent.actorspecVersion).toBe(1);
    expect(outputContent.actor.title).toBe('Test Actor');
    expect(outputContent.platform.name).toBe('apify');
  });

  it('generates actorspec.json from async config function', async () => {
    const configContent = `
      export default async () => ({
        actorspecVersion: 1,
        actor: {
          title: 'Async Actor',
          publicUrl: null,
          shortDesc: 'An async actor',
          datasetOverviewImgUrl: null,
        },
        platform: {
          name: 'apify',
          url: 'https://apify.com',
          authorId: 'test',
          authorProfileUrl: null,
          actorId: 'async-actor',
        },
        authors: [],
        websites: [],
        pricing: {
          pricingType: 'none',
          value: 0,
          currency: 'usd',
          period: 0,
          periodUnit: '',
        },
      });
    `;
    const configPath = path.join(tmpDir, 'async-config.mjs');
    await fsp.writeFile(configPath, configContent, 'utf-8');

    const outDir = path.join(tmpDir, 'output');

    await generate({ config: configPath, outDir, silent: true });

    const outputPath = path.join(outDir, 'actorspec.json');
    const outputContent = JSON.parse(await fsp.readFile(outputPath, 'utf-8'));
    expect(outputContent.actor.title).toBe('Async Actor');
  });

  it('defaults to .actor dir if it exists', async () => {
    const actorDir = path.join(tmpDir, '.actor');
    await fsp.mkdir(actorDir);

    const configContent = `
      export default {
        actorspecVersion: 1,
        actor: { title: 'Default Dir', publicUrl: null, shortDesc: '', datasetOverviewImgUrl: null },
        platform: { name: 'apify', url: '', authorId: '', authorProfileUrl: null, actorId: '' },
        authors: [],
        websites: [],
        pricing: { pricingType: 'none', value: 0, currency: 'usd', period: 0, periodUnit: '' },
      };
    `;
    const configPath = path.join(tmpDir, 'config.mjs');
    await fsp.writeFile(configPath, configContent, 'utf-8');

    const originalCwd = process.cwd();
    process.chdir(tmpDir);
    try {
      await generate({ config: configPath, silent: true });

      const outputPath = path.join(actorDir, 'actorspec.json');
      expect(fs.existsSync(outputPath)).toBe(true);
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('throws on invalid config (no default export)', async () => {
    const configContent = `export const foo = 'bar';`;
    const configPath = path.join(tmpDir, 'bad-config.mjs');
    await fsp.writeFile(configPath, configContent, 'utf-8');

    const outDir = path.join(tmpDir, 'output');
    await expect(generate({ config: configPath, outDir, silent: true })).rejects.toThrow(
      'Failed to import actorspec'
    );
  });

  it('throws when actorspecVersion is missing', async () => {
    const configContent = `
      export default {
        actor: { title: 'No Version', publicUrl: null, shortDesc: '', datasetOverviewImgUrl: null },
      };
    `;
    const configPath = path.join(tmpDir, 'no-version-config.mjs');
    await fsp.writeFile(configPath, configContent, 'utf-8');

    const outDir = path.join(tmpDir, 'output');
    await expect(generate({ config: configPath, outDir, silent: true })).rejects.toThrow(
      'config.actorspecVersion is missing'
    );
  });

  it('creates output directory recursively', async () => {
    const configContent = `
      export default {
        actorspecVersion: 1,
        actor: { title: 'Nested', publicUrl: null, shortDesc: '', datasetOverviewImgUrl: null },
        platform: { name: 'apify', url: '', authorId: '', authorProfileUrl: null, actorId: '' },
        authors: [],
        websites: [],
        pricing: { pricingType: 'none', value: 0, currency: 'usd', period: 0, periodUnit: '' },
      };
    `;
    const configPath = path.join(tmpDir, 'config.mjs');
    await fsp.writeFile(configPath, configContent, 'utf-8');

    const outDir = path.join(tmpDir, 'deep', 'nested', 'output');
    await generate({ config: configPath, outDir, silent: true });

    const outputPath = path.join(outDir, 'actorspec.json');
    expect(fs.existsSync(outputPath)).toBe(true);
  });

  it('produces pretty-printed JSON output', async () => {
    const configContent = `
      export default {
        actorspecVersion: 1,
        actor: { title: 'Pretty', publicUrl: null, shortDesc: '', datasetOverviewImgUrl: null },
        platform: { name: 'apify', url: '', authorId: '', authorProfileUrl: null, actorId: '' },
        authors: [],
        websites: [],
        pricing: { pricingType: 'none', value: 0, currency: 'usd', period: 0, periodUnit: '' },
      };
    `;
    const configPath = path.join(tmpDir, 'config.mjs');
    await fsp.writeFile(configPath, configContent, 'utf-8');

    const outDir = path.join(tmpDir, 'output');
    await generate({ config: configPath, outDir, silent: true });

    const rawContent = await fsp.readFile(path.join(outDir, 'actorspec.json'), 'utf-8');
    expect(rawContent).toContain('  "actorspecVersion"');
  });
});
