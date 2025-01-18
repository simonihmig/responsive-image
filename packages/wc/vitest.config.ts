import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    watch: false,
    browser: {
      provider: 'playwright', // or 'webdriverio'
      enabled: true,
      name: 'chromium', // browser name is required
      providerOptions: {
        launch: {
          channel: 'chrome',
        },
      },
    },
  },
});
