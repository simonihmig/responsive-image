import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: {
    index: './src/index.ts',
    export: './src/export.ts',
    resize: './src/resize.ts',
    loader: './src/loader.ts',
    'lqip/*': './src/lqip/*.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  exports: {
    packageJson: false,
    customExports: {
      './client': { import: { types: './client.d.ts' } },
    },
    legacy: false,
  },
});
