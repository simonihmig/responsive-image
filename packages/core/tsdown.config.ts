import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: [
    './src/index.ts',
    './src/blurhash/decode.ts',
    './src/blurhash/ssr.ts',
    './src/thumbhash/decode.ts',
    './src/thumbhash/ssr.ts',
  ],
  dts: true,
  exports: {
    packageJson: false,
  },
  fixedExtension: false,
});
