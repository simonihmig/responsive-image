import { getWebpackOptions } from '../utils';
import type { LoaderContext } from 'webpack';
import type { Options } from '../types';
import {
  generateLqipClassName,
  ImageLoaderChainedResult,
  normalizeInput,
} from '@responsive-image/build-utils';

export default function lqipColorLoader(
  this: LoaderContext<Partial<Options>>,
  input: Buffer | ImageLoaderChainedResult,
): ImageLoaderChainedResult {
  const data = normalizeInput(input);

  const options = getWebpackOptions(this);
  if (options.lqip?.type !== 'color') {
    return data;
  }

  const className = generateLqipClassName(this.resource);
  const importCSS = `${
    this.resourcePath
  }.css!=!@responsive-image/webpack/lqip/color-css!${
    this.resourcePath
  }?className=${encodeURIComponent(className)}`;

  return {
    ...data,
    lqip: { type: 'color', class: className },
    imports: [...data.imports, importCSS],
  };
}

lqipColorLoader.raw = true;
