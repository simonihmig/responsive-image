import { setupPlugins } from '@responsive-image/vite-plugin';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  vite: {
    plugins: [
      setupPlugins({
        include: /^[^?]+\.jpg\?.*responsive.*$/,
      }),
    ],
  },
});
