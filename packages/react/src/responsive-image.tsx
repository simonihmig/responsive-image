import {
  env,
  getDestinationWidthBySize,
  type ImageData,
} from '@responsive-image/core';
import React from 'react';

export interface ResponsiveImageProps {
  src: ImageData;
  /**
   * The [alt attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#alt) for `img`.
   */
  alt?: string;
  /**
   * The [sizes attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#sizes) for `img`.
   */
  sizes?: string;
  /**
   * The [height attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#height) for `img`.
   */
  height?: number;
  /**
   * The [width attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#width) for `img`.
   */
  width?: number;
  /**
   * Number of vw units to use for responsive layout.
   */
  size?: number;
  /**
   * The [loading attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#loading) for `img`.
   */
  loading?: 'eager' | 'lazy';
  /**
   * The [decoding attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#decoding) for `img`.
   */
  decoding?: 'async' | 'sync' | 'auto';
  /**
   * The [fetchpriority attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#fetchpriority) for `img`.
   */
  fetchpriority?: 'high' | 'low' | 'auto';
  /**
   * The [crossorigin attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#crossorigin) for `img`.
   */
  crossorigin?: 'anonymous' | 'use-credentials';
  /**
   * The [referrerpolicy attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#referrerpolicy) for `img`.
   */
  referrerpolicy?:
    | 'no-referrer'
    | 'no-referrer-when-downgrade'
    | 'origin'
    | 'origin-when-cross-origin'
    | 'same-origin'
    | 'strict-origin'
    | 'strict-origin-when-cross-origin'
    | 'unsafe-url';
  className?: string;
  style?: string;
}

const typeScore = new Map<string, number>([
  ['png', 1],
  ['jpeg', 1],
  ['webp', 2],
  ['avif', 3],
]);

const pixelDensities = [1, 2];

type ResponsiveImageLayout = 'responsive' | 'fixed';

function getLayout(props: ResponsiveImageProps): ResponsiveImageLayout {
  /** @type {ResponsiveImageLayout} */
  const layout =
    props.width === undefined && props.height === undefined
      ? 'responsive'
      : 'fixed';
  return layout;
}

function getSources(props: ResponsiveImageProps) {
  const layout = getLayout(props);
  if (layout === 'responsive') {
    return props.src.imageTypes.map((type) => {
      let widths = props.src.availableWidths;
      if (!widths) {
        widths = env.deviceWidths;
      }
      const sources = widths.map((width) => {
        const url = props.src.imageUrlFor(width, type);
        return `${url} ${width}w`;
      });

      return {
        srcset: sources.join(', '),
        sizes: props.sizes ?? (props.size ? `${props.size}vw` : undefined),
        type,
        mimeType: `image/${type}`,
      };
    });
  }

  const { width } = props;
  if (width === undefined) {
    return [];
  }

  return props.src.imageTypes.map((type) => {
    const sources = pixelDensities
      .map((density) => {
        const url = props.src.imageUrlFor(width * density, type);
        return `${url} ${density}x`;
      })
      .filter((source) => source !== undefined);

    return {
      srcset: sources.join(', '),
      type,
      mimeType: `image/${type}`,
    };
  });
}

function getWidth(props: ResponsiveImageProps) {
  const layout = getLayout(props);
  if (layout === 'responsive') {
    return getDestinationWidthBySize(props.size);
  }
  if (props.width !== undefined) {
    return props.width;
  }

  const aspectRatio = props.src.aspectRatio;
  if (aspectRatio && props.height !== undefined) {
    return props.height * aspectRatio;
  }

  return undefined;
}

function getHeight(props: ResponsiveImageProps) {
  if (props.height !== undefined) {
    return props.height;
  }

  const width = getWidth(props);
  const aspectRatio = props.src.aspectRatio;
  if (aspectRatio && width !== undefined) {
    return Math.round(width / aspectRatio);
  }

  return undefined;
}

function getSrc(props: ResponsiveImageProps) {
  const width = getWidth(props) || 640;
  return props.src.imageUrlFor(width);
}

export function ResponsiveImage(props: ResponsiveImageProps) {
  const layout = getLayout(props);
  const sources = getSources(props);
  return (
    <picture>
      {sources
        .sort(
          (a, b) => (typeScore.get(b.type) ?? 0) - (typeScore.get(a.type) ?? 0),
        )
        .map((s) => (
          <source
            srcSet={s.srcset}
            type={s.mimeType}
            // @ts-expect-error awaiting correct typing
            sizes={s.sizes}
          />
        ))}
      <img
        {...props}
        style={{
          width: layout === 'responsive' ? '100%' : undefined,
          height: layout === 'responsive' ? 'auto' : undefined,
          contentVisibility: 'auto',
        }}
        loading={props.loading || 'lazy'}
        decoding={props.decoding || 'async'}
        alt={props.alt || ''}
        width={getWidth(props)}
        height={getHeight(props)}
        src={getSrc(props)}
      />
    </picture>
  );
}
