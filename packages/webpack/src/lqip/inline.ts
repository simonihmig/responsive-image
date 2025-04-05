import {
  generateLqipClassName,
  type ImageLoaderChainedResult,
  normalizeInput,
} from '@responsive-image/build-utils';

import { getWebpackOptions } from '../utils';

import type { Options } from '../types';
import type { LoaderContext } from 'webpack';

export default function lqipInlineLoader(
  this: LoaderContext<Partial<Options>>,
  input: Buffer | ImageLoaderChainedResult,
): ImageLoaderChainedResult {
  const data = normalizeInput(input);

  const options = getWebpackOptions(this);
  if (options.lqip?.type !== 'inline') {
    return data;
  }

  const className = generateLqipClassName(this.resource);
  const targetPixels = options.lqip.targetPixels ?? 60;
  const importCSS = `import '${
    this.resourcePath
  }.css!=!@responsive-image/webpack/lqip/inline-css!${
    this.resourcePath
  }?className=${encodeURIComponent(className)}&targetPixels=${targetPixels}';`;

  return {
    ...data,
    lqip: { type: 'inline', class: className },
    imports: [...data.imports, importCSS],
  };
}

lqipInlineLoader.raw = true;
