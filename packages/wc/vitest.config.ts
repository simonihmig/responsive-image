import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    watch: false,
    browser: {
      provider: playwright({
        launchOptions: { channel: 'chrome' },
      }),
      enabled: true,
      instances: [
        {
          browser: 'chromium',
        },
      ],
    },
  },
});
