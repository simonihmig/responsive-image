import BaseResponsiveImageService from 'ember-responsive-image/services/responsive-image';

/**
 * Extend Service in FastBoot
 */
export default class FastBootResponsiveImageService extends BaseResponsiveImageService {
  get meta() {
    return '__ember_responsive_image_meta__';
  }
}
