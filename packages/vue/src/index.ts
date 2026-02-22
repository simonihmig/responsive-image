import ResponsiveImage from './responsive-image.vue';

import type { App, Plugin } from 'vue';

const ResponsiveImagePlugin: Plugin = {
  install(app: App) {
    // Register a global component
    app.component('ResponsiveImage', ResponsiveImage);
  },
};

export default ResponsiveImagePlugin;
export { ResponsiveImage };
