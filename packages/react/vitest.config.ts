import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    watch: false,
    browser: {
      provider: 'playwright', // or 'webdriverio'
      enabled: true,
      instances: [
        {
          browser: 'chromium',
          launch: { channel: 'chrome' },
        },
      ],
    },
  },
});
