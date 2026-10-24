import {
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
import * as Solid from 'solid-js';

import './responsive-image.css';

export type { ResponsiveImageArgs } from '@responsive-image/core';

const isServer = typeof window === 'undefined';

const responsiveImageArgs: Array<keyof ResponsiveImageArgs | 'class'> = [
  'class',
  'src',
  'size',
  'sizes',
  'width',
  'height',
];

export type ResponsiveImageProps = ResponsiveImageArgs & {
  class?: string;
  [key: string]: unknown;
};

export const ResponsiveImage: Solid.Component<ResponsiveImageProps> = (
  props,
) => {
  const [loadedSrc, setLoaded] = Solid.createSignal<ImageData | undefined>(
    undefined,
  );
  const attributes = Solid.createMemo(() => {
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(props)) {
      if (
        !responsiveImageArgs.includes(
          key as keyof ResponsiveImageArgs | 'class',
        )
      ) {
        result[key] = props[key];
      }
    }
    return result;
  });
  const isLoaded = Solid.createMemo(() => loadedSrc() === props.src);

  const width = Solid.createMemo(() => getWidth(props));

  const height = Solid.createMemo(() => getHeight(props));

  const src = Solid.createMemo(() => getSrc(props));

  const sources = Solid.createMemo(() => getSources(props));

  const sourcesSorted = Solid.createMemo(() => getSourcesSorted(sources()));

  const classNames = Solid.createMemo(() =>
    getClassNames(props, isLoaded(), props.class),
  );

  const styles = Solid.createMemo(() => {
    if (isLoaded() || isServer) {
      return undefined;
    }

    return getLqipStyles(props, isLoaded());
  });

  const lqipKey = Solid.createMemo(() => !!props.src?.lqip);

  // check if src is already loaded (SSR) and update state so LQIP options are removed
  let imgEl: HTMLImageElement | undefined;
  const onMountCompat =
    (Solid as Record<string, unknown>)['onSettled'] ??
    (Solid as Record<string, unknown>)['onMount'];
  (onMountCompat as (fn: () => void) => void)(() => {
    if (imgEl?.complete) {
      setLoaded(props.src);
    }
  });

  const img = (
    // When LQIP is used, the key is our src, so when src changes, the img element is recreated to re-apply LQIP styles without having
    // the previous src visible (<img> is a stateful element!). Without LQIP, reuse existing DOM.
    // See also https://github.com/simonihmig/responsive-image/issues/1583#issuecomment-3315142391
    <Solid.Show
      when={props.src}
      keyed={Solid.untrack(() => lqipKey()) as false}
    >
      <img
        width={width()}
        height={height()}
        class={classNames()}
        loading="lazy"
        decoding="async"
        srcSet={
          props.src?.imageTypes === 'auto'
            ? // auto format assumes only one entry in sources
              sources()[0]?.srcset
            : undefined
        }
        src={src()}
        {...attributes()}
        data-ri-lqip={props.src?.lqip?.attribute}
        style={styles()}
        ref={(el: HTMLImageElement) => {
          imgEl = el;
        }}
        onLoad={() => setLoaded(props.src)}
      />
    </Solid.Show>
  );

  if (Solid.untrack(() => props.src?.imageTypes === 'auto')) {
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
