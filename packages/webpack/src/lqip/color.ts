import {
  generateLqipClassName,
  type ImageLoaderChainedResult,
  normalizeInput,
} from '@responsive-image/build-utils';

import { getWebpackOptions } from '../utils';

import type { Options } from '../types';
import type { LoaderContext } from 'webpack';

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
  const importCSS = `import '${
    this.resourcePath
  }.css!=!@responsive-image/webpack/lqip/color-css!${
    this.resourcePath
  }?className=${encodeURIComponent(className)}';`;

  return {
    ...data,
    lqip: { class: className },
    imports: [...data.imports, importCSS],
  };
}

lqipColorLoader.raw = true;
