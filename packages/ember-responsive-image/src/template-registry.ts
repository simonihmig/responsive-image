import type ResponsiveImageComponent from './components/responsive-image.ts';
import type ResponsiveImageResolve from './helpers/responsive-image-resolve.ts';

export default interface Registry {
  ResponsiveImage: typeof ResponsiveImageComponent;
  'responsive-image-resolve': typeof ResponsiveImageResolve;
}
