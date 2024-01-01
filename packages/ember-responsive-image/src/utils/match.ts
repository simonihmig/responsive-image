import type { ImageOutputResult, ImageType } from '../types.ts';

export function findMatchingImage(
  images: ImageOutputResult[],
  width: number,
  type: ImageType
): ImageOutputResult | undefined {
  const matchingImageWidth = images
    .map((i) => i.width)
    .reduce((prevValue: number, w: number) => {
      if (w >= width && prevValue >= width) {
        return w >= prevValue ? prevValue : w;
      } else {
        return w >= prevValue ? w : prevValue;
      }
    }, 0);

  return images.find(
    (image) => image.width === matchingImageWidth && image.format === type
  );
}
