import { getDestinationWidthBySize } from './env';

import type { ImageData, ImageType } from './types';

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
  format?: ImageType;
}

export function resolveImage(
  data: ImageData,
  { width, size, format }: ResolveImageOptions = {},
): string | undefined {
  const url = data.imageUrlFor(
    width ?? getDestinationWidthBySize(size),
    format ?? data.imageTypes[0],
  );

  return url;
}
