/* eslint-disable @typescript-eslint/no-unused-vars */
import path from 'node:path';

import fsp from 'fs/promises';

import { crawlingContextNameByType } from '../../constants.js';
// NOTE: We intentionally import these to know when their names change
import type { ActorInput } from '../../lib/input.js';
import type {
  CrawleeOneRoute,
  CrawleeOneRouteHandler,
  CrawleeOneRouteMatcher,
  CrawleeOneRouteMatcherFn,
  CrawleeOneRouteMiddleware,
} from '../../lib/router/types.js';
import type { MaybePromise } from '../../utils/types.js';
import { loadConfig, validateConfig } from '../config/config.js';
import type { CrawleeOneConfig, CrawleeOneConfigSchema } from '../config/types.js';
import type { crawleeOne, CrawleeOneOptions } from '../context/context.js';
import type { CrawleeOneContext } from '../context/types.js';

const makeUnion = (items: string[]) => items.map((s) => `"${s}"`).join(` | `);
const makeEnum = (items: string[]) =>
  '{\n' + items.map((s) => `  '${s}' = '${s}'`).join(`,\n`) + '\n}';

type FormatterOpts = { name: string; value: string; typeArgs?: string[] };

const formatters = {
  type: (opts: FormatterOpts) => {
    const { name, value, typeArgs } = opts;
    const typeArgsStr = typeArgs?.length ? `<${typeArgs.join(', ')}>` : '';
    return `export type ${name}${typeArgsStr} = ${value};`;
  },
  typeFunc: (opts: FormatterOpts) => {
    const { name, value, typeArgs } = opts;
    const typeArgsStr = typeArgs?.length ? `<${typeArgs.join(', ')}>` : '';
    return `export type ${name} = ${typeArgsStr}${value};`;
  },
  func: (opts: FormatterOpts) => {
    const { name, value, typeArgs } = opts;
    const typeArgsStr = typeArgs?.length ? `<${typeArgs.join(', ')}>` : '';
    return `export const ${name} = ${typeArgsStr}${value};`;
  },
  // enum `CrawlerName`LabelEnum { "detailPage" = "detailPage", "otherLabel" = "otherLabel", ... };
  enum: (opts: FormatterOpts) => {
    const { name, value } = opts;
    return `export enum ${name} ${value}`;
  },
} satisfies Record<string, (opts: FormatterOpts) => string>;

const parseTypesFromSchema = (schema: CrawleeOneConfigSchema) => {
  /** Remember which types we've already generated */
  const definitions: Record<string, string> = {};

  /** Remember what values need to be imported and from where */
  const imports: Record<string, Set<{ name: string; typeOnly?: boolean }>> = {};

  const addImports = <T extends string>(opts: {
    pkg: string;
    newEntries: T[];
    typeOnly?: boolean;
  }) => {
    const { pkg, newEntries, typeOnly } = opts;
    const entries = (imports[pkg] = imports[pkg] ?? new Set());
    newEntries.forEach((name) => entries.add({ name, typeOnly }));
    // Return the entries as variables, so we can define them in a single
    // place but still reference them in code.
    return newEntries.reduce<{ [Key in T]: Key }>((agg, key) => {
      agg[key] = key;
      return agg;
    }, {} as any);
  };

  const define = (opts: {
    key: string;
    value: string | (() => string);
    typeArgs?: string[];
    kind?: keyof typeof formatters;
  }) => {
    const { key, value, typeArgs = [], kind = 'type' } = opts;
    if (!definitions[key]) {
      const resolvedVal = typeof value === 'function' ? value() : value;
      const formatter = formatters[kind];
      const valFormatted = formatter({ name: key, value: resolvedVal, typeArgs });
      definitions[key] = valFormatted;
    }
    // Return the key as variable, so we can reference it
    return key;
  };

  // 1. Define imports
  const {
    ActorInput: actorInputType,
    CrawleeOneContext: actorCtx,
    CrawleeOneRoute: routeType,
    CrawleeOneRouteHandler: routeHandler,
    CrawleeOneRouteMiddleware: routeWrapper,
    CrawleeOneRouteMatcher: routeMatcher,
    CrawleeOneRouteMatcherFn: routeMatcherFn,
    CrawleeOneIO: ioType,
    CrawleeOneTelemetry: telemType,
    CrawleeOneTypes: ctxType,
    CrawleeOneOptions: argsType,
    crawleeOne: crawleeOneFn,
  } = addImports({
    pkg: 'crawlee-one',
    newEntries: [
      'ActorInput',
      'CrawleeOneContext',
      'CrawleeOneRoute',
      'CrawleeOneRouteHandler',
      'CrawleeOneRouteMiddleware',
      'CrawleeOneRouteMatcher',
      'CrawleeOneRouteMatcherFn',
      'CrawleeOneIO',
      'CrawleeOneTelemetry',
      'CrawleeOneTypes',
      'CrawleeOneOptions',
      'crawleeOne',
    ],
  });
  addImports({
    pkg: 'crawlee',
    newEntries: [...new Set(Object.values(crawlingContextNameByType))],
    typeOnly: true,
  });

  // 2. Define utils
  const maybeP = define({ key: 'MaybePromise', value: 'T | Promise<T>', typeArgs: ['T'] });

  Object.entries(schema.crawlers).forEach(([crawlerName, crawler]) => {
    const crawlerType = crawler.type;

    // 2. Get `CrawlingContext`, e.g. 'cheerio' => `CheerioCrawlingContext`;
    const crawlingContextTypeName = crawlingContextNameByType[crawlerType];

    // 3. Generate type for route labels
    // type `CrawlerName`Label = "detailPage" | "otherLabel" | ...;
    const labelKey = define({
      key: `${crawlerName}Label`,
      value: () => makeUnion(crawler.routes),
    });

    // enum `CrawlerName`LabelEnum { "detailPage" = "detailPage", "otherLabel" = "otherLabel", ... };
    const labelEnumKey = define({
      key: `${crawlerName}LabelEnum`,
      value: () => makeEnum(crawler.routes),
      kind: 'enum',
    });

    const ctxTypeArgs = [
      `TInput extends Record<string, any> = ${actorInputType}`,
      `TIO extends ${ioType} = ${ioType}`,
      `Telem extends ${telemType}<any, any> = ${telemType}<any, any>`,
    ];

    // 4. Create CrawleeOne context
    // type `CrawlerName`Ctx = <TIO, Telem>CrawleeOneTypes<CheerioCrawlingContext, `CrawlerName`Label, ActorInput, TIO, Telem>
    const ctxKey = define({
      key: `${crawlerName}Ctx`,
      value: `${ctxType}<${crawlingContextTypeName}, ${labelKey}, TInput, TIO, Telem>`,
      typeArgs: ctxTypeArgs,
    });

    // 5. Get CrawleeOne context - needed for crawler and onReady
    const actorCtxKey = define({
      key: `${crawlerName}ActorCtx`,
      value: `${actorCtx}<${ctxKey}<TInput, TIO, Telem>>`,
      typeArgs: ctxTypeArgs,
    });

    // 6. Create CrawleeOne instance
    const crawlerKey = define({
      key: `${crawlerName}Crawler`,
      value: `(args: Omit<${argsType}<"${crawlerType}", ${ctxKey}<TInput, TIO, Telem>>, 'type'>, onReady?: (context: ${actorCtxKey}<TInput, TIO, Telem>) => ${maybeP}<void>) => ${crawleeOneFn}<"${crawlerType}", ${ctxKey}<TInput, TIO, Telem>>({ ...args, type: "${crawlerType}"}, onReady);`,
      kind: 'func',
      typeArgs: ctxTypeArgs,
    });

    // 7. Create Route types (single-param: CrawleeOneRoute<T>, etc.)
    const routeKey = define({
      key: `${crawlerName}Route`,
      value: `${routeType}<${ctxKey}<TInput, TIO, Telem>>`,
      typeArgs: ctxTypeArgs,
    });

    const routeHandlerValue = `${routeHandler}<${ctxKey}<TInput, TIO, Telem>>`;
    const routeHandlerKey = define({
      key: `${crawlerName}RouteHandler`,
      value: routeHandlerValue,
      typeArgs: ctxTypeArgs,
    });

    // E.g. `type `crawlerName`RouteWrapper = CrawleeOneRouteMiddleware<`CrawlerName`Ctx>`
    const routeWrapperKey = define({
      key: `${crawlerName}RouteWrapper`,
      value: `${routeWrapper}<${ctxKey}<TInput, TIO, Telem>>`,
      typeArgs: ctxTypeArgs,
    });

    // E.g. `type `crawlerName`Matcher = CrawleeOneRouteMatcher<`CrawlerName`Ctx>`
    const routeMatcherKey = define({
      key: `${crawlerName}RouteMatcher`,
      value: `${routeMatcher}<${ctxKey}<TInput, TIO, Telem>>`,
      typeArgs: ctxTypeArgs,
    });

    // E.g. `type `crawlerName`MatcherFn = CrawleeOneRouteMatcherFn<`CrawlerName`Ctx>`
    const routeMatcherFnKey = define({
      key: `${crawlerName}RouteMatcherFn`,
      value: `${routeMatcherFn}<${ctxKey}<TInput, TIO, Telem>>`,
      typeArgs: ctxTypeArgs,
    });

    // 9. Create Crawler hooks

    // NOTE: Type for before/after handler is the same as for handlers
    // E.g. `type `CrawlerName`OnBeforeHandler = CrawleeOneRouteHandler<CheerioCrawlingContext, ProfesiaRouterContext>`
    // E.g. `type `CrawlerName`OnAfterHandler = CrawleeOneRouteHandler<CheerioCrawlingContext, ProfesiaRouterContext>`
    const onBeforeHandlerKey = define({
      key: `${crawlerName}OnBeforeHandler`,
      value: routeHandlerValue,
      typeArgs: ctxTypeArgs,
    });
    const onAfterHandlerKey = define({
      key: `${crawlerName}OnAfterHandler`,
      value: routeHandlerValue,
      typeArgs: ctxTypeArgs,
    });

    // type `CrawlerName`OnReady = <TIO, Telem>(context: CrawleeOneContext<`CrawlerName`Ctx>) => MaybePromise<void>;
    const onReadyKey = define({
      key: `${crawlerName}OnReady`,
      value: `(context: ${actorCtxKey}<TInput, TIO, Telem>) => ${maybeP}<void>;`,
      kind: 'typeFunc',
      typeArgs: ctxTypeArgs,
    });
  });

  const finalImports = Object.entries(imports).reduce<Record<string, string>>(
    (agg, [pkg, entriesSet]) => {
      const entries = [...entriesSet.values()];
      const uniqueNames = [...new Set(entries.map((e) => e.name))];
      const formattedEntries = uniqueNames.join(', ');
      const typeStr = entries.every((e) => e.typeOnly) ? 'type ' : '';
      agg[pkg] = `import ${typeStr}{ ${formattedEntries} } from "${pkg}"`;
      return agg;
    },
    {}
  );

  return { imports: finalImports, definitions };
};

/**
 * Generate types for CrawleeOne given a config.
 *
 * Reads the output file path from `config.generate.types.outFile`.
 * If the `generate.types` section is not present in the config, generation is skipped.
 *
 * Config can be passed directly, or as the path to the config file.
 * If the config is omitted, it is automatically searched for using CosmicConfig.
 */
export const generateTypes = async (configOrPath?: CrawleeOneConfig | string) => {
  const config =
    !configOrPath || typeof configOrPath === 'string'
      ? await loadConfig(configOrPath)
      : configOrPath;
  validateConfig(config);

  if (!config?.generate?.types?.outFile) return;

  const outfile = path.resolve(process.cwd(), config.generate.types.outFile);

  const { imports, definitions } = await parseTypesFromSchema(config.schema);
  const fileContent =
    '/* eslint-disable */\n// Auto-generated by crawlee-one – do not edit\n' +
    Object.values(imports).join('\n') +
    '\n\n\n' +
    Object.values(definitions).join('\n\n');

  const outdir = path.dirname(outfile);
  await fsp.mkdir(outdir, { recursive: true });
  await fsp.writeFile(outfile, fileContent, 'utf-8');

  console.log(`Generated types at ${outfile}`);
};
