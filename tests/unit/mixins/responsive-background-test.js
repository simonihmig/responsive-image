/* jshint expr:true */
import EmberObject from '@ember/object';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import ResponsiveBackgroundMixin from 'ember-responsive-image/mixins/responsive-background';

describe('ResponsiveBackgroundMixin', function () {
  // Replace this with your real tests.
  it('works', function () {
    let ResponsiveBackgroundObject = EmberObject.extend(
      ResponsiveBackgroundMixin
    );
    let subject = ResponsiveBackgroundObject.create();
    expect(subject).to.be.ok;
  });
});
