import solidPlugin from '@solidjs/vite-plugin';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [solidPlugin()],
  test: {
    environment: 'node',
    include: ['tests/server.test.{ts,tsx}'],
    env: {
      NODE_ENV: 'production',
      DEV: '',
      SSR: '1',
      PROD: '1',
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
    conditions: ['node'],
  },
});
