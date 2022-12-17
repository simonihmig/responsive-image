import type ResponsiveImageCloudinaryProvider from './helpers/responsive-image-cloudinary-provider';

export default interface Registry {
  'responsive-image-cloudinary-provider': typeof ResponsiveImageCloudinaryProvider;
}
