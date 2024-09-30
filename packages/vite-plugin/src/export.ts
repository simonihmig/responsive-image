import type { ImageOutputResult, ImageType } from '@responsive-image/core';
import * as path from 'path';
import type { Plugin, ResolvedConfig } from 'vite';
import type { Options, ServedImageData } from './types';
import { getInput, getViteBasePath, getViteOptions } from './utils';
import {
  getAspectRatio,
  ImageProcessingResult,
  parseURL,
  onlyUnique,
} from '@responsive-image/build-utils';

const imageExtensions: Partial<Record<ImageType, string>> = {
  jpeg: 'jpg',
};

export default function exportPlugin(
  userOptions: Partial<Options> = {},
): Plugin {
  let viteConfig: ResolvedConfig;
  let basePath: string;

  const servedImages = new Map<string, ServedImageData>();

  return {
    name: 'responsive-image/export',

    api: {
      getServedImageData(url: string): ServedImageData | undefined {
        return servedImages.get(url);
      },
    },

    configResolved(config) {
      viteConfig = config;
      basePath = getViteBasePath(config);
    },

    async transform(code, id) {
      const input = getInput(this, id);

      // Bail out if our loader didn't handle this module
      if (!input) {
        return;
      }

      const url = parseURL(id);
      const options = getViteOptions(url, userOptions);

      const createImageFile = async ({
        data,
        width,
        format,
      }: ImageProcessingResult): Promise<ImageOutputResult> => {
        const fileName = options.name
          .replace(
            /\[name\]/gi,
            path.basename(url.pathname, path.extname(url.pathname)),
          )
          .replace(/\[ext\]/gi, imageExtensions[format] ?? format)
          .replace(/\[width\]/gi, width + '');

        let imageUrl: string;

        if (viteConfig.command === 'serve') {
          const moduleId = id.startsWith(viteConfig.root)
            ? id.substring(viteConfig.root.length)
            : id;

          const imagePath = `${format}/${width}${moduleId}`;

          imageUrl = `${viteConfig.server.origin ?? ''}${basePath}${imagePath}`;

          servedImages.set(imagePath, { data, format });
        } else {
          const source = await data();

          const referenceId = this.emitFile({
            type: 'asset',
            name: fileName,
            source,
          });

          imageUrl = `__VITE_ASSET__${referenceId}__`;
        }

        return {
          url: imageUrl,
          width,
          format,
        };
      };

      const emittedImages = await Promise.all(
        input.images.map(createImageFile),
      );
      const availableWidths = input.images
        .map((i) => i.width)
        .filter(onlyUnique);
      const imageTypes = input.images.map((i) => i.format).filter(onlyUnique);
      const aspectRatio =
        options.aspect ??
        (input.sharpMeta ? getAspectRatio(input.sharpMeta) : 1);

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
