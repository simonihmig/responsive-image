import type { ImageOutputResult, ImageType } from 'ember-responsive-image';
import { interpolateName } from 'loader-utils';
import * as path from 'path';
import type { LoaderContext } from 'webpack';
import type {
  ImageLoaderChainedResult,
  ImageProcessingResult,
  LoaderOptions,
} from './types';
import { getAspectRatio, getOptions, onlyUnique } from './utils';

const imageExtensions: Partial<Record<ImageType, string>> = {
  jpeg: 'jpg',
};

export default function exportLoader(
  this: LoaderContext<Partial<LoaderOptions>>,
  input: Buffer | ImageLoaderChainedResult
): string {
  if (Buffer.isBuffer(input)) {
    throw new Error(
      'You cannot run the export loader on raw data, at least the images loader is missing in your loader chain!'
    );
  }

  const options = getOptions(this);
  const { name } = options;

  const createImageFile = ({
    data,
    width,
    format,
  }: ImageProcessingResult): ImageOutputResult => {
    let fileName = name
      .replace(/\[ext\]/gi, imageExtensions[format] ?? format)
      .replace(/\[width\]/gi, width + '');
    fileName = interpolateName(this, fileName, {
      // context: outputContext,
      content: data,
      // content: data.toString(),
    });

    const outputPath = options.outputPath
      ? path.posix.join(options.outputPath, fileName)
      : fileName;

    this.emitFile(outputPath, data);

    const url = options.webPath
      ? JSON.stringify(path.posix.join(options.webPath, fileName))
      : `__webpack_public_path__ + ${JSON.stringify(outputPath)}`;

    return {
      url,
      width,
      format,
    };
  };

  const emittedImages = input.images.map(createImageFile);
  const availableWidths = input.images.map((i) => i.width).filter(onlyUnique);
  const imageTypes = input.images.map((i) => i.format).filter(onlyUnique);
  const aspectRatio = input.sharpMeta ? getAspectRatio(input.sharpMeta) : 1;

  const moduleOutput: string[] = [
    "import { findMatchingImage } from 'ember-responsive-image';",
  ];

  for (const importedModule of input.imports) {
    moduleOutput.push(`import '${importedModule}';`);
  }

  moduleOutput.push(
    `const images = [${emittedImages
      .map(
        ({ url, width, format }) =>
          `{"url":${url},"width":${String(width)},"format":"${format}"}`
      )
      .join(',')}];`
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
