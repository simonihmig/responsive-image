import {
  getDestinationWidthBySize,
  type ImageData,
  type ImageType,
} from '@ember-responsive-image/core';
import { htmlSafe } from '@ember/template';

export default function responsiveImageResolve(
  data: ImageData,
  {
    size,
    format = data.imageTypes[0],
  }: { size?: number; format?: ImageType } = {},
): ReturnType<typeof htmlSafe> | undefined {
  const width = getDestinationWidthBySize(size);

  return htmlSafe(data.imageUrlFor(width, format));
}
