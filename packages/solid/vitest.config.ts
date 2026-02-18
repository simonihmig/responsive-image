import { playwright } from '@vitest/browser-playwright';
import solidPlugin from 'vite-plugin-solid';
import { defineConfig } from 'vitest/config';

export default defineConfig(({ mode }) => {
  // to test in server environment, run with "--mode ssr" or "--mode test:ssr" flag
  // loads only server.test.ts file
  const testSSR = mode === 'test:ssr' || mode === 'ssr';

  return {
    plugins: [
      solidPlugin({
        // https://github.com/solidjs/solid-refresh/issues/29
        hot: false,
        // For testing SSR we need to do a SSR JSX transform
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
    },
  };
});
