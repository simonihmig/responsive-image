import { sveltekit } from '@sveltejs/kit/vite';
import { responsiveImage } from '@responsive-image/vite-plugin';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit(), responsiveImage()],
  preview: {
    port: 4202,
  },
});
