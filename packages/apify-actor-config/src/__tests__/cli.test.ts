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

  describe('schema stripping from Field objects', () => {
    it('strips schema property from top-level Fields', async () => {
      const configContent = `
        export default {
          actorSpecification: 1,
          name: 'schema-strip-test',
          version: '0.1',
          input: {
            schemaVersion: 1,
            title: 'Test Input',
            type: 'object',
            properties: {
              myField: {
                title: 'My Field',
                type: 'string',
                description: 'A field',
                editor: 'textfield',
                schema: { _def: 'zod-string-schema' },
              },
              otherField: {
                title: 'Other',
                type: 'integer',
                description: 'Count',
                schema: { _def: 'zod-number-schema' },
              },
            },
          },
        };
      `;
      const configPath = path.join(tmpDir, 'config.mjs');
      await fsp.writeFile(configPath, configContent, 'utf-8');

      const outDir = path.join(tmpDir, 'output');
      await generate({ config: configPath, outDir, silent: true });

      const output = JSON.parse(await fsp.readFile(path.join(outDir, 'actor.json'), 'utf-8'));

      // schema should be stripped from Fields
      expect(output.input.properties.myField).not.toHaveProperty('schema');
      expect(output.input.properties.otherField).not.toHaveProperty('schema');
      // Other properties should be preserved
      expect(output.input.properties.myField.title).toBe('My Field');
      expect(output.input.properties.myField.type).toBe('string');
      expect(output.input.properties.otherField.title).toBe('Other');
    });

    it('strips schema from nested ObjectField properties', async () => {
      const configContent = `
        export default {
          actorSpecification: 1,
          name: 'nested-schema-strip',
          version: '0.1',
          input: {
            schemaVersion: 1,
            title: 'Test Input',
            type: 'object',
            properties: {
              nested: {
                title: 'Nested',
                type: 'object',
                description: 'Nested object',
                editor: 'json',
                schema: { _def: 'zod-object-schema' },
                properties: {
                  innerField: {
                    title: 'Inner',
                    type: 'string',
                    description: 'Inner field',
                    editor: 'textfield',
                    schema: { _def: 'zod-inner-string' },
                  },
                },
              },
            },
          },
        };
      `;
      const configPath = path.join(tmpDir, 'config.mjs');
      await fsp.writeFile(configPath, configContent, 'utf-8');

      const outDir = path.join(tmpDir, 'output');
      await generate({ config: configPath, outDir, silent: true });

      const output = JSON.parse(await fsp.readFile(path.join(outDir, 'actor.json'), 'utf-8'));

      // schema stripped from outer ObjectField
      expect(output.input.properties.nested).not.toHaveProperty('schema');
      expect(output.input.properties.nested.title).toBe('Nested');
      // schema stripped from inner Field too
      expect(output.input.properties.nested.properties.innerField).not.toHaveProperty('schema');
      expect(output.input.properties.nested.properties.innerField.title).toBe('Inner');
    });

    it('preserves schema properties outside of input.properties', async () => {
      const configContent = `
        export default {
          actorSpecification: 1,
          name: 'preserve-meta-schema',
          version: '0.1',
          meta: {
            schema: 'https://json-schema.org/draft/2020-12/schema',
            description: 'Some metadata',
          },
          input: {
            schemaVersion: 1,
            title: 'Test Input',
            type: 'object',
            properties: {
              myField: {
                title: 'Field',
                type: 'string',
                description: 'A field',
                editor: 'textfield',
                schema: { _def: 'zod-schema' },
              },
            },
          },
        };
      `;
      const configPath = path.join(tmpDir, 'config.mjs');
      await fsp.writeFile(configPath, configContent, 'utf-8');

      const outDir = path.join(tmpDir, 'output');
      await generate({ config: configPath, outDir, silent: true });

      const output = JSON.parse(await fsp.readFile(path.join(outDir, 'actor.json'), 'utf-8'));

      // meta.schema should be preserved
      expect(output.meta.schema).toBe('https://json-schema.org/draft/2020-12/schema');
      // Field schema should be stripped
      expect(output.input.properties.myField).not.toHaveProperty('schema');
    });

    it('handles Fields without schema property', async () => {
      const configContent = `
        export default {
          actorSpecification: 1,
          name: 'no-schema-field',
          version: '0.1',
          input: {
            schemaVersion: 1,
            title: 'Test Input',
            type: 'object',
            properties: {
              plain: {
                title: 'Plain Field',
                type: 'string',
                description: 'No schema attached',
                editor: 'textfield',
              },
            },
          },
        };
      `;
      const configPath = path.join(tmpDir, 'config.mjs');
      await fsp.writeFile(configPath, configContent, 'utf-8');

      const outDir = path.join(tmpDir, 'output');
      await generate({ config: configPath, outDir, silent: true });

      const output = JSON.parse(await fsp.readFile(path.join(outDir, 'actor.json'), 'utf-8'));

      expect(output.input.properties.plain).not.toHaveProperty('schema');
      expect(output.input.properties.plain.title).toBe('Plain Field');
      expect(output.input.properties.plain.type).toBe('string');
    });

    it('does not mutate the original config object', async () => {
      // Use an async function config to capture the original reference
      const configContent = `
        const config = {
          actorSpecification: 1,
          name: 'no-mutation',
          version: '0.1',
          input: {
            schemaVersion: 1,
            title: 'Test',
            type: 'object',
            properties: {
              field1: {
                title: 'F1',
                type: 'string',
                description: 'test',
                editor: 'textfield',
                schema: { _def: 'should-remain' },
              },
            },
          },
        };

        // Attach to global so we can check it after
        globalThis.__testOrigConfig = config;
        export default config;
      `;
      const configPath = path.join(tmpDir, 'config.mjs');
      await fsp.writeFile(configPath, configContent, 'utf-8');

      const outDir = path.join(tmpDir, 'output');
      await generate({ config: configPath, outDir, silent: true });

      // Import the config again to check it wasn't mutated
      const { pathToFileURL } = await import('node:url');
      const mod = await import(pathToFileURL(configPath).href);
      const origConfig = mod.default;

      // Original config should still have schema
      expect(origConfig.input.properties.field1.schema).toEqual({ _def: 'should-remain' });
    });
  });
});
