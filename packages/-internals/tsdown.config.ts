import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: {
    eslint: './src/eslint/index.js',
    playwright: './src/playwright/index.ts',
  },
  dts: true,
  exports: {
    packageJson: false,
    customExports: {
      './screenshots': './src/playwright/__screenshots__/index.js',
    },
  },
  fixedExtension: false,
});
