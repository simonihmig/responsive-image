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
      {
        // The Solid plugin hard-codes `hydratable: false` whenever the Vite
        // mode is exactly `"test"`, assuming a component test never hydrates.
        // Vitest's browser server always runs in that mode, so a `hydrate()`
        // test would compile to a plain client render and quietly test
        // nothing. Renaming the mode in place (rather than returning it, which
        // Vitest's browser server discards) is the only lever that reaches the
        // plugin's own `config` hook.
        name: 'solid-tests-v2:hydratable-mode',
        enforce: 'pre' as const,
        config(userConfig: { mode?: string }) {
          if (!testSSR && userConfig.mode === 'test')
            userConfig.mode = 'client';
          return null;
        },
      },
      solid({
        hot: false,
        // `ssr: true` selects the *hydratable* transforms, in both directions:
        // `_hk` keys in the server markup, and `getNextElement` claims in the
        // client build. Without it `renderToString` emits no keys, so
        // `hydrate()` finds nothing to claim and silently builds a detached
        // tree — every test that touches `hydrate()` then passes or fails for
        // the wrong reason.
        ssr: true,
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
      setupFiles: ['tests/setup.ts'],
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
