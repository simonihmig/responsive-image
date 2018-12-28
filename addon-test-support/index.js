import { initialize } from 'ember-responsive-image/instance-initializers/responsive-meta';

export function setupResponsiveImage(hooks = self) {
  hooks.beforeEach(initialize);
}
