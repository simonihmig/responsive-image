import { setupPlugins } from '@responsive-image/vite-plugin';
import { defineConfig } from '@solidjs/start/config';

export default defineConfig({
  ssr: false,
  vite: {
    plugins: [
      setupPlugins({
        include: /^[^?]+\.jpg\?.*responsive.*$/,
      }),
    ],
  },
});
