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
import {
  createMemo,
  createSignal,
  Show,
  untrack,
  type Component,
} from 'solid-js';

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

// Solid 2.x moved `isServer` to `@solidjs/web`; importing it would break 1.x.
const isServer = typeof document === 'undefined';

export type ResponsiveImageProps = ImgAttributes & ResponsiveImageArgs;

export const ResponsiveImage: Component<ResponsiveImageProps> = (props) => {
  const [loadedSrc, setLoaded] = createSignal<ImageData | undefined>(undefined);

  let imgEl: HTMLImageElement | undefined; // set via ref
  let imgElSrc: ImageData | undefined; // src the current element was created for

  // Stable reference to the live `src`; re-evaluates on prop change (1.x).
  const currentSrc = createMemo(() => props.src);

  const src = () => getSrc(props);

  // `imgEl.complete` covers cache hits, where `load` never fires. Reads DOM
  // only — writing a signal during attribute application would throw
  // `REACTIVE_WRITE_IN_OWNED_SCOPE` in Solid 2's dev runtime.
  const isLoaded = () =>
    loadedSrc() === currentSrc() ||
    // `imgElSrc === currentSrc()` scopes the check to the image the element
    // renders: a `src` swap recreates it via `keyed`, and until the new ref
    // runs, `imgEl`/`imgElSrc` still point at the detached predecessor. No
    // hydration guard needed — during a claim the ref has not run, so
    // `imgEl` is undefined and the client claim mirrors the server.
    // Comparing `ImageData` identity, not the rendered URL: two src values
    // can render the same URL (only the LQIP differing), which a URL
    // comparison would accept from the stale element.
    (!isServer && !!imgEl && imgElSrc === currentSrc() && imgEl.complete);

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
    <Show
      when={currentSrc()}
      // `keyed` is read once, synchronously, at creation in both SDKs, so a
      // tracked read would never update (Solid 2 dev: `STRICT_READ_UNTRACKED`).
      // The cast bridges the literal discriminant type to the runtime boolean.
      keyed={untrack(() => !!currentSrc().lqip) as true}
    >
      <img
        // Call-expression attribute values are reactive in both SDKs; a bare
        // accessor reference (`class={classNames}`) is not supported.
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
        // Must stay after `src`/`srcset`: compilers evaluate attributes in source
        // order, so `isLoaded()` needs the current src when reading `complete`.
        class={classNames()}
        ref={(el) => {
          // Native listener, not `onLoad`: delegated in 1.x (where `load` doesn't
          // bubble) and gone with the `on:` namespace in 2.x.
          imgEl = el;
          imgElSrc = currentSrc();
          el.addEventListener('load', () => {
            setLoaded(currentSrc());
          });

          // Solid 2 evaluates all attribute getters before applying any, so `class`
          // sees a bare `complete === true` <img>. Re-check one microtask
          // later, when the attributes are in the DOM.
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

  return (
    <Show when={currentSrc().imageTypes !== 'auto'} fallback={img}>
      <picture>
        {sourcesSorted().map((s) => (
          <source srcset={s.srcset} type={s.mimeType} sizes={s.sizes} />
        ))}
        {img}
      </picture>
    </Show>
  );
};
