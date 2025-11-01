import {
  env,
  getDestinationWidthBySize,
  getValueOrCallback,
  type ImageData,
  type ImageUrlForType,
} from '@responsive-image/core';
import React, { useState, useRef, useEffect } from 'react';

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
  type: ImageUrlForType;
  mimeType: string | undefined;
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
  const imageTypes = Array.isArray(props.src.imageTypes)
    ? props.src.imageTypes
    : [props.src.imageTypes];
  if (layout === 'responsive') {
    return imageTypes.map((type) => {
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
        mimeType: type != 'auto' ? `image/${type}` : undefined,
      };
    });
  }

  const { width } = props;
  if (width === undefined) {
    return [];
  }

  return imageTypes.map((type) => {
    const sources = pixelDensities
      .map((density) => {
        const url = props.src.imageUrlFor(width * density, type);
        return `${url} ${density}x`;
      })
      .filter((source) => source !== undefined);

    return {
      srcset: sources.join(', '),
      type,
      mimeType: type != 'auto' ? `image/${type}` : undefined,
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
  const format = props.src.imageTypes === 'auto' ? 'auto' : undefined;
  const width = getWidth(props) || 640;
  return props.src.imageUrlFor(width, format);
}

function getClassNames(
  props: ResponsiveImageArgs,
  isLoaded: boolean,
  className?: string,
) {
  const layout = getLayout(props);
  const classNames = [
    'ri-img',
    `ri-${layout === 'responsive' ? 'responsive' : 'fixed'}`,
  ];
  const lqipClass = props.src.lqip?.class;
  if (lqipClass && !isLoaded) {
    classNames.push(getValueOrCallback(lqipClass));
  }
  if (className) {
    classNames.push(className);
  }
  return classNames.join(' ');
}

function camelCase(kebabCase: string): string {
  return kebabCase.replace(/(-.)/g, (dashChar) =>
    dashChar.charAt(1).toUpperCase(),
  );
}

function getStyles(props: ResponsiveImageArgs, isLoaded: boolean) {
  if (isLoaded) {
    return undefined;
  }

  const styles = getValueOrCallback(props.src.lqip?.inlineStyles);
  if (!styles) {
    return undefined;
  }
  const reactStyles: Record<string, string | undefined> = {};
  for (const [property, value] of Object.entries(styles)) {
    reactStyles[camelCase(property)] = value;
  }
  return reactStyles;
}

let keyCounter = 0;
const keyMap = new WeakMap<ImageData, number>();

export function ResponsiveImage(props: ResponsiveImageProps) {
  const [loadedSrc, setLoaded] = useState<ImageData | undefined>(undefined);

  const { src, size, sizes, width, height, className, ...htmlAttributes } =
    props;
  const riProps: ResponsiveImageArgs = {
    src,
    size,
    sizes,
    width,
    height,
  };
  const isLoaded = loadedSrc === src;

  let key: number | undefined;

  // When LQIP is used, we need to use a key, so when src changes, the img element is recreated to re-apply LQIP styles without having
  // the previous src visible (<img> is a stateful element!). Without LQIP, reuse existing DOM.
  // See also https://github.com/simonihmig/responsive-image/issues/1583#issuecomment-3315142391
  // Ideally, we would just use src as the key, but React only allows for simple values (numbers or strings) as key, so we need to use
  // a mapping of src to generated primitive keys, that ensures that we get the same key for the same src
  if (src.lqip) {
    key = keyMap.get(src);

    if (key === undefined) {
      key = keyCounter++;
      keyMap.set(src, key);
    }
  }

  const sources = getSources(riProps);

  // check if src is already loaded (SSR) and loaded update state so LQIP options are removed
  const imgRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    if (imgRef.current?.complete) {
      setLoaded(src);
    }
  });

  const img = (
    <img
      key={key}
      className={getClassNames(riProps, isLoaded, className)}
      loading={htmlAttributes.loading || 'lazy'}
      decoding={htmlAttributes.decoding || 'async'}
      width={getWidth(riProps)}
      height={getHeight(riProps)}
      srcSet={
        src.imageTypes === 'auto'
          ? // auto format assumes only one entry in sources
            sources[0]?.srcset
          : undefined
      }
      src={getSrc(riProps)}
      {...htmlAttributes}
      data-ri-lqip={riProps.src.lqip?.attribute}
      style={getStyles(riProps, isLoaded)}
      onLoad={() => setLoaded(src)}
      ref={imgRef}
    />
  );

  if (src.imageTypes === 'auto') {
    return img;
  }

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
      {img}
    </picture>
  );
}
