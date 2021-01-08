import ResponsiveImage from 'ember-responsive-image/services/responsive-image';

export function initialize(/* appInstance */) {
  let meta = '__ember_responsive_image_meta__';
  ResponsiveImage.reopen({
    meta,
  });
}

export default {
  name: 'responsive-meta',
  initialize,
};
