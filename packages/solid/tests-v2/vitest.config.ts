import { fileURLToPath } from 'node:url';
import { playwright } from '@vitest/browser-playwright';
import solid from '@solidjs/vite-plugin';
import { defineConfig } from 'vitest/config';

export default defineConfig(({ mode }) => {
  // Node/`renderToString` tests run with "--mode stub"/"--mode ssr":
  // only `server.test.tsx` is picked up then.
  const testSSR = mode === 'test:ssr' || mode === 'ssr';

  return {
    plugins: [
      solid({
        hot: false,
        solid: { generate: testSSR ? 'ssr' : 'dom' },
      }),
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
          }
        : {
            include: ['tests/*.test.{ts,tsx}'],
            exclude: ['tests/server.test.{ts,tsx}'],
          }),
      ...(testSSR ? { environment: 'node' } : {}),
    },
    resolve: {
      conditions: testSSR ? ['node'] : ['browser', 'development'],
      alias: {
        // The `../src` source is outside the tests-v2 Vite root, so the
        // browser dev server cannot resolve it as a relative import.
        '@responsive-image/solid': fileURLToPath(
          new URL('../src', import.meta.url),
        ),
      },
    },
  };
});
