import type { LoaderContext } from 'webpack';
import type { ImageLoaderChainedResult, LoaderOptions } from '../types';
import { generateLqipClassName, getOptions, normalizeInput } from '../utils';

export default function lqipColorLoader(
  this: LoaderContext<Partial<LoaderOptions>>,
  input: Buffer | ImageLoaderChainedResult,
): ImageLoaderChainedResult {
  const data = normalizeInput(input);

  const options = getOptions(this);
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
