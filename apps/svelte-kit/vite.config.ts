import { sveltekit } from '@sveltejs/kit/vite';
import { setupPlugins } from '@responsive-image/vite-plugin';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    sveltekit(),
    setupPlugins({
      include: /^[^?]+\.jpg\?.*responsive.*$/,
    }),
  ],
});
