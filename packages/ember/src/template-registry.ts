import type ResponsiveImageComponent from './components/responsive-image.gts';
import type CloudinaryProvider from './helpers/responsive-image-cloudinary';
import type FastlyProvider from './helpers/responsive-image-fastly';
import type ImgixProvider from './helpers/responsive-image-imgix.ts';
import type NetlifyProvider from './helpers/responsive-image-netlify';
import type ResponsiveImageResolve from './helpers/responsive-image-resolve.ts';

export default interface Registry {
  ResponsiveImage: typeof ResponsiveImageComponent;
  'responsive-image-resolve': typeof ResponsiveImageResolve;
  'responsive-image-cloudinary': typeof CloudinaryProvider;
  'responsive-image-fastly': typeof FastlyProvider;
  'responsive-image-netlify': typeof NetlifyProvider;
  'responsive-image-imgix': typeof ImgixProvider;
}
