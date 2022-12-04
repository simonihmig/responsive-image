import { LoaderContext } from 'webpack';
import { ImageLoaderChainedResult, LoaderOptions } from '../types';
import { getOptions, normalizeInput } from '../utils';

export default function lqipColorLoader(
  this: LoaderContext<Partial<LoaderOptions>>,
  input: Buffer | ImageLoaderChainedResult
): ImageLoaderChainedResult {
  const data = normalizeInput(input);

  const options = getOptions(this);
  if (options.lqip?.type !== 'color') {
    return data;
  }

  const className = 'eri-color-foo'; // @todo
  const importCSS = `${
    this.resourcePath
  }.css!=!@ember-responsive-image/loader/lqip/color-css!${
    this.resourcePath
  }?className=${encodeURIComponent(className)}`;

  return {
    ...data,
    lqip: { type: 'color', class: className },
    imports: [...data.imports, importCSS],
  };
}

lqipColorLoader.raw = true;
