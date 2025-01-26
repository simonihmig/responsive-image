import type { ImageType } from '@responsive-image/core';
import type { CloudinaryConfig } from './cloudinary';
import type { ImgixConfig } from './imgix';
import type { NetlifyConfig } from './netlify';

export interface Config {
  imgix?: ImgixConfig;
  cloudinary?: CloudinaryConfig;
  netlify?: NetlifyConfig;
}

export interface CoreOptions {
  formats?: ImageType[];
  quality?: number;
  aspectRatio?: number;
}
