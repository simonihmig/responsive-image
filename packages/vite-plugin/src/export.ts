import * as path from 'path';

import {
  getAspectRatio,
  parseURL,
  onlyUnique,
  safeString,
  serialize,
} from '@responsive-image/build-utils';

import { getInput, getViteBasePath, getViteOptions } from './utils';

import type { Options, ServedImageData } from './types';
import type { ImageProcessingResult } from '@responsive-image/build-utils';
import type { ImageOutputResult, ImageType } from '@responsive-image/core';
import type { Plugin, ResolvedConfig } from 'vite';

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
          // Vite bug: __VITE_ASSET__ only works when surrounded by double quotes, single quote compile to something like this:
          // url: '"+new URL('../assets/aurora-640w.Da-U-QmX.jpg', import.meta.url).href+"'
          url: safeString(JSON.stringify(imageUrl)),
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

      moduleOutput.push(...input.imports);

      moduleOutput.push(
        `const images = [${emittedImages.map(serialize).join(',')}];`,
      );

      const result = {
        imageTypes,
        availableWidths,
        aspectRatio,
        imageUrlFor: safeString(
          `(w, f) => findMatchingImage(images, w, f ?? '${imageTypes[0]}')?.url`,
        ),

        lqip: input.lqip,
      };

      moduleOutput.push(`export default ${serialize(result)}`);

      return moduleOutput.join('\n');
    },
  };
}
