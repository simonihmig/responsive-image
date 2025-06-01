import { parseQuery } from '@responsive-image/build-utils';
import sharp from 'sharp';

import type { Options } from '../types';
import type { LoaderContext } from 'webpack';

export default function lqipColorCssLoader(
  this: LoaderContext<Partial<Options>>,
): void {
  const loaderCallback = this.async();

  const { className, inline } = parseQuery(this.resourceQuery);
  if (typeof className !== 'string') {
    throw new Error('Missing className');
  }

  const file = this.resourcePath.replace(/\.css$/, '');

  process(file, className, !!inline)
    .then((result) => {
      loaderCallback(null, result);
    })
    .catch((err) => loaderCallback(err));
}

async function process(
  file: string,
  className: string,
  inline: boolean,
): Promise<string> {
  const image = sharp(file);
  const { dominant } = await image.stats();
  const colorHex =
    dominant.r.toString(16).padStart(2, '0') +
    dominant.g.toString(16).padStart(2, '0') +
    dominant.b.toString(16).padStart(2, '0');
  const color = '#' + colorHex;

  return inline
    ? `export default ${JSON.stringify({ 'background-color': color })}`
    : `.${className} { background-color: ${color}; }`;
}

lqipColorCssLoader.raw = true;
