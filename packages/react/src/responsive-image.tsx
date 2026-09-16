import {
  createLqipKey,
  getClassNames,
  getHeight,
  getSources,
  getSourcesSorted,
  getSrc,
  getStyles as getLqipStyles,
  getWidth,
  type ImageData,
  type ResponsiveImageArgs,
} from '@responsive-image/core';
import React, { useState, useRef, useEffect } from 'react';

export type { ResponsiveImageLayout } from '@responsive-image/core';

export type ResponsiveImageProps = Omit<
  React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  >,
  'src'
> &
  ResponsiveImageArgs;

function camelCase(kebabCase: string): string {
  return kebabCase.replace(/(-.)/g, (dashChar) =>
    dashChar.charAt(1).toUpperCase(),
  );
}

function getStyles(props: ResponsiveImageArgs, isLoaded: boolean) {
  const styles = getLqipStyles(props, isLoaded);
  if (!styles) {
    return undefined;
  }
  const reactStyles: Record<string, string | undefined> = {};
  for (const [property, value] of Object.entries(styles)) {
    reactStyles[camelCase(property)] = value;
  }
  return reactStyles;
}

const getLqipKey = createLqipKey();

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

  // When LQIP is used, we need to use a key, so when src changes, the img element is recreated to re-apply LQIP styles without having
  // the previous src visible (<img> is a stateful element!). Without LQIP, reuse existing DOM.
  // See also https://github.com/simonihmig/responsive-image/issues/1583#issuecomment-3315142391
  // Ideally, we would just use src as the key, but React only allows for simple values (numbers or strings) as key, so we need to use
  // a mapping of src to generated primitive keys, that ensures that we get the same key for the same src
  const key = getLqipKey(src);

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
      {getSourcesSorted(sources).map((s) => (
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
