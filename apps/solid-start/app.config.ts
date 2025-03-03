import { setupPlugins } from '@responsive-image/vite-plugin';
import { defineConfig } from '@solidjs/start/config';

export default defineConfig({
  vite: {
    plugins: [
      setupPlugins({
        include: /^[^?]+\.jpg\?.*responsive.*$/,
      }),
    ],
  },
});
