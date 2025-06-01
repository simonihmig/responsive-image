import {
  generateLqipClassName,
  type ImageLoaderChainedResult,
  normalizeInput,
  safeString,
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
  const pathname = this.resourcePath;
  let importCSS: string;

  switch (options.styles) {
    case 'external':
      importCSS = `import '${
        pathname
      }.css!=!@responsive-image/webpack/lqip/inline-css!${
        pathname
      }?className=${encodeURIComponent(className)}&targetPixels=${targetPixels}';`;
      break;
    case 'inline':
      importCSS = `import inlineStyles from '@responsive-image/webpack/lqip/inline-css!${
        pathname
      }?&targetPixels=${targetPixels}&inline=1';`;
      break;
    default:
      throw new Error(`Unknown styles option: ${options.styles}`);
  }

  return {
    ...data,
    lqip:
      options.styles === 'inline'
        ? {
            inlineStyles: safeString('inlineStyles'),
          }
        : {
            class: className,
          },
    imports: [...data.imports, importCSS],
  };
}

lqipInlineLoader.raw = true;
