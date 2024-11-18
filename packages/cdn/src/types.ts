import { CloudinaryConfig } from './cloudinary';
import { ImgixConfig } from './imgix';
import { NetlifyConfig } from './netlify';

export interface Config {
  imgix?: ImgixConfig;
  cloudinary?: CloudinaryConfig;
  netlify?: NetlifyConfig;
}
