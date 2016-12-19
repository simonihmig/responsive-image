/* jshint expr:true */
import { expect } from 'chai';
import {
  describe,
  it
} from 'mocha';
import Ember from 'ember';
import ResponsiveBackgroundMixin from 'ember-responsive-image/mixins/responsive-background';

describe('ResponsiveBackgroundMixin', function() {
  // Replace this with your real tests.
  it('works', function() {
    let ResponsiveBackgroundObject = Ember.Object.extend(ResponsiveBackgroundMixin);
    let subject = ResponsiveBackgroundObject.create();
    expect(subject).to.be.ok;
  });
});
