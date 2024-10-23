import {
  getDestinationWidthBySize,
  type ImageData,
  type ImageType,
} from '@responsive-image/core';
import { htmlSafe } from '@ember/template';

export default function responsiveImageResolve(
  data: ImageData,
  {
    size,
    format = data.imageTypes[0],
  }: { size?: number; format?: ImageType } = {},
): ReturnType<typeof htmlSafe> | undefined {
  const url = data.imageUrlFor(getDestinationWidthBySize(size), format);

  return url ? htmlSafe(url) : undefined;
}
