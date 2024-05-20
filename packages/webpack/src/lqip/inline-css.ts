import sharp, { type Metadata } from 'sharp';
import { blurrySvg, dataUri, getAspectRatio, parseQuery } from '../utils';
import type { LoaderContext } from 'webpack';

export default function lqipInlineCssLoader(
  this: LoaderContext<unknown>,
): void {
  const loaderCallback = this.async();

  process(this)
    .then((result) => {
      loaderCallback(null, result);
    })
    .catch((err) => loaderCallback(err));
}

async function process(context: LoaderContext<unknown>): Promise<string> {
  const { className, targetPixels } = parseQuery(context.resourceQuery);
  if (typeof className !== 'string') {
    throw new Error('Missing className');
  }
  if (typeof targetPixels !== 'string') {
    throw new Error('Missing targetPixels');
  }

  const file = context.resourcePath.replace(/\.css$/, '');
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

lqipInlineCssLoader.raw = true;
