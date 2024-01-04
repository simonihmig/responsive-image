import type { LoaderContext } from 'webpack';
import type { ImageLoaderChainedResult, LoaderOptions } from '../types';
import { generateLqipClassName, getOptions, normalizeInput } from '../utils';

export default function lqipInlineLoader(
  this: LoaderContext<Partial<LoaderOptions>>,
  input: Buffer | ImageLoaderChainedResult,
): ImageLoaderChainedResult {
  const data = normalizeInput(input);

  const options = getOptions(this);
  if (options.lqip?.type !== 'inline') {
    return data;
  }

  const className = generateLqipClassName(this.resource);
  const targetPixels = options.lqip.targetPixels ?? 60;
  const importCSS = `${
    this.resourcePath
  }.css!=!@ember-responsive-image/webpack/lqip/inline-css!${
    this.resourcePath
  }?className=${encodeURIComponent(className)}&targetPixels=${targetPixels}`;

  return {
    ...data,
    lqip: { type: 'inline', class: className },
    imports: [...data.imports, importCSS],
  };
}

lqipInlineLoader.raw = true;
