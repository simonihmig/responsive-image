import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['./src/index.ts'],
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
