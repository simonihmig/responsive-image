import { describe, it, expect } from 'vitest';
import { createApp } from 'vue';

import plugin from '../src/index';

describe('Plugin', () => {
  it('installs without errors', () => {
    const app = createApp({});
    expect(() => app.use(plugin)).not.toThrow();
  });

  it('registers global component with default prefix', () => {
    const app = createApp({});
    app.use(plugin);
    expect(app.component('ResponsiveImage')).toBeDefined();
  });
});
