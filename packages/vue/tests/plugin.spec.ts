import { describe, it, expect } from 'vitest';
import { createApp } from 'vue';

import { MyPlugin } from '../src/index';

describe('MyPlugin', () => {
  it('installs without errors', () => {
    const app = createApp({});
    expect(() => app.use(MyPlugin)).not.toThrow();
  });

  it('registers global component with default prefix', () => {
    const app = createApp({});
    app.use(MyPlugin);
    expect(app.component('MyComponent')).toBeDefined();
  });

  it('registers global component with custom prefix', () => {
    const app = createApp({});
    app.use(MyPlugin, { prefix: 'Custom' });
    expect(app.component('CustomComponent')).toBeDefined();
  });

  it('adds global property when enabled', () => {
    const app = createApp({});
    app.use(MyPlugin, { globalProperty: true });
    expect(app.config.globalProperties.$myPlugin).toBeDefined();
    expect(app.config.globalProperties.$myPlugin.greet).toBeInstanceOf(
      Function,
    );
  });

  it('does not add global property when disabled', () => {
    const app = createApp({});
    app.use(MyPlugin, { globalProperty: false });
    expect(app.config.globalProperties.$myPlugin).toBeUndefined();
  });

  it('global property greet function works correctly', () => {
    const app = createApp({});
    app.use(MyPlugin);
    const result = app.config.globalProperties.$myPlugin.greet('World');
    expect(result).toBe('Hello from MyPlugin, World!');
  });
});
