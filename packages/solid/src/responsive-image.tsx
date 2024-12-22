import {
  type ImageType,
  type ImageData,
  getDestinationWidthBySize,
  env,
  isLqipBlurhash,
} from '@responsive-image/core';
import {
  Component,
  createResource,
  createSignal,
  type JSX,
  splitProps,
} from 'solid-js';
import { isServer } from 'solid-js/web';

import './responsive-image.css';

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
  const [isLoaded, setLoaded] = createSignal(false);
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
    height = Math.round(width / ar);
  }

  const src = args.src.imageUrlFor(width ?? 640);
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

  const classNames = () => {
    const classNames = [`ri-${layout}`];
    const lqip = args.src.lqip;
    if (lqip && !isLoaded()) {
      classNames.push(`ri-lqip-${lqip.type}`);
      if (lqip.type === 'color' || lqip.type === 'inline') {
        classNames.push(lqip.class);
      }
    }

    return classNames;
  };

  const blurhashMeta = isLqipBlurhash(args.src.lqip)
    ? args.src.lqip
    : undefined;
  let blurhashStyles: (() => JSX.CSSProperties | undefined) | undefined =
    undefined;

  if (!isServer && blurhashMeta) {
    const [blurhashLib] = createResource(() => {
      return import('@responsive-image/core/blurhash/decode');
    });

    blurhashStyles = () => {
      if (isLoaded()) {
        return undefined;
      }

      const { hash, width, height } = blurhashMeta;
      const uri = blurhashLib()?.decode2url(hash, width, height);

      if (!uri) {
        return undefined;
      }

      return {
        'background-image': `url("${uri}")`,
        'background-size': 'cover',
      };
    };
  }

  return (
    <picture>
      {sourcesSorted.map((s) => (
        <source srcset={s.srcset} type={s.mimeType} sizes={s.sizes} />
      ))}
      <img
        width={width}
        height={height}
        class={classNames().join(' ')}
        loading="lazy"
        decoding="async"
        src={src}
        {...attributes}
        data-ri-bh={blurhashMeta?.hash}
        data-ri-bh-w={blurhashMeta?.width}
        data-ri-bh-h={blurhashMeta?.height}
        style={blurhashStyles?.()}
        on:load={() => setLoaded(true)}
      />
    </picture>
  );
};
