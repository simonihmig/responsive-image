import ResponsiveImage from '../services/responsive-image';
import Ember from 'ember';

export function initialize(/* appInstance */) {
  if (typeof FastBoot === 'undefined') {
    let meta = JSON.parse(Ember.$('#ember_responsive_image_meta').text());
    ResponsiveImage.reopen({
      meta
    });
  }
}

export default {
  name: 'responsive-meta',
  initialize
};
