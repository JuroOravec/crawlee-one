import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    cli: 'src/cli/index.ts',
  },
  format: ['esm'],
  // Declarations generated separately via tsc
  dts: false,
  clean: true,
  sourcemap: true,
});
