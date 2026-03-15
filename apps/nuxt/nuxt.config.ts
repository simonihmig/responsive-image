import { responsiveImage } from '@responsive-image/vite-plugin';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  app: {
    // The default value is "/_nuxt/", but for our Playwright tests we want to keep this consistent with other apps
    buildAssetsDir: '/assets/',
  },
  vite: {
    plugins: [responsiveImage()],
  },
});
