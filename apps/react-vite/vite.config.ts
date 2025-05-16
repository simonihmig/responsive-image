import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { setupPlugins } from '@responsive-image/vite-plugin';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    setupPlugins({
      include: /^[^?]+\.jpg\?.*responsive.*$/,
    }),
  ],
  preview: {
    port: 4207,
  },
});
