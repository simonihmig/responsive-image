import type { CloudinaryConfig } from './cloudinary';
import type { FastlyConfig } from './fastly';
import type { ImgixConfig } from './imgix';
import type { NetlifyConfig } from './netlify';
import type { ImageTypeAuto, ImageType } from '@responsive-image/core';

export interface Config {
  imgix?: ImgixConfig;
  fastly?: FastlyConfig;
  cloudinary?: CloudinaryConfig;
  netlify?: NetlifyConfig;
}

export interface CoreOptions {
  formats?: ImageType[] | ImageTypeAuto;
  quality?: number;
  aspectRatio?: number;
}
