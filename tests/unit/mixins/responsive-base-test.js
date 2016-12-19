/* jshint expr:true */
import { expect } from 'chai';
import {
  describe,
  it
} from 'mocha';
import Ember from 'ember';
import ResponsiveBaseMixin from 'ember-responsive-image/mixins/responsive-base';

describe('ResponsiveBaseMixin', function() {
  // Replace this with your real tests.
  it('works', function() {
    let ResponsiveBaseObject = Ember.Object.extend(ResponsiveBaseMixin);
    let subject = ResponsiveBaseObject.create();
    expect(subject).to.be.ok;
  });
});
