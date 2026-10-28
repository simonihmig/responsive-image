import { createRequire } from 'node:module';

import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

const require = createRequire(import.meta.url);

const isSolid2: boolean = require('solid-js/package.json').version.startsWith(
  '2.',
);

// the plugin package name differs between solid v1 and v2, and only one of them
// is installed at a time
function loadSolidPlugin() {
  const name = isSolid2 ? '@solidjs/vite-plugin' : 'vite-plugin-solid';
  const mod = require(name);
  return typeof mod === 'function' ? mod : mod.default;
}

export default defineConfig(({ mode }) => {
  // to test in server environment, run with "--mode ssr" or "--mode test:ssr" flag
  // loads only server.test.ts file
  const testSSR = mode === 'test:ssr' || mode === 'ssr';
  const solidPlugin = loadSolidPlugin();

  return {
    plugins: [
      solidPlugin(
        // https://github.com/solidjs/solid-refresh/issues/29
        // For testing SSR we need to do a SSR JSX transform
        isSolid2
          ? {}
          : { hot: false, solid: { generate: testSSR ? 'ssr' : 'dom' } },
      ),
    ],
    test: {
      browser: {
        enabled: !testSSR,
        provider: playwright({ launchOptions: { channel: 'chrome' } }),
        instances: [
          {
            name: 'Chrome',
            browser: 'chromium',
          },
        ],
      },
      watch: false,
      isolate: !testSSR,
      env: {
        NODE_ENV: testSSR ? 'production' : 'development',
        DEV: testSSR ? '' : '1',
        SSR: testSSR ? '1' : '',
        PROD: testSSR ? '1' : '',
      },
      transformMode: { web: [/\.[jt]sx$/] },
      ...(testSSR
        ? {
            include: ['tests/server.test.{ts,tsx}'],
            environment: 'node',
          }
        : {
            include: ['tests/*.test.{ts,tsx}'],
            exclude: ['tests/server.test.{ts,tsx}'],
          }),
    },
    resolve: {
      // the tests import the version specific harness via the same specifier
      ...(isSolid2
        ? {
            alias: {
              './solid': new URL('./tests/solid.v2.ts', import.meta.url)
                .pathname,
            },
          }
        : {}),
      conditions: testSSR ? ['node'] : ['browser', 'development'],
    },
  };
});
