import sharp from 'sharp';
import { LoaderContext } from 'webpack';
import { LoaderOptions } from '../types';
import { parseQuery } from '../utils';

export default function lqipColorCssLoader(
  this: LoaderContext<Partial<LoaderOptions>>,
  input: Buffer
): void {
  const loaderCallback = this.async();

  const { className } = parseQuery(this.resourceQuery);
  if (typeof className !== 'string') {
    throw new Error('Missing className');
  }

  if (!Buffer.isBuffer(input)) {
    throw new Error('Buffer expected');
  }

  process(input, className)
    .then((result) => {
      loaderCallback(null, result);
    })
    .catch((err) => loaderCallback(err));
}

async function process(input: Buffer, className: string): Promise<string> {
  const image = sharp(input);
  const { dominant } = await image.stats();
  const colorHex =
    dominant.r.toString(16) + dominant.g.toString(16) + dominant.b.toString(16);
  const color = '#' + colorHex;

  const cssRule = `.${className} { background-color: ${color}; }`;

  return cssRule;
}

lqipColorCssLoader.raw = true;
