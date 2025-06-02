import { getDestinationWidthBySize } from './env';

import type { ImageData, ImageUrlForType } from './types';

export interface ResolveImageOptions {
  /**
   * width in pixel to request the best matching image for
   */
  width?: number;

  /**
   * size in vw (0 - 100) to request the best matching image for
   */
  size?: number;

  /**
   * preferred image format
   */
  format?: ImageUrlForType;
}

export function resolveImage(
  data: ImageData,
  { width, size, format }: ResolveImageOptions = {},
): string | undefined {
  const imageType =
    format ??
    (Array.isArray(data.imageTypes) ? data.imageTypes[0] : data.imageTypes);

  const url = data.imageUrlFor(
    width ?? getDestinationWidthBySize(size),
    imageType,
  );

  return url;
}
