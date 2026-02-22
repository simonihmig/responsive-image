import vue from '@vitejs/plugin-vue';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [vue()],
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
