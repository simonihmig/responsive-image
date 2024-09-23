import { getWebpackOptions } from '../utils';
import type { LoaderContext } from 'webpack';
import type { Options } from '../types';
import {
  generateLqipClassName,
  LazyImageLoaderChainedResult,
  normalizeInput,
} from '@responsive-image/build-utils';

export default function lqipInlineLoader(
  this: LoaderContext<Partial<Options>>,
  input: Buffer | LazyImageLoaderChainedResult,
): LazyImageLoaderChainedResult {
  const data = normalizeInput(input);

  const options = getWebpackOptions(this);
  if (options.lqip?.type !== 'inline') {
    return data;
  }

  const className = generateLqipClassName(this.resource);
  const targetPixels = options.lqip.targetPixels ?? 60;
  const importCSS = `${
    this.resourcePath
  }.css!=!@responsive-image/webpack/lqip/inline-css!${
    this.resourcePath
  }?className=${encodeURIComponent(className)}&targetPixels=${targetPixels}`;

  return {
    ...data,
    lqip: { type: 'inline', class: className },
    imports: [...data.imports, importCSS],
  };
}

lqipInlineLoader.raw = true;
