import sharp, { Metadata } from 'sharp';
import type { Plugin } from 'vite';
import type { Options } from '../types';
import {
  blurrySvg,
  dataUri,
  getAspectRatio,
  getPathname,
  parseQuery,
  parseURL,
} from '../utils';

export const name = 'responsive-image/lqip/inline-css';

export default function lqipInlineCssPlugin(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  userOptions: Partial<Options> = {},
): Plugin {
  return {
    name,
    resolveId(source) {
      const { _plugin } = parseQuery(parseURL(source).searchParams);

      if (_plugin !== name) {
        return null;
      }

      // return the same module id to make vite think this file exists and is a .css file
      // we will load the actually existing file without .css in the load hook
      return source;
    },
    async load(id) {
      const { className, targetPixels, _plugin } = parseQuery(
        parseURL(id).searchParams,
      );

      if (_plugin !== name) {
        return;
      }

      if (typeof className !== 'string') {
        throw new Error('Missing className');
      }

      if (typeof targetPixels !== 'string') {
        throw new Error('Missing targetPixels');
      }

      const file = getPathname(id).replace(/\.css$/, '');
      const image = sharp(file);
      const meta = await image.metadata();

      if (meta.width === undefined || meta.height === undefined) {
        throw new Error('Missing image meta data');
      }

      const { width, height } = await getLqipDimensions(
        parseInt(targetPixels, 10),
        meta,
      );

      const lqi = await image
        .resize(width, height, {
          withoutEnlargement: true,
          fit: 'fill',
        })
        .png();

      const uri = dataUri(
        blurrySvg(
          dataUri(await lqi.toBuffer(), 'image/png'),
          meta.width,
          meta.height,
        ),
        'image/svg+xml',
      );

      return `.${className} { background-image: url(${uri}); }`;
    },
  };
}

async function getLqipDimensions(
  targetPixels: number,
  meta: Metadata,
): Promise<{ width: number; height: number }> {
  const aspectRatio = getAspectRatio(meta) ?? 1;

  // taken from https://github.com/google/eleventy-high-performance-blog/blob/5ed39db7fd3f21ae82ac1a8e833bf283355bd3d0/_11ty/blurry-placeholder.js#L74-L92
  let bitmapHeight = targetPixels / aspectRatio;
  bitmapHeight = Math.sqrt(bitmapHeight);
  const bitmapWidth = targetPixels / bitmapHeight;
  return { width: Math.round(bitmapWidth), height: Math.round(bitmapHeight) };
}