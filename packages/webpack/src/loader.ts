import {
  ImageLoaderChainedResult,
  normalizeInput,
} from '@responsive-image/build-utils';

export default function loader(
  input: Buffer | ImageLoaderChainedResult,
): ImageLoaderChainedResult {
  const data = normalizeInput(input);

  return data;
}

// receive input as Buffer
loader.raw = true;
