import type ResponsiveImageComponent from 'ember-responsive-image/components/responsive-image';
import type ResponsiveImageCloudinaryProvider from 'ember-responsive-image/helpers/responsive-image-cloudinary-provider';
import type ResponsiveImageImgixProvider from 'ember-responsive-image/helpers/responsive-image-imgix-provider';
import type ResponsiveImageLocalProvider from 'ember-responsive-image/helpers/responsive-image-local-provider';
import type ResponsiveImageResolve from 'ember-responsive-image/helpers/responsive-image-resolve';

export default interface Registry {
  ResponsiveImage: typeof ResponsiveImageComponent;
  'responsive-image-cloudinary-provider': typeof ResponsiveImageCloudinaryProvider;
  'responsive-image-imgix-provider': typeof ResponsiveImageImgixProvider;
  'responsive-image-local-provider': typeof ResponsiveImageLocalProvider;
  'responsive-image-resolve': typeof ResponsiveImageResolve;
}
