import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

import { canonicalJson, computeExtractionId, stableHash } from './utils.js';

describe('llmExtract utils', () => {
  describe('stableHash', () => {
    it('returns deterministic 12-char base64url string', () => {
      const h1 = stableHash('hello');
      const h2 = stableHash('hello');
      expect(h1).toBe(h2);
      expect(h1).toMatch(/^[A-Za-z0-9_-]{1,12}$/);
      expect(stableHash('world')).not.toBe(h1);
    });
  });

  describe('canonicalJson', () => {
    it('produces same string for objects with different key order', () => {
      expect(canonicalJson({ b: 2, a: 1 })).toBe(canonicalJson({ a: 1, b: 2 }));
      expect(canonicalJson({ a: { z: 1, y: 2 } })).toBe(canonicalJson({ a: { y: 2, z: 1 } }));
    });
  });

  describe('computeExtractionId', () => {
    const schema = z.object({ title: z.string() });
    const jsonSchema = zodToJsonSchema(schema) as Record<string, unknown>;

    it('uses requestId when text is not given', () => {
      const id = computeExtractionId({
        requestId: 'req-123',
        systemPrompt: 'Extract.',
        jsonSchema,
      });
      expect(id).toMatch(/^ext-req-123-/);
    });

    it('uses text hash when text is given', () => {
      const id = computeExtractionId({
        requestId: 'req-1',
        systemPrompt: 'Extract.',
        jsonSchema,
        text: '<div>content</div>',
      });
      expect(id).toMatch(/^ext-[A-Za-z0-9_-]+-[A-Za-z0-9_-]+-[A-Za-z0-9_-]+$/);
      expect(id).not.toContain('req-1');
    });

    it('same opts produce same id', () => {
      const opts = {
        requestId: 'req-x',
        systemPrompt: 'Extract job.',
        jsonSchema,
        text: '<html></html>' as const,
      };
      expect(computeExtractionId(opts)).toBe(computeExtractionId(opts));
    });

    it('different prompt produces different id', () => {
      const base = { requestId: 'req-1', jsonSchema } as const;
      expect(computeExtractionId({ ...base, systemPrompt: 'A' })).not.toBe(
        computeExtractionId({ ...base, systemPrompt: 'B' })
      );
    });
  });
});
