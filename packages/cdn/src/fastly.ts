import { assert, getConfig } from '@responsive-image/core';

import type { Config, CoreOptions } from './types';
import type { ImageData, ImageType } from '@responsive-image/core';

export interface FastlyConfig {
  /**
   * By default `fastly` uses the `auto` format to let
   * Fastly determine the optimal format based on
   * [content negotiation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Content_negotiation).
   *
   * Use this to set a different list of default formats.
   */
  defaultFormats?: FastlyImageFormats[];
  domain?: string;
}

type FastlyImageFormats =
  | 'avif'
  | 'bjpg'
  | 'bjpeg'
  | 'gif'
  | 'jpg'
  | 'jpeg'
  | 'jxl'
  | 'jpegxl'
  | 'mp4'
  | 'pjpg'
  | 'pjpeg'
  | 'pjxl'
  | 'pjpegxl'
  | 'png'
  | 'png8'
  | 'webp'
  | 'webpll'
  | 'webply';

export interface FastlyOptions extends Omit<CoreOptions, 'formats'> {
  /**
   * Sets the background color of the image when adding padding
   * or for transparent images.
   * @see https://www.fastly.com/documentation/reference/io/bg-color/
   */
  bgColor?: string | number;
  /**
   * Applies a Gaussian blur filter to the image.
   * @see https://www.fastly.com/documentation/reference/io/blur/
   */
  blur?: string | number;
  /**
   * Adjust the amount of perceived light an image radiates or reflects.
   * @see https://www.fastly.com/documentation/reference/io/brightness/
   */
  brightness?: number;
  /**
   * Sets the size of the image canvas, without changing the size of the image itself, which has the effect of adding space around the image.
   * @see https://www.fastly.com/documentation/reference/io/canvas/
   * @example '320,240'
   */
  canvas?: string;
  /**
   * Adjust the difference between the darkest and lightest tones in an image.
   * @see https://www.fastly.com/documentation/reference/io/contrast/
   */
  contrast?: number;
  /**
   * Removes pixels from an image.
   * @see https://www.fastly.com/documentation/reference/io/crop/
   * @example '320,240'
   * @example '16:9'
   */
  crop?: string;
  /**
   * Turn off features that are enabled by default.
   *
   * Note that `upscale` is disabled by default for Fastly IO services
   * enabled after April 2018.
   *
   * @see https://www.fastly.com/documentation/reference/io/disable/
   * @see https://www.fastly.com/documentation/reference/io/enable/
   */
  disable?: 'upscale';
  /**
   * Device pixel ratio.
   *
   * Image dimensions in pixel values get multiplied by this ratio
   * in the final result.
   *
   * Given a width of 200px and a dpr of 2, the end result is
   * an image resized to 400px (equivalent to 200 [CSS pixels](https://developer.mozilla.org/en-US/docs/Glossary/CSS_pixel)
   * given a device pixel ratio of 2).
   *
   * @see https://www.fastly.com/documentation/reference/io/dpr/
   */
  dpr?: number;
  /**
   * Turn on features that are disabled by default.
   *
   * @see https://www.fastly.com/documentation/reference/io/enable/
   * @see https://www.fastly.com/documentation/reference/io/disable/
   */
  enabled?: 'upscale';
  /**
   * Controls how the image will be constrained within the provided size
   * in order to maintain correct proportions.
   *
   * @see https://www.fastly.com/documentation/reference/io/fit/
   */
  fit?: 'bounds' | 'cover' | 'crop';
  /**
   * Specifies the desired output encoding for the image.
   *
   * @see https://www.fastly.com/documentation/reference/io/format/
   */
  formats?: FastlyImageFormats[];
  /**
   * Extracts the first frame from an animated image sequence (gif).
   *
   * @see https://www.fastly.com/documentation/reference/io/frame/
   */
  frame?: 1;
  /**
   * The desired height of the output image.
   *
   * @see https://www.fastly.com/documentation/reference/io/height/
   */
  height?: string | number;
  /**
   * When converting GIFs to MP4 and when using `profile`,
   * the level parameter specifies contraints for the decoder
   * performance of a profile.
   *
   * @see https://www.fastly.com/documentation/reference/io/level/
   */
  level?: string | number;
  /**
   * By default, Fastly IO removes all metadata from images.
   * This parameter allows you to keep certain metadata intact.
   *
   * @see https://www.fastly.com/documentation/reference/io/metadata/
   */
  metadata?: 'copyright';
  /**
   * Determine the level of compression.
   *
   * @see https://www.fastly.com/documentation/reference/io/optimize/
   */
  optimize?: 'low' | 'medium' | 'high';
  /**
   * Change the image orientation.
   *
   * @see https://www.fastly.com/documentation/reference/io/orient/
   */
  orient?: 'r' | 'l' | 'h' | 'v' | 'hv' | 'vh' | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  /**
   * Add pixels to the edge of an image.
   *
   * @see https://www.fastly.com/documentation/reference/io/pad/
   */
  pad?: string | number;
  /**
   * Identical to `crop` except `precrop` is done before any other transformations.
   *
   * @see https://www.fastly.com/documentation/reference/io/precrop/
   * @see https://www.fastly.com/documentation/reference/io/crop/
   */
  precrop?: string;
  /**
   * When converting animated GIFs to MP4 and used with `level`,
   * the `profile` parameter controls what features the video encoder
   * can use.
   *
   * @see https://www.fastly.com/documentation/reference/io/profile/
   */
  profile?: 'baseline' | 'main' | 'high';
  /**
   * Enables control over the resizing filter used when generating
   * images with a higher or lower pixel value than the original.
   *
   * @see https://www.fastly.com/documentation/reference/io/resize-filter/
   */
  resizeFilter?:
    | 'nearest'
    | 'bilinear'
    | 'linear'
    | 'bicubic'
    | 'cubic'
    | 'lanczos2'
    | 'lanczos3'
    | 'lanczos';
  /**
   * Adjust the intensity of colors in an image.
   *
   * @see https://www.fastly.com/documentation/reference/io/saturation/
   */
  saturation?: number;
  /**
   * Adjust the definition of the edges of objects in an image.
   *
   * @see https://www.fastly.com/documentation/reference/io/sharpen/
   */
  sharpen?: string;
  /**
   * Remove pixels from the edge of an image.
   *
   * @see https://www.fastly.com/documentation/reference/io/trim/
   */
  trim?: string;
  /**
   * Identify a rectangular border based on a given or detected color,
   * and remove that border from the edges of an image.
   *
   * Only works on non-GIF input images.
   *
   * @see https://www.fastly.com/documentation/reference/io/trim-color/
   */
  trimColor?: string;
}

function normalizeSrc(src: string): string {
  return src[0] === '/' ? src.slice(1) : src;
}

function kebabCase(camelCase: string): string {
  return camelCase.replace(
    /[A-Z]/g,
    (upperCaseChar) => '-' + upperCaseChar.toLowerCase(),
  );
}

export function fastly(image: string, options: FastlyOptions = {}): ImageData {
  const config = getConfig<Config>('cdn')?.fastly || {};
  const domain = config.domain;
  assert(
    'domain must be set for the fastly provider!',
    typeof domain === 'string',
  );

  // avif is a paid addon, so omitted by default (compared to other CDNs)
  const defaultFormats = config.defaultFormats ?? ['webp'];

  const imageData: ImageData = {
    // The components handle more formats than ImageType,
    // though with a priority of 0
    imageTypes: (options.formats ?? defaultFormats) as ImageType[],
    imageUrlFor(width: number, type: ImageType = 'jpeg') {
      const url = new URL(`https://${domain}/${normalizeSrc(image)}`);
      const searchParams = url.searchParams;

      searchParams.set('format', type);
      searchParams.set('width', String(width));

      for (const [key, value] of Object.entries(options)) {
        if (key === 'aspectRatio') {
          continue;
        }
        searchParams.set(kebabCase(key), value);
      }

      return url.toString();
    },
  };

  if (options.aspectRatio) {
    imageData.aspectRatio = options.aspectRatio;
  }

  return imageData;
}
