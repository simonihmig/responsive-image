import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { responsiveImage } from '@responsive-image/vite-plugin';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // @ts-expect-error -- https://github.com/vitejs/vite/issues/21981
    responsiveImage(),
  ],
  preview: {
    port: 4207,
  },
});
