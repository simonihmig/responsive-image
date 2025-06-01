import {
  env,
  getDestinationWidthBySize,
  getValueOrCallback,
  type ImageData,
  type ImageType,
} from '@responsive-image/core';
import React, { useState } from 'react';
import './responsive-image.css';

export type ResponsiveImageLayout = 'responsive' | 'fixed';

interface ResponsiveImageArgs {
  src: ImageData;
  /**
   * The [sizes attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#sizes) for `img`.
   */
  sizes?: string | undefined;
  /**
   * The [height attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#height) for `img`.
   */
  height?: number | undefined;
  /**
   * The [width attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#width) for `img`.
   */
  width?: number | undefined;
  /**
   * Number of vw units to use for responsive layout.
   */
  size?: number | undefined;
}

export type ResponsiveImageProps = Omit<
  React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  >,
  'src'
> &
  ResponsiveImageArgs;

interface ImageSource {
  srcset: string;
  type: ImageType;
  mimeType: string;
  sizes?: string | undefined;
}

const typeScore = new Map<string, number>([
  ['png', 1],
  ['jpeg', 1],
  ['webp', 2],
  ['avif', 3],
]);

const pixelDensities = [1, 2];

function getLayout(props: ResponsiveImageArgs) {
  const layout: ResponsiveImageLayout =
    props.width === undefined && props.height === undefined
      ? 'responsive'
      : 'fixed';
  return layout;
}

function getSources(props: ResponsiveImageArgs): ImageSource[] {
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

function getWidth(props: ResponsiveImageArgs) {
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

function getHeight(props: ResponsiveImageArgs) {
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

function getSrc(props: ResponsiveImageArgs) {
  const width = getWidth(props) || 640;
  return props.src.imageUrlFor(width);
}

function getClassNames(props: ResponsiveImageArgs, isLoaded: boolean) {
  const layout = getLayout(props);
  const classNames = [
    'ri-img',
    `ri-${layout === 'responsive' ? 'responsive' : 'fixed'}`,
  ];
  const lqipClass = props.src.lqip?.class;
  if (lqipClass && !isLoaded) {
    classNames.push(getValueOrCallback(lqipClass));
  }
  return classNames.join(' ');
}

function getStyles(props: ResponsiveImageArgs, isLoaded: boolean) {
  if (isLoaded) {
    return undefined;
  }

  return getValueOrCallback(props.src.lqip?.inlineStyles);
}

export function ResponsiveImage(props: ResponsiveImageProps) {
  const [isLoaded, setLoaded] = useState(false);

  const { src, size, sizes, width, height, ...htmlAttributes } = props;
  const riProps: ResponsiveImageArgs = {
    src,
    size,
    sizes,
    width,
    height,
  };

  const sources = getSources(riProps);

  return (
    <picture>
      {sources
        .sort(
          (a, b) => (typeScore.get(b.type) ?? 0) - (typeScore.get(a.type) ?? 0),
        )
        .map((s) => (
          <source
            key={s.mimeType}
            srcSet={s.srcset}
            type={s.mimeType}
            sizes={s.sizes}
          />
        ))}
      <img
        className={getClassNames(riProps, isLoaded)}
        loading={htmlAttributes.loading || 'lazy'}
        decoding={htmlAttributes.decoding || 'async'}
        width={getWidth(riProps)}
        height={getHeight(riProps)}
        src={getSrc(riProps)}
        {...htmlAttributes}
        data-ri-lqip={riProps.src.lqip?.attribute}
        style={getStyles(riProps, isLoaded)}
        onLoad={() => setLoaded(true)}
      />
    </picture>
  );
}
