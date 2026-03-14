import { defineConfig } from 'vite';
import { setupPlugins } from '@responsive-image/vite-plugin';

export default defineConfig({
  plugins: [
    setupPlugins({
      styles: 'inline',
    }),
  ],
  preview: {
    port: 4201,
  },
});
