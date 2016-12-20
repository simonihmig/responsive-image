import Ember from 'ember';

const {inject, Helper} = Ember;

/**
 * @class responsiveImageResolve
 * @namespace Helpers
 * @extends Ember.Helper
 * @public
 */
export default Helper.extend({
  responsiveImage: inject.service(),

  compute(params/*, hash*/) {
    let image = params[0];
    let size = params[1] || 100;
    let responsive = this.get('responsiveImage').getImageBySize(image, size);

    return Ember.String.htmlSafe(responsive);
  }
});
