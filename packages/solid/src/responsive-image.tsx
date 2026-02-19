import {
  env,
  getDestinationWidthBySize,
  getValueOrCallback,
} from '@responsive-image/core';
import { createSignal, type JSX, onMount, Show, splitProps } from 'solid-js';
import { isServer } from 'solid-js/web';

import './responsive-image.css';

import type { ImageData, ImageUrlForType } from '@responsive-image/core';
import type { Component } from 'solid-js';

export interface ResponsiveImageArgs {
  src: ImageData;
  size?: number;
  sizes?: string;
  width?: number;
  height?: number;
}

const responsiveImageArgs: Array<keyof ResponsiveImageArgs | 'class'> = [
  'class',
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
  type: ImageUrlForType;
  mimeType: string | undefined;
  sizes?: string | undefined;
}

const PIXEL_DENSITIES = [1, 2];

// determines the order of sources, prefereing next-gen formats over legacy
const typeScore = new Map<ImageUrlForType, number>([
  ['png', 1],
  ['jpeg', 1],
  ['webp', 2],
  ['avif', 3],
]);

export const ResponsiveImage: Component<ResponsiveImageProps> = (props) => {
  const [loadedSrc, setLoaded] = createSignal<ImageData | undefined>(undefined);
  const [args, attributes] = splitProps(props, responsiveImageArgs);
  const isLoaded = () => loadedSrc() === args.src;

  const isResponsiveLayout = () =>
    args.width === undefined && args.height === undefined;

  const width = () => {
    if (isResponsiveLayout()) {
      return getDestinationWidthBySize(args.size);
    } else {
      if (args.width) {
        return args.width;
      } else {
        const ar = args.src.aspectRatio;
        if (ar !== undefined && ar !== 0 && args.height !== undefined) {
          return args.height * ar;
        }
      }
    }

    return undefined;
  };

  const height = () => {
    if (args.height) {
      return args.height;
    }

    const ar = args.src.aspectRatio;
    const w = width();
    if (ar !== undefined && ar !== 0 && w !== undefined) {
      return Math.round(w / ar);
    }

    return undefined;
  };

  const src = () => {
    const format = args.src.imageTypes === 'auto' ? 'auto' : undefined;
    return args.src.imageUrlFor(width() ?? 640, format);
  };

  const sources = (): ImageSource[] => {
    const imageTypes = Array.isArray(args.src.imageTypes)
      ? args.src.imageTypes
      : [args.src.imageTypes];

    if (isResponsiveLayout()) {
      return imageTypes.map((type) => {
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
          mimeType: type != 'auto' ? `image/${type}` : undefined,
        };
      });
    } else {
      const w = width();
      if (w === undefined) {
        return [];
      } else {
        return imageTypes.map((type) => {
          const sources: string[] = PIXEL_DENSITIES.map((density) => {
            const url = args.src.imageUrlFor(w * density, type)!;

            return `${url} ${density}x`;
          }).filter((source) => source !== undefined);

          return {
            srcset: sources.join(', '),
            type,
            mimeType: type != 'auto' ? `image/${type}` : undefined,
          };
        });
      }
    }
  };

  const sourcesSorted = () =>
    sources().sort(
      (a, b) => (typeScore.get(b.type) ?? 0) - (typeScore.get(a.type) ?? 0),
    );

  const classNames = () => {
    const classNames = [
      'ri-img',
      `ri-${isResponsiveLayout() ? 'responsive' : 'fixed'}`,
    ];
    const lqipClass = args.src.lqip?.class;
    if (lqipClass && !isLoaded()) {
      classNames.push(getValueOrCallback(lqipClass));
    }
    if (args.class) {
      classNames.push(args.class);
    }

    return classNames;
  };

  const styles = () => {
    if (isLoaded() || isServer) {
      return undefined;
    }

    return getValueOrCallback(args.src.lqip?.inlineStyles);
  };

  // check if src is already loaded (SSR) and update state so LQIP options are removed
  // eslint-disable-next-line no-unassigned-vars --  false positive
  let imgEl: HTMLImageElement | undefined;
  onMount(() => {
    if (imgEl?.complete) {
      setLoaded(args.src);
    }
  });

  const img = (
    // When LQIP is used, the key is our src, so when src changes, the img element is recreated to re-apply LQIP styles without having
    // the previous src visible (<img> is a stateful element!). Without LQIP, reuse existing DOM.
    // See also https://github.com/simonihmig/responsive-image/issues/1583#issuecomment-3315142391
    <Show when={args.src} keyed={!!args.src.lqip as false}>
      <img
        width={width()}
        height={height()}
        class={classNames().join(' ')}
        loading="lazy"
        decoding="async"
        srcSet={
          args.src.imageTypes === 'auto'
            ? // auto format assumes only one entry in sources
              sources()[0]?.srcset
            : undefined
        }
        src={src()}
        {...attributes}
        data-ri-lqip={args.src.lqip?.attribute}
        style={styles()}
        ref={imgEl}
        on:load={() => setLoaded(args.src)}
      />
    </Show>
  );

  if (args.src.imageTypes === 'auto') {
    return img;
  }

  return (
    <picture>
      {sourcesSorted().map((s) => (
        <source srcset={s.srcset} type={s.mimeType} sizes={s.sizes} />
      ))}
      {img}
    </picture>
  );
};
