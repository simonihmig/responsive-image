import { defineConfig } from 'vite';
import { responsiveImage } from '@responsive-image/vite-plugin';

export default defineConfig({
  plugins: [
    responsiveImage({
      styles: 'inline',
    }),
  ],
  preview: {
    port: 4201,
  },
});
