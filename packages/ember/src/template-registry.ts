import type ResponsiveImageComponent from './components/responsive-image.ts';
import type ResponsiveImageResolve from './helpers/responsive-image-resolve.ts';
import type CloudinaryProvider from './helpers/responsive-image-cloudinary';
import type NetlifyProvider from './helpers/responsive-image-netlify';
import type ImgixProvider from './helpers/responsive-image-imgix.ts';

export default interface Registry {
  ResponsiveImage: typeof ResponsiveImageComponent;
  'responsive-image-resolve': typeof ResponsiveImageResolve;
  'responsive-image-cloudinary': typeof CloudinaryProvider;
  'responsive-image-netlify': typeof NetlifyProvider;
  'responsive-image-imgix': typeof ImgixProvider;
}
