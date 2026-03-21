import { sveltekit } from '@sveltejs/kit/vite';
import { responsiveImage } from '@responsive-image/vite-plugin';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    sveltekit(),
    // @ts-expect-error -- https://github.com/vitejs/vite/issues/21981
    responsiveImage(),
  ],
  preview: {
    port: 4202,
  },
});
