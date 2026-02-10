import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

import { generate } from '../cli/commands.js';

describe('CLI generate command', () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fsp.mkdtemp(path.join(os.tmpdir(), 'apify-actor-config-test-'));
  });

  afterEach(async () => {
    await fsp.rm(tmpDir, { recursive: true, force: true });
  });

  it('generates actor.json from a config file', async () => {
    // Create a temporary config file
    const configContent = `
      export default {
        actorSpecification: 1,
        name: 'test-actor',
        version: '0.1',
        input: {
          schemaVersion: 1,
          title: 'Test Input',
          type: 'object',
          properties: {},
        },
      };
    `;
    const configPath = path.join(tmpDir, 'config.mjs');
    await fsp.writeFile(configPath, configContent, 'utf-8');

    const outDir = path.join(tmpDir, 'output');

    await generate({ config: configPath, outDir, silent: true });

    const outputPath = path.join(outDir, 'actor.json');
    expect(fs.existsSync(outputPath)).toBe(true);

    const outputContent = JSON.parse(await fsp.readFile(outputPath, 'utf-8'));
    expect(outputContent.actorSpecification).toBe(1);
    expect(outputContent.name).toBe('test-actor');
    expect(outputContent.version).toBe('0.1');
    expect(outputContent.input.title).toBe('Test Input');
  });

  it('generates actor.json from async config function', async () => {
    const configContent = `
      export default async () => ({
        actorSpecification: 1,
        name: 'async-actor',
        version: '0.2',
      });
    `;
    const configPath = path.join(tmpDir, 'async-config.mjs');
    await fsp.writeFile(configPath, configContent, 'utf-8');

    const outDir = path.join(tmpDir, 'output');

    await generate({ config: configPath, outDir, silent: true });

    const outputPath = path.join(outDir, 'actor.json');
    const outputContent = JSON.parse(await fsp.readFile(outputPath, 'utf-8'));
    expect(outputContent.name).toBe('async-actor');
    expect(outputContent.version).toBe('0.2');
  });

  it('defaults to .actor dir if it exists', async () => {
    const actorDir = path.join(tmpDir, '.actor');
    await fsp.mkdir(actorDir);

    const configContent = `
      export default {
        actorSpecification: 1,
        name: 'default-dir-actor',
        version: '0.1',
      };
    `;
    const configPath = path.join(tmpDir, 'config.mjs');
    await fsp.writeFile(configPath, configContent, 'utf-8');

    // Save and change CWD so that .actor resolution works
    const originalCwd = process.cwd();
    process.chdir(tmpDir);
    try {
      await generate({ config: configPath, silent: true });

      const outputPath = path.join(actorDir, 'actor.json');
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
      'Failed to import Actor config'
    );
  });

  it('throws when actorSpecification is missing', async () => {
    const configContent = `
      export default {
        name: 'bad-actor',
        version: '0.1',
      };
    `;
    const configPath = path.join(tmpDir, 'no-spec-config.mjs');
    await fsp.writeFile(configPath, configContent, 'utf-8');

    const outDir = path.join(tmpDir, 'output');
    await expect(generate({ config: configPath, outDir, silent: true })).rejects.toThrow(
      'config.actorSpecification is missing'
    );
  });

  it('creates output directory recursively', async () => {
    const configContent = `
      export default {
        actorSpecification: 1,
        name: 'nested-output',
        version: '0.1',
      };
    `;
    const configPath = path.join(tmpDir, 'config.mjs');
    await fsp.writeFile(configPath, configContent, 'utf-8');

    const outDir = path.join(tmpDir, 'deep', 'nested', 'output');
    await generate({ config: configPath, outDir, silent: true });

    const outputPath = path.join(outDir, 'actor.json');
    expect(fs.existsSync(outputPath)).toBe(true);
  });

  it('produces pretty-printed JSON output', async () => {
    const configContent = `
      export default {
        actorSpecification: 1,
        name: 'pretty-actor',
        version: '0.1',
      };
    `;
    const configPath = path.join(tmpDir, 'config.mjs');
    await fsp.writeFile(configPath, configContent, 'utf-8');

    const outDir = path.join(tmpDir, 'output');
    await generate({ config: configPath, outDir, silent: true });

    const rawContent = await fsp.readFile(path.join(outDir, 'actor.json'), 'utf-8');
    // Should contain indentation (pretty-printed with 2 spaces)
    expect(rawContent).toContain('  "actorSpecification"');
  });
});
