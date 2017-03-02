/* jshint expr:true */
import { expect } from 'chai';
import {
  it
} from 'mocha';
import {describeComponent} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describeComponent(
  'responsive-image',
  'Helper: ResponsiveImageResolve',
  {
    integration: true
  },
  function() {
  // Replace this with your real tests.
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
