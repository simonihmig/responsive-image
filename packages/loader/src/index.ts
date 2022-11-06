import type { Metadata, Sharp } from 'sharp';
import sharp from 'sharp';
import type { LoaderContext } from 'webpack';
import { interpolateName } from 'loader-utils';
import * as path from 'path';
import type {
  ImageType,
  ImageOutputResult,
} from '@ember-responsive-image/core/types';

export type OutputImageType = 'original' | ImageType;

export interface LoaderOptions {
  widths: number[];
  formats: OutputImageType[];
  quality: number;
  name: string;
  webPath?: string;
  outputPath?: string;

  // lqip?: LqipInline | LqipColor | LqipBlurhash;
}

const supportedTypes: ImageType[] = ['png', 'jpeg', 'webp', 'avif'];
const imageExtensions: Partial<Record<ImageType, string>> = {
  jpeg: 'jpg',
};

const defaultImageConfig: LoaderOptions = {
  quality: 80,
  widths: [2048, 1536, 1080, 750, 640],
  formats: ['original', 'webp'],
  name: '[name]-[width]w-[hash].[ext]',
  outputPath: 'assets/images',
};

interface ProcessedImageMeta {
  widths: number[];
  formats: ImageType[];
  aspectRatio: number;
  fingerprint?: string;
  // lqip?: LqipInline | LqipColor | LqipBlurhash;
}

interface ImageProcessingResult {
  data: Buffer;
  width: number;
  format: ImageType;
}

export default function loader(
  this: LoaderContext<Partial<LoaderOptions>>,
  imageContents: Buffer
): void {
  const loaderCallback = this.async();

  const parsedResourceQuery = parseQuery(this.resourceQuery);

  // Combines defaults, webpack options and query options,
  const options: LoaderOptions = {
    ...defaultImageConfig,
    ...this.getOptions(),
    ...parsedResourceQuery,
  };

  const { name } = options;

  //@todo validate(schema as JSONSchema7, options, { name: '@ember-responsive-image/loader' })

  const createFile = ({
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

  process(imageContents, options, createFile)
    .then((result) => loaderCallback(null, result))
    .catch((err) => loaderCallback(err));
}

async function process(
  imageContents: Buffer,
  options: LoaderOptions,
  createFile: (result: ImageProcessingResult) => ImageOutputResult
): Promise<string> {
  const image = sharp(imageContents);
  const meta = await image.metadata();

  const formats = effectiveImageFormats(options.formats, meta);
  const { widths } = options;
  const aspectRatio = getAspectRatio(meta);

  const results = await generateResizedImages(image, widths, formats);
  const images = results.map(createFile);

  const result = `import { findMatchingImage } from '@ember-responsive-image/core/utils/utils';

  const images = [${images
    .map(
      ({ url, width, format }) =>
        `{"url":${url},"width":${String(width)},"format":"${format}"}`
    )
    .join(',')}];

export default {
  imageTypes: ${JSON.stringify(formats)},
  availableWidths: ${JSON.stringify(widths)},
  aspectRatio: ${aspectRatio},
  imageUrlFor(w, f) {
    return findMatchingImage(images, w, f ?? "${formats[0]}")?.url;
  }
}`;

  return result;
}

// receive input as Buffer
loader.raw = true;

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

function getAspectRatio(meta: Metadata): number | undefined {
  if (meta.height && meta.width && meta.height > 0) {
    return Math.round((meta.width / meta.height) * 100) / 100;
  }
}

function assertSupportedType(type: unknown): asserts type is ImageType {
  // @ts-expect-error we want to handle wrong times at runtime
  if (!supportedTypes.includes(type)) {
    throw new Error(`Unknown image type "${type}"`);
  }
}

function parseQuery(query: string) {
  const params = new URLSearchParams(query);
  return Object.fromEntries(
    [...params.entries()].map(([key, value]) => {
      switch (key) {
        case 'widths':
          return [key, value.split(',').map((v) => parseInt(v, 10))];
        case 'formats':
          return [key, value.split(',')];
        case 'quality':
          return [key, parseInt(value, 10)];

        default:
          return [key, value];
      }
    })
  );
}
