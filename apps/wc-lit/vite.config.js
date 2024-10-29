import { defineConfig } from 'vite';
import { setupPlugins } from '@responsive-image/vite-plugin';

export default defineConfig({
  plugins: [
    setupPlugins({
      include: /^[^?]+\.jpg\?.*responsive.*$/,
    }),
  ],
});
