import {
  LazyImageLoaderChainedResult,
  normalizeInput,
} from '@responsive-image/build-utils';

export default function loader(
  input: Buffer | LazyImageLoaderChainedResult,
): LazyImageLoaderChainedResult {
  const data = normalizeInput(input);

  return data;
}

// receive input as Buffer
loader.raw = true;
