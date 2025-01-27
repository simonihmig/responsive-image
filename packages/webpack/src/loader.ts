import {
  type ImageLoaderChainedResult,
  normalizeInput,
} from '@responsive-image/build-utils';

import { getWebpackOptions } from './utils';

import type { Options } from './types';
import type { LoaderContext } from 'webpack';

export default function loader(
  this: LoaderContext<Partial<Options>>,
  input: Buffer | ImageLoaderChainedResult,
): ImageLoaderChainedResult {
  const options = getWebpackOptions(this);
  const data = normalizeInput(input, { generateHash: options.cache });

  return data;
}

// receive input as Buffer
loader.raw = true;
