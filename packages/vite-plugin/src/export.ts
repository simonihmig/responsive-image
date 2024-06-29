import * as path from 'path';
import {
  getAspectRatio,
  getInput,
  getOptions,
  onlyUnique,
  parseURL,
} from './utils';
import type { ImageOutputResult, ImageType } from '@responsive-image/core';
import type { ImageProcessingResult, Options } from './types';
import { Plugin } from 'rollup';

const imageExtensions: Partial<Record<ImageType, string>> = {
  jpeg: 'jpg',
};

export default function exportPlugin(
  userOptions: Partial<Options> = {},
): Plugin {
  return {
    name: 'responsive-image/export',
    transform(code, id) {
      const input = getInput(this, id);

      // Bail out if our loader didn't handle this module
      if (!input) {
        return;
      }

      const url = parseURL(id);
      const options = getOptions(url, userOptions);

      const createImageFile = ({
        data,
        width,
        format,
      }: ImageProcessingResult): ImageOutputResult => {
        const fileName = options.name
          .replace(
            /\[name\]/gi,
            path.basename(url.pathname, path.extname(url.pathname)),
          )
          .replace(/\[ext\]/gi, imageExtensions[format] ?? format)
          .replace(/\[width\]/gi, width + '');

        const referenceId = this.emitFile({
          type: 'asset',
          name: fileName,
          source: data,
        });

        return {
          url: `__VITE_ASSET__${referenceId}__`,
          width,
          format,
        };
      };

      const emittedImages = input.images.map(createImageFile);
      const availableWidths = input.images
        .map((i) => i.width)
        .filter(onlyUnique);
      const imageTypes = input.images.map((i) => i.format).filter(onlyUnique);
      const aspectRatio = input.sharpMeta ? getAspectRatio(input.sharpMeta) : 1;

      const moduleOutput: string[] = [
        "import { findMatchingImage } from '@responsive-image/core';",
      ];

      for (const importedModule of input.imports) {
        moduleOutput.push(`import '${importedModule}';`);
      }

      moduleOutput.push(
        `const images = [${emittedImages
          .map(
            ({ url, width, format }) =>
              `{"url":${JSON.stringify(url)},"width":${String(width)},"format":"${format}"}`,
          )
          .join(',')}];`,
      );

      moduleOutput.push(`export default {
  imageTypes: ${JSON.stringify(imageTypes)},
  availableWidths: ${JSON.stringify(availableWidths)},
  ${input.lqip ? `lqip: ` + JSON.stringify(input.lqip) + ',' : ''}
  aspectRatio: ${aspectRatio},
  imageUrlFor(w, f) {
    return findMatchingImage(images, w, f ?? "${imageTypes[0]}")?.url;
  }
}`);

      return moduleOutput.join('\n');
    },
  };
}
