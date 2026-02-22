import MyComponent from './components/MyComponent.vue';

import type { App, Plugin } from 'vue';

export interface MyPluginOptions {
  prefix?: string;
  globalProperty?: boolean;
}

const MyPlugin: Plugin = {
  install(app: App, options: MyPluginOptions = {}) {
    const { prefix = 'My', globalProperty = true } = options;

    // Register a global component
    app.component(`${prefix}Component`, MyComponent);

    // Add a global property (optional)
    if (globalProperty) {
      app.config.globalProperties['$myPlugin'] = {
        greet: (name: string) => `Hello from MyPlugin, ${name}!`,
      };
    }

    // Provide a composable or state if needed
    app.provide('myPluginPrefix', prefix);
  },
};

// Named export
export { MyPlugin };

// Export components for individual use
export { MyComponent };
