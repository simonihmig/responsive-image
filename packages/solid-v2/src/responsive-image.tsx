import { env, getValueOrCallback } from '@responsive-image/core';
import { isServer, type JSX } from '@solidjs/web';
import { createSignal, omit, onSettled, Show } from 'solid-js';

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

const responsiveImageArgs = [
  'class',
  'src',
  'size',
  'sizes',
  'width',
  'height',
] as const;

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
  const attributes = omit(props, ...responsiveImageArgs);

  const isLoaded = () => loadedSrc() === props.src;

  const isResponsiveLayout = () =>
    props.width === undefined && props.height === undefined;

  const width = () => {
    if (isResponsiveLayout()) {
      // With responsive layout, the width attribute does not really matter, as we scale to 100%.
      // We just need to set width and height with the correct aspect ratio to preven layout shift.
      return env.deviceWidths.at(-1);
    } else {
      if (props.width) {
        return props.width;
      } else {
        const ar = props.src.aspectRatio;
        if (ar !== undefined && ar !== 0 && props.height !== undefined) {
          return props.height * ar;
        }
      }
    }

    return undefined;
  };

  const height = () => {
    if (props.height) {
      return props.height;
    }

    const ar = props.src.aspectRatio;
    const w = width();
    if (ar !== undefined && ar !== 0 && w !== undefined) {
      return Math.round(w / ar);
    }

    return undefined;
  };

  const imgSrc = () => {
    const format = props.src.imageTypes === 'auto' ? 'auto' : undefined;
    return props.src.imageUrlFor(width() ?? 640, format);
  };

  const sources = (): ImageSource[] => {
    const imageTypes = Array.isArray(props.src.imageTypes)
      ? props.src.imageTypes
      : [props.src.imageTypes];

    if (isResponsiveLayout()) {
      return imageTypes.map((type) => {
        let widths = props.src.availableWidths;
        if (!widths) {
          widths = env.deviceWidths;
        }
        const sources: string[] = widths.map((width) => {
          const url = props.src.imageUrlFor(width, type);
          return `${url} ${width}w`;
        });

        return {
          srcset: sources.join(', '),
          sizes: props.sizes ?? (props.size ? `${props.size}vw` : undefined),
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
            const url = props.src.imageUrlFor(w * density, type)!;

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
    const lqipClass = props.src.lqip?.class;
    if (lqipClass && !isLoaded()) {
      classNames.push(getValueOrCallback(lqipClass));
    }
    if (props['class']) {
      classNames.push(props['class'] as string);
    }

    return classNames;
  };

  const styles = () => {
    if (isLoaded() || isServer) {
      return undefined;
    }

    return getValueOrCallback(props.src.lqip?.inlineStyles);
  };

  // check if src is already loaded (SSR) and update state so LQIP options are removed
  // eslint-disable-next-line no-unassigned-vars --  false positive
  let imgEl: HTMLImageElement | undefined;
  onSettled(() => {
    if (imgEl?.complete) {
      setLoaded(props.src);
    }
  });

  const img = (
    // When LQIP is used, the key is our src, so when src changes, the img element is recreated to re-apply LQIP styles without having
    // the previous src visible (<img> is a stateful element!). Without LQIP, reuse existing DOM.
    // See also https://github.com/simonihmig/responsive-image/issues/1583#issuecomment-3315142391
    <Show when={props.src} keyed={!!props.src.lqip as false}>
      <img
        width={width()}
        height={height()}
        class={classNames().join(' ')}
        loading="lazy"
        decoding="async"
        srcset={
          props.src.imageTypes === 'auto'
            ? // auto format assumes only one entry in sources
              sources()[0]?.srcset
            : undefined
        }
        src={imgSrc()}
        {...attributes}
        data-ri-lqip={props.src.lqip?.attribute}
        style={styles()}
        ref={imgEl}
        // Solid v2: on:load → onLoad (native listener for non-delegated load event)
        onLoad={() => setLoaded(props.src)}
      />
    </Show>
  );

  if (props.src.imageTypes === 'auto') {
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
