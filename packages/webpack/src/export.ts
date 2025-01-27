import * as path from 'path';

import { getAspectRatio, onlyUnique } from '@responsive-image/build-utils';
import { interpolateName } from 'loader-utils';

import { assertInput, getWebpackOptions } from './utils';

import type { Options } from './types';
import type {
  ImageLoaderChainedResult,
  ImageProcessingResult,
} from '@responsive-image/build-utils';
import type { ImageOutputResult, ImageType } from '@responsive-image/core';
import type { LoaderContext } from 'webpack';

const imageExtensions: Partial<Record<ImageType, string>> = {
  jpeg: 'jpg',
};

export default function exportLoader(
  this: LoaderContext<Partial<Options>>,
  input: ImageLoaderChainedResult,
): void {
  assertInput(input);

  const loaderCallback = this.async();

  const options = getWebpackOptions(this);

  process(input, options, this)
    .then((result) => {
      loaderCallback(null, result);
    })
    .catch((err) => loaderCallback(err));
}

async function process(
  input: ImageLoaderChainedResult,
  options: Options,
  context: LoaderContext<Partial<Options>>,
): Promise<string> {
  const { name, aspect } = options;

  const createImageFile = async ({
    data,
    width,
    format,
  }: ImageProcessingResult): Promise<ImageOutputResult> => {
    let fileName = name
      .replace(/\[ext\]/gi, imageExtensions[format] ?? format)
      .replace(/\[width\]/gi, width + '');

    const content = await data();

    fileName = interpolateName(context, fileName, {
      content,
    });

    const outputPath = options.outputPath
      ? path.posix.join(options.outputPath, fileName)
      : fileName;

    context.emitFile(outputPath, content);

    const url = options.webPath
      ? JSON.stringify(path.posix.join(options.webPath, fileName))
      : `__webpack_public_path__ + ${JSON.stringify(outputPath)}`;

    return {
      url,
      width,
      format,
    };
  };

  const emittedImages = await Promise.all(input.images.map(createImageFile));
  const availableWidths = input.images.map((i) => i.width).filter(onlyUnique);
  const imageTypes = input.images.map((i) => i.format).filter(onlyUnique);
  const aspectRatio =
    aspect ?? (input.sharpMeta ? getAspectRatio(input.sharpMeta) : 1);

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
          `{"url":${url},"width":${String(width)},"format":"${format}"}`,
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
}
