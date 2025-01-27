import { parseQuery } from '@responsive-image/build-utils';
import sharp from 'sharp';

import type { Options } from '../types';
import type { LoaderContext } from 'webpack';

export default function lqipColorCssLoader(
  this: LoaderContext<Partial<Options>>,
): void {
  const loaderCallback = this.async();

  const { className } = parseQuery(this.resourceQuery);
  if (typeof className !== 'string') {
    throw new Error('Missing className');
  }

  const file = this.resourcePath.replace(/\.css$/, '');

  process(file, className)
    .then((result) => {
      loaderCallback(null, result);
    })
    .catch((err) => loaderCallback(err));
}

async function process(file: string, className: string): Promise<string> {
  const image = sharp(file);
  const { dominant } = await image.stats();
  const colorHex =
    dominant.r.toString(16).padStart(2, '0') +
    dominant.g.toString(16).padStart(2, '0') +
    dominant.b.toString(16).padStart(2, '0');
  const color = '#' + colorHex;

  const cssRule = `.${className} { background-color: ${color}; }`;

  return cssRule;
}

lqipColorCssLoader.raw = true;
