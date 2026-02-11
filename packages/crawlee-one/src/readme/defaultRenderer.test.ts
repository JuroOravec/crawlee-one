import { describe, expect, it } from 'vitest';
import { defaultReadmeRenderer } from './defaultRenderer.js';

describe('defaultReadmeRenderer', () => {
  it('renders title from actorSpec.actor.title', () => {
    const result = defaultReadmeRenderer({
      actorSpec: { actor: { title: 'My Scraper', shortDesc: 'Scrapes things.' } },
    });

    expect(result).toContain('# My Scraper');
    expect(result).toContain('Scrapes things.');
  });

  it('falls back to actorSpec.name when actor.title is missing', () => {
    const result = defaultReadmeRenderer({
      actorSpec: { name: 'fallback-name' },
    });

    expect(result).toContain('# fallback-name');
  });

  it('uses "Untitled" when no title or name is available', () => {
    const result = defaultReadmeRenderer({ actorSpec: {} });
    expect(result).toContain('# Untitled');
  });

  it('renders all input sections when provided', () => {
    const result = defaultReadmeRenderer({
      actorSpec: { actor: { title: 'Test' } },
      input: {
        intro: 'This is the intro.',
        useCases: '- Monitoring\n- Analysis',
        inputDescription: 'Pass a URL to scrape.',
        outputDescription: 'Returns JSON objects.',
        performance: 'Costs about $0.01 per run.',
        extra: '## FAQ\n\nNo questions yet.',
      },
    });

    expect(result).toContain('This is the intro.');
    expect(result).toContain('## Use cases\n\n- Monitoring\n- Analysis');
    expect(result).toContain('## Input\n\nPass a URL to scrape.');
    expect(result).toContain('## Output\n\nReturns JSON objects.');
    expect(result).toContain('## Performance\n\nCosts about $0.01 per run.');
    expect(result).toContain('## FAQ\n\nNo questions yet.');
  });

  it('omits sections when input fields are not provided', () => {
    const result = defaultReadmeRenderer({
      actorSpec: { actor: { title: 'Minimal' } },
      input: { intro: 'Just an intro.' },
    });

    expect(result).toContain('# Minimal');
    expect(result).toContain('Just an intro.');
    expect(result).not.toContain('## Use cases');
    expect(result).not.toContain('## Input');
    expect(result).not.toContain('## Output');
    expect(result).not.toContain('## Performance');
  });

  it('works with no input at all', () => {
    const result = defaultReadmeRenderer({
      actorSpec: { actor: { title: 'Empty' } },
    });

    expect(result).toBe('# Empty\n');
  });

  it('returns a string ending with a newline', () => {
    const result = defaultReadmeRenderer({
      actorSpec: { actor: { title: 'Test' } },
      input: { intro: 'Hello' },
    });

    expect(result.endsWith('\n')).toBe(true);
  });
});
