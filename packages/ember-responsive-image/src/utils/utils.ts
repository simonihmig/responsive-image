import Application, { getOwner } from '@ember/application';
import { assert } from '@ember/debug';
import { ImageOutputResult, ImageType, Meta } from '../types';

export function normalizeSrc(src: string): string {
  return src[0] === '/' ? src.slice(1) : src;
}

const SCRIPT_ID = 'ember_responsive_image_meta';

export function extractMeta(context: unknown): Meta {
  let script = document.getElementById(SCRIPT_ID);
  if (!script) {
    // in case the app runs in shadow DOM, we need to query the script from the shadow root
    const rootElement = (getOwner(context) as Application).rootElement;
    if (rootElement instanceof HTMLElement) {
      script = (rootElement.getRootNode() as HTMLElement).querySelector(
        `[id="${SCRIPT_ID}"]`
      );
    }
  }
  assert(
    'No script tag found containing meta data for ember-responsive-image',
    script && script.textContent // Cannot use optional chaining due to https://github.com/ember-cli/babel-plugin-debug-macros/issues/89
  );
  return JSON.parse(script.textContent);
}

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
