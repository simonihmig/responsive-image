/* jshint expr:true */
import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import ResponsiveBackgroundMixin from 'ember-responsive-image/mixins/responsive-background';

module('ResponsiveBackgroundMixin', function () {
  // Replace this with your real tests.
  test('works', function (assert) {
    let ResponsiveBackgroundObject = EmberObject.extend(
      ResponsiveBackgroundMixin
    );
    let subject = ResponsiveBackgroundObject.create();
    assert.ok(subject);
  });
});
