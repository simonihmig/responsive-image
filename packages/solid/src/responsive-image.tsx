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
import { createMemo, createSignal, Show, type Component } from 'solid-js';

import type { ImgAttributes } from './types';

import './responsive-image.css';

export type { ResponsiveImageArgs } from '@responsive-image/core';
export type { ImgAttributes } from './types';

const responsiveImageArgs: Array<keyof ResponsiveImageArgs | 'class'> = [
  'class',
  'src',
  'size',
  'sizes',
  'width',
  'height',
];

// Version-neutral replacement for `solid-js/web`'s `isServer`.
// Solid 2.x moved the web runtime into `@solidjs/web`, so importing
// the former path would break consumers on Solid 1.x.
const isServer = typeof document === 'undefined';

export type ResponsiveImageProps = ImgAttributes & ResponsiveImageArgs;

export const ResponsiveImage: Component<ResponsiveImageProps> = (props) => {
  const [loadedSrc, setLoaded] = createSignal<ImageData | undefined>(undefined);

  let imgEl: HTMLImageElement | undefined; // set via ref

  // Track the current source reactively: Solid 1.x keeps one component
  // instance across prop updates (so `when`/`keyed` and the `isLoaded`
  // comparison must re-read the live value), while Solid 2.x may hand out
  // a different object wrapper per `props.src` read. The memo caches a
  // stable reference within each instance, and re-evaluates in Solid 1.x
  // when the prop changes.
  const currentSrc = createMemo(() => props.src);

  // The `complete` check covers the case where the browser already has the
  // image (e.g. from cache) and the `load` event has already fired before the
  // element was inserted. It reads DOM properties (not signals), so it is
  // side-effect free and valid in both Solid 1.x and 2.x — writing a signal
  // during attribute application would throw `REACTIVE_WRITE_IN_OWNED_SCOPE`
  // in Solid 2's dev runtime. The `src`/`srcset` attributes are set
  // synchronously when they are applied (unlike `currentSrc`, which resolves
  // asynchronously), so their presence guards against a premature read —
  // a bare `<img>` without a source reports `complete === true`.
  const isLoaded = () =>
    loadedSrc() === currentSrc() ||
    (!isServer &&
      !!imgEl &&
      (imgEl.getAttribute('src') !== null ||
        imgEl.getAttribute('srcset') !== null) &&
      imgEl.complete);

  const attributes = createMemo(() => {
    const rest: Record<string, unknown> = {};
    for (const key of Object.keys(props) as Array<keyof ResponsiveImageProps>) {
      if (
        responsiveImageArgs.includes(
          key as (typeof responsiveImageArgs)[number],
        )
      ) {
        continue;
      }
      rest[key as string] = (props as unknown as Record<string, unknown>)[key];
    }
    return rest;
  });

  const width = () => getWidth(props);

  const height = () => getHeight(props);

  const src = () => getSrc(props);

  const sources = () => getSources(props);

  const sourcesSorted = () => getSourcesSorted(sources());

  const classNames = () => getClassNames(props, isLoaded(), props.class);

  const styles = () => {
    if (isLoaded() || isServer) {
      return undefined;
    }

    return getLqipStyles(props, isLoaded());
  };

  const img = (
    // When LQIP is used, the key is our src, so when src changes, the img element is recreated to re-apply LQIP styles without having
    // the previous src visible (<img> is a stateful element!). Without LQIP, reuse existing DOM.
    // See also https://github.com/simonihmig/responsive-image/issues/1583#issuecomment-3315142391
    <Show when={currentSrc()} keyed={!!currentSrc().lqip as false}>
      <img
        // Note: call-expression attribute values are reactive in BOTH Solid
        // 1.x and 2.x. Passing a bare accessor reference (e.g.
        // `class={classNames}`) is unsupported: 1.x binds the function
        // itself and 2.x silently drops the attribute.
        width={width()}
        height={height()}
        loading="lazy"
        decoding="async"
        srcSet={
          currentSrc().imageTypes === 'auto'
            ? // auto format assumes only one entry in sources
              sources()[0]?.srcset
            : undefined
        }
        src={src()}
        {...attributes()}
        data-ri-lqip={currentSrc().lqip?.attribute}
        style={styles()}
        // `class` must be evaluated after `src`/`srcset` so `currentSrc` is
        // already set when `isLoaded()` consults `imgEl.complete` for images
        // the browser already has (e.g. from cache). The Solid compilers
        // evaluate element attributes in source order.
        class={classNames()}
        ref={(el) => {
          // Use a native `load` listener instead of a Solid delegated event
          // handler so it works in both Solid 1.x (where `onLoad` is
          // delegated and `load` doesn't bubble) and Solid 2.x (which
          // dropped the `on:` namespace).
          imgEl = el;
          el.addEventListener('load', () => {
            setLoaded(currentSrc());
          });

          // Solid 2 evaluates every attribute getter before any of them are
          // applied to the DOM, so by the time the `class` getter runs the
          // `src`/`srcset` attributes are not in the DOM yet and the
          // `isLoaded()` DOM check above sees a bare, `complete === true`
          // <img>. Re-check after the current flush (a microtask): the
          // attributes are applied by then, which lets the cache-hit case
          // (already-loaded images never fire `load`) drop the LQIP styles.
          queueMicrotask(() => {
            if (
              (el.getAttribute('src') !== null ||
                el.getAttribute('srcset') !== null) &&
              el.complete &&
              !isLoaded()
            ) {
              setLoaded(currentSrc());
            }
          });
        }}
      />
    </Show>
  );

  if (currentSrc().imageTypes === 'auto') {
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
