import ResponsiveImage from '../services/responsive-image';

export function initialize(/* appInstance */) {
  if (typeof FastBoot === 'undefined') {
    let meta = JSON.parse(
      document.querySelector('#ember_responsive_image_meta').textContent
    );
    ResponsiveImage.reopen({
      meta,
    });
  }
}

export default {
  name: 'responsive-meta',
  initialize,
};
