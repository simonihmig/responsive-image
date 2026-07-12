import { createHash } from 'node:crypto';

const generatedClassNames = new Map<string, string>();

export function generateLqipClassName(resource: string): string {
  if (generatedClassNames.has(resource)) {
    return generatedClassNames.get(resource)!;
  } else {
    const hash = createHash('md5')
      .update(resource)
      .digest('hex')
      .substring(0, 8);
    const className = `ri-dyn-${hash}`;
    generatedClassNames.set(resource, className);

    return className;
  }
}

export function blurrySvg(src: string, width: number, height: number): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${width} ${height}">
<filter id="b" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation=".5"></feGaussianBlur><feComponentTransfer><feFuncA type="discrete" tableValues="1 1"></feFuncA></feComponentTransfer></filter>
<image filter="url(#b)" preserveAspectRatio="none" height="100%" width="100%" xlink:href="${src}"></image>
</svg>`;
}
