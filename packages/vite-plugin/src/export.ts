import * as path from 'path';
import { Readable } from 'stream';
import {
  getAspectRatio,
  getInput,
  getOptions,
  onlyUnique,
  parseURL,
} from './utils';
import type { ImageOutputResult, ImageType } from '@responsive-image/core';
import type { ImageProcessingResult, Options } from './types';
import type { ResolvedConfig, Plugin } from 'vite';

const imageExtensions: Partial<Record<ImageType, string>> = {
  jpeg: 'jpg',
};

export default function exportPlugin(
  userOptions: Partial<Options> = {},
): Plugin {
  let viteConfig: ResolvedConfig;
  let basePath: string;

  const servedImages = new Map<string, { data: Buffer; format: ImageType }>();

  return {
    name: 'responsive-image/export',

    configResolved(config) {
      viteConfig = config;

      basePath = `${
        viteConfig.base.endsWith('/')
          ? viteConfig.base.slice(0, -1)
          : viteConfig.base
      }/@responsive-image/vite-plugin/`;
    },

    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.startsWith(basePath)) {
          let [, id] = req.url.split(basePath);
          id = decodeURI(id);

          const imageEntry = servedImages.get(id);

          if (!imageEntry) {
            throw new Error(
              `No responsive image found for ID "${id}". Known IDs: ${[...servedImages.keys()].join(', ')}`,
            );
          }

          const { data, format } = imageEntry;

          res.setHeader('Content-Type', `image/${format}`);
          return Readable.from(data).pipe(res);
        }

        next();
      });
    },

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

        let imageUrl: string;

        if (viteConfig.command === 'serve') {
          const moduleId = id.startsWith(viteConfig.root)
            ? id.substring(viteConfig.root.length)
            : id;

          const imagePath = `${format}/${width}${moduleId}`;

          imageUrl = `${viteConfig.server.origin ?? ''}${basePath}${imagePath}`;

          servedImages.set(imagePath, { data, format });
        } else {
          const referenceId = this.emitFile({
            type: 'asset',
            name: fileName,
            source: data,
          });

          imageUrl = `__VITE_ASSET__${referenceId}__`;
        }

        return {
          url: imageUrl,
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
