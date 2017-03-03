/* jshint expr:true */
import { expect } from 'chai';
import {
  it,
  describe
} from 'mocha';
import { setupComponentTest} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describe(
  'Helper: ResponsiveImageResolve',
  function() {
    setupComponentTest('responsive-image', {
      integration: true
    });
  it('works without size', function() {
    this.render(hbs`{{responsive-image-resolve "test.png"}}`);
    expect(this.$().html()).to.equal("/assets/images/responsive/test100w.png");
  }),
  it('is size aware', function() {
    this.inject.service('responsive-image');
    this.get('responsive-image').set('physicalWidth', 100);
    this.render(hbs`{{responsive-image-resolve "test.png" 45}}`);

    expect(this.$().html()).to.equal("/assets/images/responsive/test50w.png");
  });
});
