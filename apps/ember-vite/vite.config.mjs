import { defineConfig } from 'vite';
import {
  resolver,
  hbs,
  scripts,
  templateTag,
  optimizeDeps,
  compatPrebuild,
  assets,
  contentFor,
} from '@embroider/vite';
import { resolve } from 'path';
import { babel } from '@rollup/plugin-babel';

const root = 'tmp/rewritten-app';
const extensions = [
  '.mjs',
  '.gjs',
  '.js',
  '.mts',
  '.gts',
  '.ts',
  '.hbs',
  '.json',
];

export default defineConfig(({ mode }) => {
  return {
    root,
    cacheDir: resolve('node_modules', '.vite'),
    resolve: {
      extensions,
    },
    plugins: [
      hbs(),
      templateTag(),
      scripts(),
      resolver(),
      compatPrebuild(),
      assets(),
      contentFor(),

      babel({
        babelHelpers: 'runtime',
        extensions,
      }),
    ],
    optimizeDeps: optimizeDeps(),
    publicDir: resolve(process.cwd(), 'public'),
    server: {
      port: 4200,
      watch: {
        ignored: ['!**/tmp/rewritten-app/**'],
      },
    },
    build: {
      outDir: resolve(process.cwd(), 'dist'),
      rollupOptions: {
        input: {
          main: resolve(root, 'index.html'),
          ...(shouldBuildTests(mode)
            ? { tests: resolve(root, 'tests/index.html') }
            : undefined),
        },
      },
    },
  };
});

function shouldBuildTests(mode) {
  return mode !== 'production' || process.env.FORCE_BUILD_TESTS;
}
