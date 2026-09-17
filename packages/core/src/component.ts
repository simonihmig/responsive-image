import { env } from './env.ts';
import { getValueOrCallback } from './utils.ts';

import type { ImageData, ImageType, ImageUrlForType } from './types.ts';

export type ResponsiveImageLayout = 'responsive' | 'fixed';

export interface ResponsiveImageArgs {
  src: ImageData;
  /**
   * Number of vw units to use for responsive layout.
   */
  size?: number | undefined;
  /**
   * The [sizes attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#sizes) for `img`.
   */
  sizes?: string | undefined;
  /**
   * The [width attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#width) for `img`.
   */
  width?: number | undefined;
  /**
   * The [height attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#height) for `img`.
   */
  height?: number | undefined;
}

export interface ImageSource {
  srcset: string;
  type: ImageUrlForType;
  mimeType: string | undefined;
  sizes?: string | undefined;
}

export const PIXEL_DENSITIES = [1, 2];

// determines the order of sources, preferring next-gen formats over legacy
export const IMAGE_TYPE_SCORE: ReadonlyMap<ImageUrlForType, number> = new Map([
  ['png', 1],
  ['jpeg', 1],
  ['webp', 2],
  ['avif', 3],
]);

export function getMimeType(type: ImageUrlForType): string | undefined {
  return type === 'auto' ? undefined : `image/${type}`;
}

export function getImageTypes(
  imageTypes: ImageType[] | ImageUrlForType,
): ImageUrlForType[] {
  return Array.isArray(imageTypes) ? imageTypes : [imageTypes];
}

export function getLayout(args: ResponsiveImageArgs): ResponsiveImageLayout {
  return args.width === undefined && args.height === undefined
    ? 'responsive'
    : 'fixed';
}

export function getWidth(args: ResponsiveImageArgs): number | undefined {
  if (getLayout(args) === 'responsive') {
    // With responsive layout, the width attribute does not really matter, as we scale to 100%.
    // We just need to set width and height with the correct aspect ratio to prevent layout shift.
    return env.deviceWidths.at(-1);
  }

  if (args.width !== undefined) {
    return args.width;
  }

  const aspectRatio = args.src.aspectRatio;
  if (
    aspectRatio !== undefined &&
    aspectRatio !== 0 &&
    args.height !== undefined
  ) {
    return args.height * aspectRatio;
  }

  return undefined;
}

export function getHeight(args: ResponsiveImageArgs): number | undefined {
  if (args.height !== undefined) {
    return args.height;
  }

  const width = getWidth(args);
  const aspectRatio = args.src.aspectRatio;
  if (aspectRatio !== undefined && aspectRatio !== 0 && width !== undefined) {
    return Math.round(width / aspectRatio);
  }

  return undefined;
}

export function getSrc(args: ResponsiveImageArgs): string | undefined {
  const format = args.src.imageTypes === 'auto' ? 'auto' : undefined;
  return args.src.imageUrlFor(getWidth(args) ?? 640, format);
}

export function getSources(args: ResponsiveImageArgs): ImageSource[] {
  const imageTypes = getImageTypes(args.src.imageTypes);

  if (getLayout(args) === 'responsive') {
    const widths = args.src.availableWidths ?? env.deviceWidths;
    return imageTypes.map((type) => ({
      srcset: widths
        .map((width) => `${args.src.imageUrlFor(width, type)} ${width}w`)
        .join(', '),
      sizes: args.sizes ?? (args.size ? `${args.size}vw` : undefined),
      type,
      mimeType: getMimeType(type),
    }));
  }

  const width = getWidth(args);
  if (width === undefined) {
    return [];
  }

  return imageTypes.map((type) => ({
    srcset: PIXEL_DENSITIES.map((density) => {
      const url = args.src.imageUrlFor(width * density, type);
      return url === undefined ? undefined : `${url} ${density}x`;
    })
      .filter((source): source is string => source !== undefined)
      .join(', '),
    type,
    mimeType: getMimeType(type),
  }));
}

export function getSourcesSorted(sources: ImageSource[]): ImageSource[] {
  return [...sources].sort(
    (a, b) =>
      (IMAGE_TYPE_SCORE.get(b.type) ?? 0) - (IMAGE_TYPE_SCORE.get(a.type) ?? 0),
  );
}

export function getClassNames(
  args: ResponsiveImageArgs,
  isLoaded: boolean,
  className?: string,
): string {
  const classNames = ['ri-img', `ri-${getLayout(args)}`];
  const lqipClass = args.src.lqip?.class;
  if (lqipClass && !isLoaded) {
    classNames.push(getValueOrCallback(lqipClass));
  }
  if (className) {
    classNames.push(className);
  }
  return classNames.join(' ');
}

export function getStyles(
  args: ResponsiveImageArgs,
  isLoaded: boolean,
): Record<string, string | undefined> | undefined {
  if (isLoaded) {
    return undefined;
  }

  return getValueOrCallback(args.src.lqip?.inlineStyles);
}

export function createLqipKey(): (src: ImageData) => number | undefined {
  let keyCounter = 0;
  const keyMap = new WeakMap<ImageData, number>();

  return (src: ImageData): number | undefined => {
    if (!src.lqip) {
      return undefined;
    }

    let key = keyMap.get(src);
    if (key === undefined) {
      key = keyCounter++;
      keyMap.set(src, key);
    }
    return key;
  };
}
