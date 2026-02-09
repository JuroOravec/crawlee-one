import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    // `import { crawleeOne } from 'crawlee-one';`
    index: 'src/index.ts',
    // `import { Apify } from 'crawlee-one/apify';`
    apify: 'src/lib/integrations/apify.ts',
    // `import { Sentry } from 'crawlee-one/sentry';`
    sentry: 'src/lib/telemetry/sentry.ts',
    // `npx crawlee-one@latest ...`
    cli: 'src/cli/index.ts',
  },
  format: ['esm'],
  // Declarations generated separately via tsc
  // (tsup's DTS bundler cannot handle apify's circular types)
  dts: false,
  clean: true,
  sourcemap: true,
});
