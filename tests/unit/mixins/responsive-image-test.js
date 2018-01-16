/* jshint expr:true */
import EmberObject from '@ember/object';
import { expect } from 'chai';
import {
  describe,
  it
} from 'mocha';
import ResponsiveImageMixin from 'ember-responsive-image/mixins/responsive-image';

describe('ResponsiveImageMixin', function() {
  // Replace this with your real tests.
  it('works', function() {
    let ResponsiveImageObject = EmberObject.extend(ResponsiveImageMixin);
    let subject = ResponsiveImageObject.create();
    expect(subject).to.be.ok;
  });
});
