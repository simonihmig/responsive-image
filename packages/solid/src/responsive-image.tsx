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
import { createSignal, Show, untrack, type Component } from 'solid-js';

import './responsive-image.css';

export type { ResponsiveImageArgs } from '@responsive-image/core';

// Not Solid's `isServer`: its specifier differs per major (`solid-js/web` in v1,
// `@solidjs/web` in v2), so it cannot be imported from one static module.
const isServer = typeof window === 'undefined';

const responsiveImageArgs = new Set<string>([
  'class',
  'src',
  'size',
  'sizes',
  'width',
  'height',
] satisfies Array<keyof ResponsiveImageArgs | 'class'>);

export type ResponsiveImageProps = ResponsiveImageArgs & {
  class?: string;
  [key: string]: unknown;
};

// `style` accepts a string or an object of (hyphenated) CSS properties. Typed
// structurally so the source compiles against both Solid v1 and v2 typings
// (v1 exposes `JSX.CSSProperties`, v2 moved the JSX namespace to @solidjs/web).
type StyleValue = string | Record<string, string | number | undefined>;

export const ResponsiveImage: Component<ResponsiveImageProps> = (props) => {
  const [loadedSrc, setLoaded] = createSignal<ImageData | undefined>(undefined);
  const attributes = () => {
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(props)) {
      if (
        key !== 'style' && // Skip style because we merge them in styles()
        !responsiveImageArgs.has(key)
      ) {
        result[key] = props[key];
      }
    }
    return result;
  };
  const isLoaded = () => loadedSrc() === props.src;

  const width = () => getWidth(props);

  const height = () => getHeight(props);

  const src = () => getSrc(props);

  const sources = () => getSources(props);

  const sourcesSorted = () => getSourcesSorted(sources());

  const classNames = () => getClassNames(props, isLoaded(), props.class);

  // LQIP styles take precedence over user-provided styles while loading, and
  // are merged so unrelated user styles (e.g. border-radius) are preserved.
  const styles = (): StyleValue | undefined => {
    const lqipStyles =
      isLoaded() || isServer ? undefined : getLqipStyles(props, isLoaded());
    const userStyles = props['style'];

    if (typeof userStyles === 'string') {
      const lqipString = lqipStyles
        ? Object.entries(lqipStyles)
            .filter(([, value]) => value !== undefined)
            .map(([property, value]) => `${property}: ${value}`)
            .join('; ')
        : '';

      return [userStyles, lqipString].filter(Boolean).join('; ') || undefined;
    }

    const merged: Record<string, string | number | undefined> = {
      ...(userStyles as
        Record<string, string | number | undefined> | undefined),
      ...lqipStyles,
    };

    return Object.keys(merged).length > 0 ? merged : undefined;
  };

  // An image that has already loaded (e.g. before hydration, or from cache)
  // may never fire `load` for us, so mark it loaded to remove LQIP styles.
  // Checked in a microtask (still before paint), as the ref runs before `src`
  // is applied; an `<img>` without `src` also reports `complete`. A ref instead
  // of a mount hook, as that is `onMount` in Solid v1 but `onSettled` in v2.
  const checkComplete = (el: HTMLImageElement) => {
    const src = untrack(() => props.src);
    // Only images with LQIP care about the loaded state: it removes the
    // placeholder styles/classes. Non-LQIP images render identically either way,
    // so updating the signal there only risks spurious re-renders.
    if (!src?.lqip) return;
    queueMicrotask(() => {
      if (el.complete && el.src && src === props.src) {
        setLoaded(src);
      }
    });
  };

  const renderImg = () => (
    // When LQIP is used, the key is our src, so when src changes, the img element is recreated to re-apply LQIP styles without having
    // the previous src visible (<img> is a stateful element!). Without LQIP, reuse existing DOM.
    // See also https://github.com/simonihmig/responsive-image/issues/1583#issuecomment-3315142391
    <Show when={props.src} keyed={untrack(() => !!props.src?.lqip) as false}>
      <img
        width={width()}
        height={height()}
        class={classNames()}
        loading="lazy"
        decoding="async"
        srcset={
          props.src?.imageTypes === 'auto'
            ? // auto format assumes only one entry in sources
              sources()[0]?.srcset
            : undefined
        }
        src={src()}
        {...attributes()}
        data-ri-lqip={props.src?.lqip?.attribute}
        style={styles()}
        ref={checkComplete}
        onLoad={() => setLoaded(props.src)}
      />
    </Show>
  );

  return (
    <Show
      when={props.src && props.src.imageTypes !== 'auto'}
      fallback={renderImg()}
    >
      <picture>
        {sourcesSorted().map((s) => (
          <source srcset={s.srcset} type={s.mimeType} sizes={s.sizes} />
        ))}
        {renderImg()}
      </picture>
    </Show>
  );
};
