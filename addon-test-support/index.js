import { initialize } from 'ember-responsive-image/initializers/responsive-meta';

export function setupResponsiveImage(hooks = self) {
  hooks.beforeEach(initialize);
}
