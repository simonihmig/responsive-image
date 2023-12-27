import type ImgixProvider from './helpers/responsive-image-imgix-provider';

export default interface Registry {
  'responsive-image-imgix-provider': typeof ImgixProvider;
}
