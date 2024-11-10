import { CloudinaryConfig } from './cloudinary';
import { ImgixConfig } from './imgix';

export interface Config {
  imgix?: ImgixConfig;
  cloudinary?: CloudinaryConfig;
}
