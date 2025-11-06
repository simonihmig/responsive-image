import { extensions, ember, classicEmberSupport } from '@embroider/vite';
import { babel } from '@rollup/plugin-babel';
import { defineConfig } from 'vite';

// For scenario testing
const isCompat = Boolean(process.env.ENABLE_COMPAT_BUILD);

export default defineConfig({
  resolve: {
    alias: [
      {
        find: '@responsive-image/ember',
        replacement: `${__dirname}/src`,
      },
    ],
  },
  plugins: [
    ...(isCompat ? [classicEmberSupport()] : []),
    ember(),
    babel({
      babelHelpers: 'inline',
      extensions,
    }),
  ],
  publicDir: 'test-assets',
  build: {
    rollupOptions: {
      input: {
        tests: 'tests/index.html',
      },
    },
  },
});
