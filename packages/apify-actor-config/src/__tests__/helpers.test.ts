import { describe, it, expect } from 'vitest';
import {
  createActorConfig,
  createActorInputSchema,
  createActorOutputSchema,
  createStringField,
  createBooleanField,
  createIntegerField,
  createNumberField,
  createObjectField,
  createArrayField,
  FIELD_TYPE,
  STRING_EDITOR_TYPE,
  BOOLEAN_EDITOR_TYPE,
  INTEGER_EDITOR_TYPE,
  NUMBER_EDITOR_TYPE,
  OBJECT_EDITOR_TYPE,
  ARRAY_EDITOR_TYPE,
  VIEW_DISPLAY_PROPERTY_TYPE,
  DATE_TYPE,
} from '../index.js';

describe('Type constants', () => {
  it('FIELD_TYPE contains all expected values including number', () => {
    expect(FIELD_TYPE).toEqual(['string', 'array', 'object', 'boolean', 'integer', 'number']);
  });

  it('STRING_EDITOR_TYPE contains all expected values including python and fileupload', () => {
    expect(STRING_EDITOR_TYPE).toEqual([
      'textfield',
      'textarea',
      'javascript',
      'python',
      'select',
      'datepicker',
      'fileupload',
      'hidden',
    ]);
  });

  it('BOOLEAN_EDITOR_TYPE contains all expected values', () => {
    expect(BOOLEAN_EDITOR_TYPE).toEqual(['checkbox', 'hidden']);
  });

  it('INTEGER_EDITOR_TYPE contains all expected values', () => {
    expect(INTEGER_EDITOR_TYPE).toEqual(['number', 'hidden']);
  });

  it('NUMBER_EDITOR_TYPE contains all expected values', () => {
    expect(NUMBER_EDITOR_TYPE).toEqual(['number', 'hidden']);
  });

  it('OBJECT_EDITOR_TYPE contains schemaBased', () => {
    expect(OBJECT_EDITOR_TYPE).toEqual(['json', 'proxy', 'schemaBased', 'hidden']);
  });

  it('ARRAY_EDITOR_TYPE contains fileupload, select, and schemaBased', () => {
    expect(ARRAY_EDITOR_TYPE).toEqual([
      'json',
      'requestListSources',
      'pseudoUrls',
      'globs',
      'keyValue',
      'stringList',
      'fileupload',
      'select',
      'schemaBased',
      'hidden',
    ]);
  });

  it('VIEW_DISPLAY_PROPERTY_TYPE contains all expected values', () => {
    expect(VIEW_DISPLAY_PROPERTY_TYPE).toEqual([
      'text',
      'number',
      'date',
      'link',
      'boolean',
      'image',
      'array',
      'object',
    ]);
  });

  it('DATE_TYPE contains all expected values', () => {
    expect(DATE_TYPE).toEqual(['absolute', 'relative', 'absoluteOrRelative']);
  });
});

describe('createActorConfig', () => {
  it('returns the config object unchanged', () => {
    const config = {
      actorSpecification: 1 as const,
      name: 'test-actor',
      version: '0.1',
    };
    expect(createActorConfig(config)).toBe(config);
  });

  it('preserves all fields including nested objects', () => {
    const config = {
      actorSpecification: 1 as const,
      name: 'full-actor',
      version: '1.0',
      dockerfile: './Dockerfile',
      environmentVariables: { FOO: 'bar' },
      storages: {
        dataset: {
          actorSpecification: 1 as const,
          fields: {},
          views: {},
        },
      },
    };
    const result = createActorConfig(config);
    expect(result).toBe(config);
    expect(result.environmentVariables).toEqual({ FOO: 'bar' });
    expect(result.storages?.dataset).toBeDefined();
  });

  it('supports new fields: title, defaultMemoryMbytes, changelog, usesStandbyMode, webServerSchema, webServerMcpPath', () => {
    const config = {
      actorSpecification: 1 as const,
      name: 'modern-actor',
      version: '1.0',
      title: 'My Modern Actor',
      defaultMemoryMbytes: 2048,
      changelog: './CHANGELOG.md',
      usesStandbyMode: true,
      webServerSchema: './openapi.json',
      webServerMcpPath: '/mcp',
    };
    const result = createActorConfig(config);
    expect(result).toBe(config);
    expect(result.title).toBe('My Modern Actor');
    expect(result.defaultMemoryMbytes).toBe(2048);
    expect(result.changelog).toBe('./CHANGELOG.md');
    expect(result.usesStandbyMode).toBe(true);
    expect(result.webServerSchema).toBe('./openapi.json');
    expect(result.webServerMcpPath).toBe('/mcp');
  });

  it('accepts dynamic memory expression string for defaultMemoryMbytes', () => {
    const config = {
      actorSpecification: 1 as const,
      name: 'dynamic-mem-actor',
      version: '0.1',
      defaultMemoryMbytes: "get(input, 'startUrls.length', 1) * 1024",
    };
    const result = createActorConfig(config);
    expect(result.defaultMemoryMbytes).toBe("get(input, 'startUrls.length', 1) * 1024");
  });
});

describe('createActorInputSchema', () => {
  it('returns the schema object unchanged', () => {
    const schema = {
      schemaVersion: 1 as const,
      title: 'Test Input',
      type: 'object' as const,
      properties: {},
    };
    expect(createActorInputSchema(schema)).toBe(schema);
  });

  it('preserves properties with field definitions', () => {
    const schema = {
      schemaVersion: 1 as const,
      title: 'Test',
      type: 'object' as const,
      properties: {
        name: createStringField({
          title: 'Name',
          type: 'string',
          description: 'Enter name',
          editor: 'textfield',
        }),
      },
    };
    const result = createActorInputSchema(schema);
    expect(result.properties.name.title).toBe('Name');
  });

  it('supports additionalProperties field', () => {
    const schema = {
      schemaVersion: 1 as const,
      title: 'Strict Input',
      type: 'object' as const,
      properties: {},
      additionalProperties: false,
    };
    const result = createActorInputSchema(schema);
    expect(result.additionalProperties).toBe(false);
  });
});

describe('createActorOutputSchema', () => {
  it('returns the schema object unchanged', () => {
    const schema = {
      actorSpecification: 1 as const,
      fields: {},
      views: {
        overview: {
          title: 'Overview',
          transformation: { fields: ['name'] },
          display: { component: 'table' as const },
        },
      },
    };
    expect(createActorOutputSchema(schema)).toBe(schema);
  });
});

describe('Field creator functions', () => {
  it('createStringField returns a textfield string field unchanged', () => {
    const field = {
      title: 'URL',
      type: 'string' as const,
      description: 'Enter a URL',
      editor: 'textfield' as const,
      pattern: 'https?://.+',
    };
    expect(createStringField(field)).toBe(field);
  });

  it('createStringField returns a select string field unchanged', () => {
    const field = {
      title: 'Country',
      type: 'string' as const,
      description: 'Select country',
      editor: 'select' as const,
      enum: ['us', 'de', 'fr'] as const,
      enumTitles: ['USA', 'Germany', 'France'] as const,
      default: 'us',
    };
    expect(createStringField(field)).toBe(field);
  });

  it('createStringField supports python editor', () => {
    const field = {
      title: 'Script',
      type: 'string' as const,
      description: 'Python code',
      editor: 'python' as const,
      prefill: 'print("hello")',
    };
    expect(createStringField(field)).toBe(field);
  });

  it('createStringField supports fileupload editor', () => {
    const field = {
      title: 'Config file',
      type: 'string' as const,
      description: 'Upload a config file',
      editor: 'fileupload' as const,
    };
    expect(createStringField(field)).toBe(field);
  });

  it('createStringField supports datepicker with dateType', () => {
    const field = {
      title: 'Since date',
      type: 'string' as const,
      description: 'Select date',
      editor: 'datepicker' as const,
      dateType: 'absoluteOrRelative' as const,
    };
    expect(createStringField(field)).toBe(field);
    expect(field.dateType).toBe('absoluteOrRelative');
  });

  it('createStringField supports enumSuggestedValues for select editor', () => {
    const field = {
      title: 'Tag',
      type: 'string' as const,
      description: 'Select or enter tag',
      editor: 'select' as const,
      enumSuggestedValues: ['web', 'scraping', 'automation'],
      enumTitles: ['Web', 'Scraping', 'Automation'],
    };
    expect(createStringField(field)).toBe(field);
  });

  it('createStringField supports isSecret on hidden editor', () => {
    const field = {
      title: 'API Key',
      type: 'string' as const,
      description: 'Your API key',
      editor: 'hidden' as const,
      isSecret: true,
    };
    expect(createStringField(field)).toBe(field);
  });

  it('createBooleanField returns a boolean field unchanged', () => {
    const field = {
      title: 'Verbose',
      type: 'boolean' as const,
      description: 'Enable verbose mode',
      default: true,
    };
    expect(createBooleanField(field)).toBe(field);
  });

  it('createBooleanField now supports prefill', () => {
    const field = {
      title: 'Lightspeed',
      type: 'boolean' as const,
      description: 'Run at lightspeed',
      prefill: true,
    };
    expect(createBooleanField(field)).toBe(field);
    expect(field.prefill).toBe(true);
  });

  it('createIntegerField returns an integer field unchanged', () => {
    const field = {
      title: 'Memory',
      type: 'integer' as const,
      description: 'Memory in MB',
      minimum: 128,
      maximum: 4096,
      unit: 'MB',
      default: 256,
    };
    expect(createIntegerField(field)).toBe(field);
  });

  it('createNumberField returns a number field unchanged', () => {
    const field = {
      title: 'Temperature',
      type: 'number' as const,
      description: 'Temperature in Celsius',
      minimum: 0,
      maximum: 100,
      unit: '°C',
      default: 36.6,
    };
    expect(createNumberField(field)).toBe(field);
    expect(field.type).toBe('number');
  });

  it('createObjectField returns an object field unchanged', () => {
    const field = {
      title: 'Proxy',
      type: 'object' as const,
      description: 'Proxy configuration',
      editor: 'proxy' as const,
    };
    expect(createObjectField(field)).toBe(field);
  });

  it('createObjectField supports schemaBased editor with sub-properties', () => {
    const field = {
      title: 'Config',
      type: 'object' as const,
      description: 'Advanced config',
      editor: 'schemaBased' as const,
      properties: {
        locale: createStringField({
          title: 'Locale',
          type: 'string',
          description: 'Locale identifier',
          editor: 'textfield',
        }),
      },
      required: ['locale'],
      additionalProperties: false,
    };
    expect(createObjectField(field)).toBe(field);
    expect(field.properties.locale.title).toBe('Locale');
    expect(field.required).toEqual(['locale']);
    expect(field.additionalProperties).toBe(false);
  });

  it('createObjectField supports isSecret', () => {
    const field = {
      title: 'Credentials',
      type: 'object' as const,
      description: 'Secret credentials',
      editor: 'json' as const,
      isSecret: true,
    };
    expect(createObjectField(field)).toBe(field);
    expect(field.isSecret).toBe(true);
  });

  it('createArrayField returns an array field unchanged', () => {
    const field = {
      title: 'Start URLs',
      type: 'array' as const,
      description: 'URLs to start with',
      editor: 'requestListSources' as const,
      prefill: [{ url: 'https://example.com' }],
    };
    expect(createArrayField(field)).toBe(field);
  });

  it('createArrayField works with stringList editor', () => {
    const field = {
      title: 'Tags',
      type: 'array' as const,
      description: 'Enter tags',
      editor: 'stringList' as const,
      example: ['tag1', 'tag2'],
    };
    expect(createArrayField(field)).toBe(field);
  });

  it('createArrayField supports select editor for multiselect', () => {
    const field = {
      title: 'Categories',
      type: 'array' as const,
      description: 'Select categories',
      editor: 'select' as const,
      items: {
        type: 'string',
        enum: ['news', 'blog', 'docs'],
        enumTitles: ['News', 'Blog', 'Documentation'],
      },
    };
    expect(createArrayField(field)).toBe(field);
  });

  it('createArrayField supports fileupload editor', () => {
    const field = {
      title: 'Files',
      type: 'array' as const,
      description: 'Upload files',
      editor: 'fileupload' as const,
    };
    expect(createArrayField(field)).toBe(field);
  });

  it('createArrayField supports schemaBased editor', () => {
    const field = {
      title: 'Entries',
      type: 'array' as const,
      description: 'List of entries',
      editor: 'schemaBased' as const,
      items: { type: 'object' },
    };
    expect(createArrayField(field)).toBe(field);
  });

  it('createArrayField supports isSecret', () => {
    const field = {
      title: 'Tokens',
      type: 'array' as const,
      description: 'Secret tokens',
      editor: 'json' as const,
      isSecret: true,
    };
    expect(createArrayField(field)).toBe(field);
    expect(field.isSecret).toBe(true);
  });

  it('string field errorMessage accepts string-specific keywords', () => {
    const field = createStringField({
      title: 'Email',
      type: 'string',
      description: 'Enter email',
      editor: 'textfield',
      pattern: '^[^@]+@[^@]+$',
      errorMessage: {
        type: 'Must be a string',
        pattern: 'Please enter a valid email address',
        minLength: 'Too short',
        maxLength: 'Too long',
        enum: 'Pick a valid option',
      },
    });
    expect(field.errorMessage).toEqual({
      type: 'Must be a string',
      pattern: 'Please enter a valid email address',
      minLength: 'Too short',
      maxLength: 'Too long',
      enum: 'Pick a valid option',
    });
  });

  it('boolean field errorMessage accepts only type keyword', () => {
    const field = createBooleanField({
      title: 'Enabled',
      type: 'boolean',
      description: 'Toggle',
      errorMessage: { type: 'Must be true or false' },
    });
    expect(field.errorMessage).toEqual({ type: 'Must be true or false' });
  });

  it('integer field errorMessage accepts numeric keywords', () => {
    const field = createIntegerField({
      title: 'Count',
      type: 'integer',
      description: 'Item count',
      errorMessage: {
        type: 'Must be an integer',
        minimum: 'Too small',
        maximum: 'Too large',
      },
    });
    expect(field.errorMessage).toEqual({
      type: 'Must be an integer',
      minimum: 'Too small',
      maximum: 'Too large',
    });
  });

  it('number field errorMessage accepts numeric keywords', () => {
    const field = createNumberField({
      title: 'Temperature',
      type: 'number',
      description: 'Temp in C',
      errorMessage: {
        type: 'Must be a number',
        minimum: 'Too cold',
        maximum: 'Too hot',
      },
    });
    expect(field.errorMessage).toEqual({
      type: 'Must be a number',
      minimum: 'Too cold',
      maximum: 'Too hot',
    });
  });

  it('object field errorMessage accepts object-specific keywords', () => {
    const field = createObjectField({
      title: 'Config',
      type: 'object',
      description: 'Configuration',
      editor: 'json',
      errorMessage: {
        type: 'Must be an object',
        minProperties: 'Needs more properties',
        maxProperties: 'Too many properties',
        patternKey: 'Invalid key format',
        patternValue: 'Invalid value format',
      },
    });
    expect(field.errorMessage).toEqual({
      type: 'Must be an object',
      minProperties: 'Needs more properties',
      maxProperties: 'Too many properties',
      patternKey: 'Invalid key format',
      patternValue: 'Invalid value format',
    });
  });

  it('array field errorMessage accepts array-specific keywords', () => {
    const field = createArrayField({
      title: 'Tags',
      type: 'array',
      description: 'Tag list',
      editor: 'stringList',
      errorMessage: {
        type: 'Must be an array',
        minItems: 'Need more items',
        maxItems: 'Too many items',
        uniqueItems: 'Items must be unique',
        patternKey: 'Invalid key pattern',
        patternValue: 'Invalid value pattern',
      },
    });
    expect(field.errorMessage).toEqual({
      type: 'Must be an array',
      minItems: 'Need more items',
      maxItems: 'Too many items',
      uniqueItems: 'Items must be unique',
      patternKey: 'Invalid key pattern',
      patternValue: 'Invalid value pattern',
    });
  });
});
