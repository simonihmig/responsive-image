import { ImageType } from 'ember-responsive-image/types';
import type { Metadata, Sharp } from 'sharp';
import type { LoaderContext } from 'webpack';
import {
  ImageLoaderChainedResult,
  ImageProcessingResult,
  LoaderOptions,
  OutputImageType,
} from './types';
import { getOptions, normalizeInput } from './utils';

const supportedTypes: ImageType[] = ['png', 'jpeg', 'webp', 'avif'];

export default function imagesLoader(
  this: LoaderContext<Partial<LoaderOptions>>,
  input: Buffer | ImageLoaderChainedResult
): void {
  const loaderCallback = this.async();

  const options = getOptions(this);
  const data = normalizeInput(input);

  process(data, options)
    .then((result) => {
      // @ts-expect-error wrong webpack types
      loaderCallback(null, result);
    })
    .catch((err) => loaderCallback(err));
}

async function process(
  data: ImageLoaderChainedResult,
  options: LoaderOptions
): Promise<ImageLoaderChainedResult> {
  const { sharp } = data;
  const sharpMeta = await sharp.metadata();

  const formats = effectiveImageFormats(options.formats, sharpMeta);
  const { widths } = options;

  const images = await generateResizedImages(sharp, widths, formats);

  return {
    sharpMeta,
    ...data,
    images,
  };
}

// receive input as Buffer
imagesLoader.raw = true;

async function generateResizedImages(
  image: Sharp,
  widths: number[],
  formats: ImageType[]
): Promise<ImageProcessingResult[]> {
  return Promise.all(
    widths.flatMap((width) => {
      const resizedImage = image.clone();
      resizedImage.resize(width, null, { withoutEnlargement: true });

      return formats.map(async (format) => {
        const data = await resizedImage.toFormat(format).toBuffer();
        return {
          data,
          width,
          format,
        };
      });
    })
  );
}

function effectiveImageFormats(
  formats: OutputImageType[],
  meta: Metadata
): ImageType[] {
  return (
    formats
      .map((format) => {
        if (format === 'original') {
          assertSupportedType(meta.format);
          return meta.format;
        } else {
          return format;
        }
      })
      // unique values
      .filter((value, index, self) => {
        return self.indexOf(value) === index;
      })
  );
}

function assertSupportedType(type: unknown): asserts type is ImageType {
  // @ts-expect-error we want to handle wrong times at runtime
  if (!supportedTypes.includes(type)) {
    throw new Error(`Unknown image type "${type}"`);
  }
}
