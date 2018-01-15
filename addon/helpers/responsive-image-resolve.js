import { inject as service } from '@ember/service';
import { htmlSafe } from '@ember/string';
import Helper from '@ember/component/helper';

/**
 * @class responsiveImageResolve
 * @namespace Helpers
 * @extends Ember.Helper
 * @public
 */
export default Helper.extend({
  responsiveImage: service(),

  compute(params/*, hash*/) {
    let image = params[0];
    let size = params[1] || 100;
    let responsive = this.get('responsiveImage').getImageBySize(image, size);

    return htmlSafe(responsive);
  }
});
