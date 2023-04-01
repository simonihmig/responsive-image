import type ResponsiveImageComponent from './components/responsive-image';
import type ResponsiveImageResolve from './helpers/responsive-image-resolve';

export default interface Registry {
  ResponsiveImage: typeof ResponsiveImageComponent;
  'responsive-image-resolve': typeof ResponsiveImageResolve;
}
