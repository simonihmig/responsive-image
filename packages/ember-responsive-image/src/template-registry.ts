import type ResponsiveImageComponent from './components/responsive-image.ts';
import type ResponsiveImageResolve from './helpers/responsive-image-resolve.ts';
import type CloudinaryProvider from './helpers/responsive-image-cloudinary-provider';
import type ImgixProvider from './helpers/responsive-image-imgix-provider';

export default interface Registry {
  ResponsiveImage: typeof ResponsiveImageComponent;
  'responsive-image-resolve': typeof ResponsiveImageResolve;
  'responsive-image-cloudinary-provider': typeof CloudinaryProvider;
  'responsive-image-imgix-provider': typeof ImgixProvider;
}
