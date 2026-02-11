/* eslint-disable @typescript-eslint/no-unused-vars */
import fsp from 'fs/promises';
import path from 'node:path';

import type { CrawleeOneConfig, CrawleeOneConfigSchema } from '../../types/config.js';
import { crawlingContextNameByType } from '../../constants.js';
import { loadConfig, validateConfig } from './config.js';
// NOTE: We intentionally import these to know when their names change
import type { ActorInput } from '../../lib/input.js';
import type { CrawleeOneActorInst, CrawleeOneActorRouterCtx } from '../../lib/actor/types.js';
import type {
  CrawleeOneRoute,
  CrawleeOneRouteHandler,
  CrawleeOneRouteMatcher,
  CrawleeOneRouteMatcherFn,
  CrawleeOneRouteWrapper,
} from '../../lib/router/types.js';
import type { MaybePromise } from '../../utils/types.js';
import type { CrawleeOneArgs, crawleeOne } from '../../api.js';

const makeUnion = (items: string[]) => items.map((s) => `"${s}"`).join(` | `);
const makeEnum = (items: string[]) =>
  '{\n' + items.map((s) => `  '${s}' = '${s}'`).join(`,\n`) + '\n}';

const formatters = {
  type: (name: string, value: string, typeArgs?: string[]) => {
    const typeArgsStr = typeArgs?.length ? `<${typeArgs.join(', ')}>` : '';
    return `export type ${name}${typeArgsStr} = ${value};`;
  },
  typeFunc: (name: string, value: string, typeArgs?: string[]) => {
    const typeArgsStr = typeArgs?.length ? `<${typeArgs.join(', ')}>` : '';
    return `export type ${name} = ${typeArgsStr}${value};`;
  },
  func: (name: string, value: string, typeArgs?: string[]) => {
    const typeArgsStr = typeArgs?.length ? `<${typeArgs.join(', ')}>` : '';
    return `export const ${name} = ${typeArgsStr}${value};`;
  },
  // enum `CrawlerName`LabelEnum { "detailPage" = "detailPage", "otherLabel" = "otherLabel", ... };
  enum: (name: string, value: string, typeArgs?: string[]) => {
    return `export enum ${name} ${value}`;
  },
} satisfies Record<string, (name: string, value: string, args?: string[]) => string>;

const parseTypesFromSchema = (schema: CrawleeOneConfigSchema) => {
  /** Remember which types we've already generated */
  const definitions: Record<string, string> = {};

  /** Remember what values need to be imported and from where */
  const imports: Record<string, Set<{ name: string; typeOnly?: boolean }>> = {};

  const addImports = <T extends string>(
    pkg: string,
    newEntries: T[],
    options?: { typeOnly?: boolean }
  ) => {
    const { typeOnly } = options ?? {};
    const entries = (imports[pkg] = imports[pkg] || new Set());
    newEntries.forEach((name) => entries.add({ name, typeOnly }));
    // Return the entries as variables, so we can define them in a single
    // place but still reference them in code.
    return newEntries.reduce<{ [Key in T]: Key }>((agg, key) => {
      agg[key] = key;
      return agg;
    }, {} as any);
  };

  const define = (
    key: string,
    value: string | (() => string),
    options?: { typeArgs?: string[]; kind?: keyof typeof formatters }
  ) => {
    const kind = options?.kind ?? 'type';
    const typeArgs = options?.typeArgs ?? [];
    if (!definitions[key]) {
      const resolvedVal = typeof value === 'function' ? value() : value;
      const formatter = formatters[kind];
      const valFormatted = formatter(key, resolvedVal, typeArgs);
      definitions[key] = valFormatted;
    }
    // Return the key as variable, so we can reference it
    return key;
  };

  // 1. Define imports
  const {
    ActorInput: actorInputType,
    CrawleeOneActorRouterCtx: actorRouterCtx,
    CrawleeOneActorInst: actorCtx,
    CrawleeOneRoute: routeType,
    CrawleeOneRouteHandler: routeHandler,
    CrawleeOneRouteWrapper: routeWrapper,
    CrawleeOneRouteMatcher: routeMatcher,
    CrawleeOneRouteMatcherFn: routeMatcherFn,
    CrawleeOneIO: ioType,
    CrawleeOneTelemetry: telemType,
    CrawleeOneCtx: ctxType,
    CrawleeOneArgs: argsType,
    crawleeOne: crawleeOneFn,
  } = addImports('crawlee-one', [
    'ActorInput',
    'CrawleeOneActorRouterCtx',
    'CrawleeOneActorInst',
    'CrawleeOneRoute',
    'CrawleeOneRouteHandler',
    'CrawleeOneRouteWrapper',
    'CrawleeOneRouteMatcher',
    'CrawleeOneRouteMatcherFn',
    'CrawleeOneIO',
    'CrawleeOneTelemetry',
    'CrawleeOneCtx',
    'CrawleeOneArgs',
    'crawleeOne',
  ]);
  addImports('crawlee', Object.values(crawlingContextNameByType), { typeOnly: true });

  // 2. Define utils
  const maybeP = define('MaybePromise', 'T | Promise<T>', { typeArgs: ['T'] });

  Object.entries(schema.crawlers).forEach(([crawlerName, crawler]) => {
    const crawlerType = crawler.type;

    // 2. Get `CrawlingContext`, e.g. 'cheerio' => `CheerioCrawlingContext`;
    const crawlingContextTypeName = crawlingContextNameByType[crawlerType];

    // 3. Generate type for route labels
    // type `CrawlerName`Label = "detailPage" | "otherLabel" | ...;
    const labelKey = define(`${crawlerName}Label`, () => makeUnion(crawler.routes));

    // enum `CrawlerName`LabelEnum { "detailPage" = "detailPage", "otherLabel" = "otherLabel", ... };
    const labelEnumKey = define(`${crawlerName}LabelEnum`, () => makeEnum(crawler.routes), {
      kind: 'enum',
    });

    const ctxTypeArgs = [
      `TInput extends Record<string, any> = ${actorInputType}`,
      `TIO extends ${ioType} = ${ioType}`,
      `Telem extends ${telemType}<any, any> = ${telemType}<any, any>`,
    ];

    // 4. Create CrawleeOne context
    // type `CrawlerName`Ctx = <TIO, Telem>CrawleeOneCtx<CheerioCrawlingContext, `CrawlerName`Label, ActorInput, TIO, Telem>
    const ctxKey = define(
      `${crawlerName}Ctx`,
      `${ctxType}<${crawlingContextTypeName}, ${labelKey}, TInput, TIO, Telem>`,
      { typeArgs: ctxTypeArgs }
    );

    // 5. Create CrawleeOne instance
    // const customCrawler = <TIO, Telem>(args: CrawleeOneArgs<TType, T>) => crawleeOne(args);
    const crawlerKey = define(
      `${crawlerName}Crawler`,
      `(args: Omit<${argsType}<"${crawlerType}", ${ctxKey}<TInput, TIO, Telem>>, 'type'>) => ${crawleeOneFn}<"${crawlerType}", ${ctxKey}<TInput, TIO, Telem>>({ ...args, type: "${crawlerType}"});`,
      { kind: 'func', typeArgs: ctxTypeArgs }
    );

    // 6. Get actor router context (`CrawleeOneActorRouterCtx`)
    // NOTE: We use `ActorInput` for the Actor input, because this type definition
    //       will be used by developers.
    const routerCtxKey = define(
      `${crawlerName}RouterContext`,
      `${actorRouterCtx}<${ctxKey}<TInput, TIO, Telem>>`,
      { typeArgs: ctxTypeArgs }
    );

    // 7. Get actor context (`CrawleeOneActorInst`)
    // NOTE: We use `ActorInput` for the Actor input, because this type definition
    //       will be used by developers.
    const actorCtxKey = define(
      `${crawlerName}ActorCtx`,
      `${actorCtx}<${ctxKey}<TInput, TIO, Telem>>`,
      { typeArgs: ctxTypeArgs }
    );

    // 8. Create Route types
    // E.g. `type `crawlerName`Route = CrawleeOneRout<`CrawlerName`Ctx>`
    const routeKey = define(
      `${crawlerName}Route`,
      `${routeType}<${ctxKey}<TInput, TIO, Telem>, ${routerCtxKey}<TInput, TIO, Telem>>`,
      {
        typeArgs: ctxTypeArgs,
      }
    );

    // E.g. `type `crawlerName`RouteHandler = CrawleeOneRouteHandler<`CrawlerName`Ctx, CrawlerName`ActorRouterCtx>`
    const routeHandlerValue = `${routeHandler}<${ctxKey}<TInput, TIO, Telem>, ${routerCtxKey}<TInput, TIO, Telem>>`;
    const routeHandlerKey = define(`${crawlerName}RouteHandler`, routeHandlerValue, {
      typeArgs: ctxTypeArgs,
    });

    // E.g. `type `crawlerName`RouteWrapper = CrawleeOneRouteWrapper<`CrawlerName`Ctx, CrawlerName`ActorRouterCtx>`
    const routeWrapperKey = define(
      `${crawlerName}RouteWrapper`,
      `${routeWrapper}<${ctxKey}<TInput, TIO, Telem>, ${routerCtxKey}<TInput, TIO, Telem>>`,
      { typeArgs: ctxTypeArgs }
    );

    // E.g. `type `crawlerName`Matcher = CrawleeOneRouteMatcher<`CrawlerName`Ctx, CrawlerName`ActorRouterCtx>`
    const routeMatcherKey = define(
      `${crawlerName}RouteMatcher`,
      `${routeMatcher}<${ctxKey}<TInput, TIO, Telem>, ${routerCtxKey}<TInput, TIO, Telem>>`,
      { typeArgs: ctxTypeArgs }
    );

    // E.g. `type `crawlerName`Matcher = CrawleeOneRouteMatcher<`CrawlerName`Ctx, CrawlerName`ActorRouterCtx>`
    const routeMatcherFnKey = define(
      `${crawlerName}RouteMatcherFn`,
      `${routeMatcherFn}<${ctxKey}<TInput, TIO, Telem>, ${routerCtxKey}<TInput, TIO, Telem>>`,
      { typeArgs: ctxTypeArgs }
    );

    // 9. Create Crawler hooks

    // NOTE: Type for before/after handler is the same as for handlers
    // E.g. `type `CrawlerName`OnBeforeHandler = CrawleeOneRouteHandler<CheerioCrawlingContext, ProfesiaRouterContext>`
    // E.g. `type `CrawlerName`OnAfterHandler = CrawleeOneRouteHandler<CheerioCrawlingContext, ProfesiaRouterContext>`
    const onBeforeHandlerKey = define(`${crawlerName}OnBeforeHandler`, routeHandlerValue, {
      typeArgs: ctxTypeArgs,
    });
    const onAfterHandlerKey = define(`${crawlerName}OnAfterHandler`, routeHandlerValue, {
      typeArgs: ctxTypeArgs,
    });

    // type `CrawlerName`OnReady = <TIO, Telem>(actor: CrawleeOneActorInst<`CrawlerName`Label, ActorInput, TIO, Telem, `type`CrawlingContext>) => MaybePromise<void>;
    const onReadyKey = define(
      `${crawlerName}OnReady`,
      `(actor: ${actorCtxKey}<TInput, TIO, Telem>) => ${maybeP}<void>;`,
      { kind: 'typeFunc', typeArgs: ctxTypeArgs }
    );
  });

  const finalImports = Object.entries(imports).reduce<Record<string, string>>(
    (agg, [pkg, entriesSet]) => {
      const entries = [...entriesSet.values()];
      const formattedEntries = entries.map((e) => e.name).join(', ');
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
 * Config can be passed directly, or as the path to the config file.
 * If the config is omitted, it is automatically searched for using CosmicConfig.
 */
export const generateTypes = async (outfile: string, configOrPath?: CrawleeOneConfig | string) => {
  const config =
    !configOrPath || typeof configOrPath === 'string'
      ? await loadConfig(configOrPath)
      : configOrPath;
  validateConfig(config);

  const { imports, definitions } = await parseTypesFromSchema(config!.schema);
  const fileContent =
    Object.values(imports).join('\n') + '\n\n\n' + Object.values(definitions).join('\n\n');

  const outdir = path.dirname(outfile);
  await fsp.mkdir(outdir, { recursive: true });
  await fsp.writeFile(outfile, fileContent, 'utf-8');

  console.log(`Done generating types to ${outfile}`);
};
