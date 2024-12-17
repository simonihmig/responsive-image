import {
  type ImageType,
  type ImageData,
  getDestinationWidthBySize,
  env,
} from '@responsive-image/core';
import { Component, type JSX, splitProps } from 'solid-js';
import { isServer } from 'solid-js/web';

export interface ResponsiveImageArgs {
  src: ImageData;
  size?: number;
  sizes?: string;
  width?: number;
  height?: number;
}

const responsiveImageArgs: Array<keyof ResponsiveImageArgs> = [
  'src',
  'size',
  'sizes',
  'width',
  'height',
];

export type ResponsiveImageProps = Omit<
  JSX.ImgHTMLAttributes<HTMLImageElement>,
  'src'
> &
  ResponsiveImageArgs;

interface ImageSource {
  srcset: string;
  type: ImageType;
  mimeType: string;
  sizes?: string | undefined;
}

enum Layout {
  RESPONSIVE = 'responsive',
  FIXED = 'fixed',
}

const PIXEL_DENSITIES = [1, 2];

// determines the order of sources, prefereing next-gen formats over legacy
const typeScore = new Map<ImageType, number>([
  ['png', 1],
  ['jpeg', 1],
  ['webp', 2],
  ['avif', 3],
]);

export const ResponsiveImage: Component<ResponsiveImageProps> = (props) => {
  // TODO this needs to be a signal
  const isLoaded = false;

  // TODO effect
  const isRendered = true;

  const [args, attributes] = splitProps(props, responsiveImageArgs);

  const layout =
    args.width === undefined && args.height === undefined
      ? Layout.RESPONSIVE
      : Layout.FIXED;

  let width: number | undefined = undefined;

  if (layout === Layout.RESPONSIVE) {
    width = getDestinationWidthBySize(args.size);
  } else {
    if (args.width) {
      width = args.width;
    } else {
      const ar = args.src.aspectRatio;
      if (ar !== undefined && ar !== 0 && args.height !== undefined) {
        width = args.height * ar;
      }
    }
  }

  let height: number | undefined = undefined;

  if (args.height) {
    height = args.height;
  }

  const ar = args.src.aspectRatio;
  if (ar !== undefined && ar !== 0 && width !== undefined) {
    height = width / ar;
  }

  // We *must not* set the src attribute before the <img> is actually rendered, and a child of <picture>
  // Otherwise some browsers (FF, Safari) will eagerly load it, although the image isn't the one the browser
  // should load given the other source/srcset variants. Also prevents native lazy loading.
  const src =
    isRendered || isServer ? args.src.imageUrlFor(width ?? 640) : undefined;

  let sources: ImageSource[];

  if (layout === Layout.RESPONSIVE) {
    sources = args.src.imageTypes.map((type) => {
      let widths = args.src.availableWidths;
      if (!widths) {
        widths = env.deviceWidths;
      }
      const sources: string[] = widths.map((width) => {
        const url = args.src.imageUrlFor(width, type);
        return `${url} ${width}w`;
      });

      return {
        srcset: sources.join(', '),
        sizes: args.sizes ?? (args.size ? `${args.size}vw` : undefined),
        type,
        mimeType: `image/${type}`,
      };
    });
  } else {
    if (width === undefined) {
      sources = [];
    } else {
      sources = args.src.imageTypes.map((type) => {
        const sources: string[] = PIXEL_DENSITIES.map((density) => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const url = args.src.imageUrlFor(width * density, type)!;

          return `${url} ${density}x`;
        }).filter((source) => source !== undefined);

        return {
          srcset: sources.join(', '),
          type,
          mimeType: `image/${type}`,
        };
      });
    }
  }

  const sourcesSorted = sources.sort(
    (a, b) => (typeScore.get(b.type) ?? 0) - (typeScore.get(a.type) ?? 0),
  );

  const classNames = [`ri-${layout}`];
  const lqip = args.src.lqip;
  if (lqip && !isLoaded) {
    classNames.push(`ri-lqip-${lqip.type}`);
    if (lqip.type === 'color' || lqip.type === 'inline') {
      classNames.push(lqip.class);
    }
  }

  return (
    <picture>
      {sourcesSorted.map((s) => (
        <source srcset={s.srcset} type={s.mimeType} sizes={s.sizes} />
      ))}
      <img
        src={src}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        class={classNames.join(' ')}
        {...attributes}
      />
    </picture>
  );
};
