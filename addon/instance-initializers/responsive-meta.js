import $ from 'jquery';
import ResponsiveImage from '../services/responsive-image';

export function initialize(/* appInstance */) {
  if (typeof FastBoot === 'undefined') {
    let meta = JSON.parse($('#ember_responsive_image_meta').text());
    ResponsiveImage.reopen({
      meta
    });
  }
}

export default {
  name: 'responsive-meta',
  initialize
};
