import solidPlugin from '@solidjs/vite-plugin';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [solidPlugin()],
  test: {
    browser: {
      enabled: true,
      provider: playwright({ launchOptions: { channel: 'chrome' } }),
      instances: [{ name: 'Chrome', browser: 'chromium' }],
    },
    include: ['tests/client.test.{ts,tsx}'],
    env: {
      NODE_ENV: 'development',
      DEV: '1',
      SSR: '',
      PROD: '',
    },
    server: {
      deps: {
        inline: true,
      },
    },
  },
  ssr: {
    noExternal: true,
  },
  resolve: {
    alias: {
      'solid-js/internal': new URL(
        './node_modules/solid-js/dist/internal.js',
        import.meta.url,
      ).pathname,
    },
    conditions: ['browser', 'development'],
  },
});
