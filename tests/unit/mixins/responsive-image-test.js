/* jshint expr:true */
import { expect } from 'chai';
import {
  describe,
  it
} from 'mocha';
import Ember from 'ember';
import ResponsiveImageMixin from 'ember-responsive-image/mixins/responsive-image';

describe('ResponsiveImageMixin', function() {
  // Replace this with your real tests.
  it('works', function() {
    let ResponsiveImageObject = Ember.Object.extend(ResponsiveImageMixin);
    let subject = ResponsiveImageObject.create();
    expect(subject).to.be.ok;
  });
});
